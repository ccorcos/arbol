import h from "snabbdom/h";

const Counter = props =>
  h("counter", {
    stateful: {
      init: () => 0,
      update: (state, action) => state + action
    },
    actions: {
      inc: ({ state }) => event => +1,
      dec: ({ state }) => event => -props.decBy
    },
    view: ({ state, actions }, children) =>
      h("div", [
        h("button", { on: { click: actions.dec } }, "-"),
        h("span", state.toString()),
        h("button", { on: { click: actions.inc } }, "+")
      ]),
    keys: ({ state, actions }, children) =>
      h("", {
        "=": actions.inc,
        "-": actions.dec
      })
  });

const TwoCounters = h("TwoCounters", [
  thunk(Counter, { decBy: 2 }),
  thunk(Counter, { decBy: 2 })
]);

const TwoOf = kind => h(`TwoOf(${kind.name})`, [kind]);
const TwoOfCounters = TwoOf(thunk(Counter, { decBy: 2 }));

// Examples:
// delta counters
// listOf
// undoable
// publish
