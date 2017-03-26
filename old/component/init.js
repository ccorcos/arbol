import snabbdom from "snabbdom";
import Element from "./element";
import mutableApi from "../core/mutableapi";

const api = mutableApi(Element);

export default modules => {
  const patch = snabbdom.init(modules, api);
  return (prev, next) => {
    if (next === undefined) {
      return patch(new Element(""), prev);
    } else {
      return patch(prev, next);
    }
  };
};
