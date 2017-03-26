import snabbdom from "snabbdom";
import Element from "./element";
import mutableApi from "../core/mutableapi";
import keymaster from "keymaster";

const core = {
  create(emptyVNode, vnode) {
    const elm = vnode.elm;
    Object.keys(vnode.data).forEach(key => {
      const handler = () => {
        handler.vnode.data[key]();
      };
      handler.vnode = vnode;
      elm.handlers[key] = handler;
      keymaster(key, handler);
    });
  },
  update(oldVnode, vnode) {
    const elm = vnode.elm;
    Object.keys(elm.handlers).forEach(key => {
      const handler = elm.handlers[key];
      handler.vnode = vnode;
    });
  },
  destroy(vnode) {
    // TODO. we need some way to actully delete the listener in keymaster
    vnode.elm.handlers = {};
  }
};

const api = mutableApi(Element);

export default (modules = []) => {
  const patch = snabbdom.init([core, ...modules], api);
  return (prev, next) => {
    if (next === undefined) {
      return patch(new Element(""), prev);
    } else {
      return patch(prev, next);
    }
  };
};
