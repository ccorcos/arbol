
// to draw something on the screen...
// - click draw tool
// - click and hold mouse
// - move the mouse
// - lift up the mouse

// different types of actions
// - transition actions
// - internal actions

// different types of state
// - global app state
// - local component state
// - values passed during the transition

// why? to limit the complexity of feasible codepaths

// demos
// - click and drag to draw a square
// - select and move a square
// - click a tool to select a different object


const welcoome = (transition) =>
	({
		view: () =>
			h('div', [
				h('button', { on: { click: transition.login } }, 'login'),
				h('button', { on: { click: transition.signup } }, 'signup'),
			])
	})


// const login = username({
// 	password: password({
// 		submit: submit({
// 			success: success({
// 				restart: () => { },
// 			}),
// 			failure: success({
// 				restart: () => { },
// 			})
// 		})
// 	})
// })



const username = (transition) =>
	({
		stateful: {
			state: '',
			update: {
				change: (state, event) => event.target.value,
			},
		},
		action: {
			keydown: (state, event) => event.keyCode === 13 ? transition.password(state) : null,
		},
		view: (state, actions) =>
			h('input', {
				props: {
					placeholder: 'username',
					type: 'text',
					value: state
				}, on: {
					change: actions.change,
					keydown: actions.keydown
				}
			})
	})

const password = (transition) => (username) =>
	({
		state: '',
		update: {
			change: (state, event) => event.target.value,
			keydown: (state, event) => event.keyCode === 13 ? transition.submit(username, state) : state,
		},
		view: (state, actions) =>
			h('input', {
				props: {
					placeholder: 'password',
					type: 'password',
					value: state
				},
				on: {
					change: actions.change,
					keydown: actions.keydown
				}
			})
	})

const submit = (transition) => (username, password) =>
	({
		fetch: (state, actions) =>
			h('/login', { on: { success: transition.success, failure: transition.failure } }),
		view: (state, actions) =>
			h('div', 'loading...')
	})

const success = (transition) => (token) =>
	({
		view: (state, actions) =>
			h('div', [
				h('div', 'logged in!'),
				h('button', { on: { click: transition.restart } }, 'logout')
			])
	})

const error = (transition) => (error) =>
	({
		view: (state, actions) =>
			h('div', [
				h('div', error),
				h('button', { on: { click: transition.restart } }, 'try again')
			])
	})

