import snabbdom from "snabbdom";
import h from "snabbdom/h";
import classModule from "snabbdom/modules/class";
import propsModule from "snabbdom/modules/props";
import styleModule from "snabbdom/modules/style";
import eventModule from "snabbdom/modules/eventlisteners";
import componentApi, {
  ComponentElement,
  componentModule,
  statefulModule,
  effectModule,
  fetchModule
} from "./componentapi";

const patchView = snabbdom.init([
  classModule,
  propsModule,
  styleModule,
  eventModule
]);

const patchFetch = snabbdom.init([fetchModule]);

const patchComponent = snabbdom.init(
  [
    componentModule,
    statefulModule,
    effectModule("view", patchView),
    effectModule("fetch", patchFetch)
  ],
  componentApi
);

const Counter = h("counter", {
  stateful: {
    init: () => 0,
    actions: {
      inc: (state, event) => state + 1,
      dec: (state, event) => state - 1
    }
  },
  view: ({ state, actions }, children) =>
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

const componentRootElement = new ComponentElement("");
const componentRootVNode = patchComponent(componentRootElement, Counter);

const viewRootElement = document.createElement("div");
document.body.appendChild(viewRootElement);
const viewRootVNode = patchView(
  viewRootElement,
  componentRootVNode.effects.view
);

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
