// state: 'normal',
// start: undefined,
// current: undefined,
// selected: 0,
// nextId: 0,
// rects: {},

import shallowCompare from "react-addons-shallow-compare";

class FiniteStateComponent extends React.Component {
  constructor(props) {
    super(props);
    // setup the starting state
    this.state = {
      start: this.start,
      [this.start]: this.states[this.start].state,
    }
    this.
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowCompare(this.props, nextProps)) {
      return true;
    }
    if (this.state.state !== nextState.state) {
      return true;
    }
    return shallowCompare(
      this.state[this.state.state],
      nextState[nextState.state]
    );
  }
}

class Clicker extends FiniteStateComponent {
  start = 'normal'
  states = {
    normal: {
      state: {
        nextId: 0,
        rects: {}
      },
      newRect: (state, rect) => ({
        nextId: state.nextId + 1,
        rects: {
          ...state.rects,
          [state.nextId]: rect
        }
      })
    },
    draw: point => ({
      state: {
        start: point,
        current: point
      },
      mouseMove: (state, event) => ({
        ...state,
        current: { x: event.pageX, y: event.pageY }
      })
    })
  };
}

const draw = point => ({
  init: {
    start: point,
    current: point
  },
  update: {
    mouseMove: state =>
      event => ({
        ...state,
        current: { x: event.pageX, y: event.pageY }
      })
  }
});

const state = fsm({
  normal,
  draw
});
