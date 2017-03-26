export default {
  create(emptyVNode, vnode) {
    if (vnode.data.stateful) {
      const elm = vnode.elm;
      elm.bag.state = vnode.data.stateful.init();
      elm.bag.actions = {};
      Object.keys(vnode.data.stateful.actions).forEach(name => {
        // if the handler references its own vnode property, then we can reuse this reference even when the state changes!
        const handler = (...args) => {
          handler.vnode.elm.bag.state = handler.vnode.data.stateful.actions[
            name
          ](handler.vnode.elm.bag.state, ...args);
          handler.vnode.elm.update();
        };
        handler.vnode = vnode;
        elm.bag.actions[name] = handler;
      });
    }
  },
  update(oldVnode, vnode) {
    // TODO. lots of weird edge cases we could consider here
    if (vnode.data.stateful) {
      // just update handlers so they reference the new action functions in case they change.
      vnode.elm.bag.handlers.forEach(handler => {
        handler.vnode = vnode;
      });
    }
  }
};
