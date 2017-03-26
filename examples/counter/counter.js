import h from "snabbdom/h";

export default () =>
  h("counter", {
    stateful: {
      init: () => 0,
      actions: {
        inc: (state, event) => state + 1,
        dec: (state, event) => state - 1
      }
    },
    view: props =>
      ({ state, actions }) =>
        h("div", [
          h("button", { on: { click: actions.dec } }, "-"),
          h("span", state.toString()),
          h("button", { on: { click: actions.inc } }, "+")
        ]),
    keys: props =>
      ({ state, actions }) =>
        h("counter", {
          "=": actions.inc,
          "-": actions.dec
        })
  });
