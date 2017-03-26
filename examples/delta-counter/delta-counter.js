import h from "snabbdom/h";

// TODO.
// bind action handlers with props to reuse the function reference for laziness

export default () =>
  h("delta-counter", {
    stateful: {
      init: () => 0,
      actions: {
        inc: (state, delta) => state + delta,
        dec: (state, delta) => state - delta
      }
    },
    view: props =>
      ({ state, actions }) =>
        h("div", [
          h("button", { on: { click: () => actions.dec(props.delta) } }, "-"),
          h("span", state.toString()),
          h("button", { on: { click: () => actions.inc(props.delta) } }, "+")
        ]),
    keys: props =>
      ({ state, actions }) =>
        h("counter", {
          "=": () => actions.inc(props.delta),
          "-": () => actions.dec(props.delta)
        })
  });
