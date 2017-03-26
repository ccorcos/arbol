import snabbdom from "snabbdom";
import MutableElement from "../../core/mutableelement";
import mutableApi from "../../core/mutableapi";

const createHandler = name => {
  const handler = (...args) => {
    const vnode = handler.vnode;
    const fn = vnode.data[name];
    if (fn) {
      fn(...args);
    }
  };
  return handler;
};

const core = {
  create(emptyVNode, vnode) {
    if (vnode.data.url) {
      const { url, onSuccess, onError, ...data } = vnode.data;
      const onSuccessHandler = createHandler("onSuccess");
      onSuccessHandler.vnode = vnode;
      const onErrorHandler = createHandler("onError");
      onErrorHandler.vnode = vnode;
      vnode.elm.onSuccess = onSuccessHandler;
      vnode.elm.onError = onErrorHandler;
      fetch(url, data)
        .then(r => r.json())
        .then(onSuccessHandler)
        .catch(onErrorHandler);
    }
  },
  update(oldVnode, vnode) {
    if (vnode.data.url) {
      vnode.elm.onSuccess.vnode = vnode;
      vnode.elm.onError.vnode = vnode;
    } else {
      if (vnode.elm.onSuccess) {
        delete vnode.elm.onSuccess.vnode;
      }
      if (vnode.elm.onError) {
        delete vnode.elm.onError.vnode;
      }
    }
  },
  destroy(vnode) {
    if (vnode.elm.onSuccess) {
      delete vnode.elm.onSuccess.vnode;
    }
    if (vnode.elm.onError) {
      delete vnode.elm.onError.vnode;
    }
  }
};

const api = mutableApi(MutableElement);

export default (modules = []) => {
  const patch = snabbdom.init([core, ...modules], api);
  return (prev, next) => {
    if (next === undefined) {
      return patch(new MutableElement(""), prev);
    } else {
      return patch(prev, next);
    }
  };
};
