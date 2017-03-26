import h from "snabbdom/h";
import Giphy from "./giphy";

export default () =>
  h(
    "two-giphy",
    {
      view: props =>
        ({ children: [first, second] }) => h("div", [first(), second()]),
      keys: props =>
        ({ children: [first, second] }) => h("two-giphy", [first(), second()]),
      fetch: props =>
        ({ children: [first, second] }) => h("two-giphy", [first(), second()])
    },
    [Giphy("guns"), Giphy("beer")]
  );
