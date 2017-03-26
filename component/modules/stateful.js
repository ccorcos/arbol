const createHandler = name => {
  const handler = (...args) => {
    const vnode = handler.vnode;
    const bag = vnode.elm.bag;
    const actions = vnode.data.stateful.actions;
    bag.state = actions[name](bag.state, ...args);
    vnode.elm.update();
  };
  return handler;
};

export default {
  create(emptyVNode, vnode) {
    if (vnode.data.stateful) {
      const elm = vnode.elm;
      // initialize the state of the component
      elm.bag.state = vnode.data.stateful.init();
      // create a single function reference for the actions
      elm.bag.actions = {};
      Object.keys(vnode.data.stateful.actions).forEach(name => {
        // this function references it's own .vnode property
        const handler = createHandler(name);
        handler.vnode = vnode;
        elm.bag.actions[name] = handler;
      });
    }
  },
  update(oldVnode, vnode) {
    if (vnode.data.stateful) {
      const next = vnode.data.stateful.actions;
      const actions = vnode.elm.bag.actions;
      Object.keys(next).forEach(name => {
        if (!(name in actions)) {
          // create a new handler if needed
          actions[name] = createHandler(name);
        }
        // updated the handler's .vnode property
        actions[name].vnode = vnode;
      });
      Object.keys(actions).forEach(name => {
        if (!(name in next)) {
          // clean up the actions we're no longer using
          delete actions[name];
        }
      });
    } else {
      // clean up the state and everything
      delete vnode.elm.bag.state;
      delete vnode.elm.bag.actions;
    }
  },
  destroy(vnode) {
    delete vnode.elm.bag.state;
    delete vnode.elm.bag.actions;
  }
};
