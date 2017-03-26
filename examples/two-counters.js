import h from "snabbdom/h";
import DeltaCounter from "./delta-counter";

export default () =>
  h(
    "two-counters",
    {
      view: props =>
        ({ children: [first, second] }) =>
          h("div", [first({ delta: 1 }), second({ delta: 2 })]),
      keys: props =>
        ({ children: [first, second] }) =>
          h("two-counters", [
            first({ delta: 1 * props.multiple }),
            second({ delta: 2 * props.multiple })
          ])
    },
    [DeltaCounter(), DeltaCounter()]
  );
