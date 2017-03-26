import snabbdom from "snabbdom";
import KeymasterElement from "./element";
import mutableApi from "../core/mutableapi";
import keymaster from "keymaster";

const core = {
  create(emptyVNode, vnode) {
    Object.keys(vnode.data).forEach(key => {
      const handler = () => {
        handler.vnode.data[key]();
      };
      handler.vnode = vnode;
      vnode.elm.handlers[key] = handler;
      keymaster(key, vnode.elm.scope, handler);
    });
  },
  update(oldVnode, vnode) {
    Object.keys(vnode.data).forEach(key => {
      if (key in vnode.elm.handlers) {
        vnode.elm.handlers[key].vnode = vnode;
      } else {
        const handler = () => {
          handler.vnode.data[key]();
        };
        handler.vnode = vnode;
        vnode.elm.handlers[key] = handler;
        keymaster(key, vnode.elm.scope, handler);
      }
    });
    Object.keys(vnode.elm.handlers).forEach(key => {
      if (!(key in vnode.data)) {
        delete vnode.elm.handlers[key];
        keymaster.unbind(key, vnode.elm.scope);
      }
    });
  },
  destroy(vnode) {
    Object.keys(vnode.elm.handlers).forEach(key => {
      delete vnode.elm.handlers[key];
      keymaster.unbind(key, vnode.elm.scope);
    });
  }
};

const api = mutableApi(KeymasterElement);

export default (modules = []) => {
  const patch = snabbdom.init([core, ...modules], api);
  return (prev, next) => {
    if (next === undefined) {
      return patch(new KeymasterElement(""), prev);
    } else {
      return patch(prev, next);
    }
  };
};
