import snabbdom from 'snabbdom'
import classModule from 'snabbdom/modules/class'
import propsModule from 'snabbdom/modules/props'
import styleModule from 'snabbdom/modules/style'
import eventlistenersModule from 'snabbdom/modules/eventlisteners'
import h from 'snabbdom/h'
import { VNode } from 'snabbdom/vnode'
import flyd from 'flyd'

const patch = snabbdom.init([ // Init patch function with chosen modules
	classModule, // makes it easy to toggle classes
	propsModule, // for setting properties on DOM elements
	styleModule, // handles styling on elements with support for animations
	eventlistenersModule, // attaches event listeners
]);


type point = { x: number, y: number }
type rect = [point, point]

const drawRect = ([p1, p2]: rect): VNode =>
	h('div', {
		position: 'absolute',
		top: Math.min(p1.y, p2.y),
		left: Math.min(p1.x, p2.x),
		width: Math.abs(p1.x - p2.x),
		height: Math.abs(p1.y - p2.y),
		border: '1px solid black',
	})

const app = (render: (n: VNode) => void) => (transition: (start: point) => void) => (rects: Array<rect>) => {

	const mousedown = (e: MouseEvent) => {
		transition({ x: e.pageX, y: e.pageY })
	}

	render(
		h('div', {
			style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
			on: { mousedown },
		}, rects.map(drawRect))
	)

}

const mouseMove = (render: (n: VNode) => void) => (transition: (rect: rect) => void) => (start: point) => {

	const mousemove = (e: MouseEvent) => {
		const state = { x: e.pageX, y: e.pageY }
		render(view(state))
	}

	const mouseup = (e: MouseEvent) => {
		const state = { x: e.pageX, y: e.pageY }
		transition([start, state])
	}

	const view = (state: point) =>
		h('div', {
			style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
			on: {
				mousemove,
				mouseup,
			}
		}, [
				h('div', {
					position: 'absolute',
					top: start.y,
					left: start.x,
					width: state.x - start.x,
					height: state.y - start.y,
				})
			])

	render(view(start))
}

let root = document.createElement('div')
document.body.appendChild(root)

const render$ = flyd.stream()
flyd.scan(patch, root, render$)

const start = (rects: Array<rect>): void =>
	app(render$)(
		(point) =>
			mouseMove(render$)(
				(rect) => start(rects.concat(rect))
			)(point)
	)(rects)


const state: Array<rect> = []
start(state)

// const start =
// 	app(
// 		(point: point) => (root: renderNode) =>
// 			mouseMove(
// 				(rect: rect) => (_: renderNode) => {
// 					rects.push(rect)
// 					start(rects)(root)
// 				}
// 			)(point)(root)
// 	)

// start(rects)(root)