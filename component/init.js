import snabbdom from "snabbdom";
import mutableApi from "../core/mutableapi";
import ComponentElement from "./element";

const api = mutableApi(ComponentElement);

export default (modules = []) => {
  // patch with snabbdom using the component api
  const patch = snabbdom.init(modules, api);
  // override the default functionality to provide a ComponentElement if you don't provide one.
  return (prev, next) => {
    if (next === undefined) {
      return patch(new ComponentElement(""), prev);
    } else {
      return patch(prev, next);
    }
  };
};
