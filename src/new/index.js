import h from "snabbdom/h";
import snabbdom from "snabbdom";
import ComponentElement from "./componentelement";
import mutableApi from "./mutableapi";
import stateful from "./modules/stateful";
import effect from "./modules/effect";
import view from "./effects/snabbdom";

const componentApi = mutableApi(ComponentElement);

const patch = snabbdom.init([stateful, effect("view", view)], componentApi);

const Counter = h("counter", {
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
  keys: ({ state, actions }, children) =>
    h("", {
      "=": actions.inc,
      "-": actions.dec
    })
});

const elm = new ComponentElement("");
const vnode = patch(elm, Counter);

const root = document.createElement("div");
document.body.appendChild(root);
view(root, vnode.elm.view.effect());

// const TwoCounters = h("TwoCounters", [
//   thunk(Counter, { decBy: 2 }),
//   thunk(Counter, { decBy: 2 })
// ]);
//
// const TwoOf = kind => h(`TwoOf(${kind.name})`, [kind]);
// const TwoOfCounters = TwoOf(thunk(Counter, { decBy: 2 }));

// Examples:
// delta counters
// listOf
// undoable
// publish
