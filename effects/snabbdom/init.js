import snabbdom from "snabbdom";

// wrap the snabbdom api to create a DOM element for you to be consistent with the other effects
export default (modules = []) => {
  const patch = snabbdom.init(modules);
  return (prev, next) => {
    if (next === undefined) {
      const elm = document.createElement("div");
      return patch(elm, prev);
    } else {
      return patch(prev, next);
    }
  };
};
