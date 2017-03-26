import h from "snabbdom/h";
import patchc from "./patch/component";
import patchv from "./patch/view";
import patchk from "./patch/keys";

const Counter = () =>
  h("counter", {
    stateful: {
      init: () => 0,
      actions: {
        inc: (state, event) => state + 1,
        dec: (state, event) => state - 1
      }
    },
    view: props =>
      ({ state, actions }, children) =>
        h("div", [
          h("button", { on: { click: actions.dec } }, "-"),
          h("span", state.toString()),
          h("button", { on: { click: actions.inc } }, "+")
        ]),
    // we can implement a hotkeys effect module later
    keys: props =>
      ({ state, actions }, children) =>
        h("counter", {
          "=": actions.inc,
          "-": actions.dec
        })
  });

const TwoCounters = () =>
  h(
    "TwoCounters",
    {
      view: props => (_, children) => h("div", children.map(child => child())),
      keys: props => (_, children) => h("two", children.map(child => child()))
    },
    [Counter(), Counter()]
  );

//
// const TwoOf = kind => h(`TwoOf(${kind.name})`, [kind]);
// const TwoOfCounters = TwoOf(thunk(Counter, { decBy: 2 }));

// Examples:
// delta counters
// listOf
// undoable
// publish

// const vnode = patchc(Counter());
const vnode = patchc(TwoCounters());

const root = document.createElement("div");
document.body.appendChild(root);
patchv(root, vnode.elm.view.effect());

patchk(vnode.elm.keys.effect());
