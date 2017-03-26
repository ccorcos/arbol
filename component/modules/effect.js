const createEffectHandler = name => {
  const handler = props => {
    const vnode = handler.vnode;
    // save props so we can re-render when the state changes
    vnode.elm.effects[name].props = props;
    // get the effect handler for each child
    // TODO. create a thunk for every child!
    const children = (vnode.children || [])
      .map(child => child.elm.effects[name].handler);
    // evaluate the effect to get a lazy tree tree
    const result = vnode.data[name](props)({ ...vnode.elm.bag, children });
    // save it so we can patch over it later when the state changes
    vnode.elm.effects[name].result = result;
    return result;
  };
  return handler;
};

const createPatchListener = (name, patch) => {
  const listener = () => {
    const vnode = listener.vnode;
    // grab the previous props
    const props = vnode.elm.effects[name].props;
    // grab the previous vnode
    const prev = vnode.elm.effects[name].result;
    // evaluate the next node
    const next = vnode.elm.effects[name].handler(props);
    // patch it over
    patch(prev, next);
  };
  return listener;
};

export default (name, patch) => {
  return {
    create(emptyVNode, vnode) {
      if (vnode.data[name]) {
        const elm = vnode.elm;
        // create a place to save some stuff for each effect
        elm.effects[name] = {};
        // create a function that wires up the bag and children
        const handler = createEffectHandler(name);
        handler.vnode = vnode;
        vnode.elm.effects[name].handler = handler;
        // create a listener to patch over when the state changes
        const listener = createPatchListener(name, patch);
        listener.vnode = vnode;
        elm.listeners[name] = listener;
      }
    },
    update(oldVnode, vnode) {
      if (vnode.data[name]) {
        // update the vnode on the handlers
        vnode.elm.effects[name].handler.vnode = vnode;
        vnode.listeners[name].vnode = vnode;
      } else {
        // clean up
        delete vnode.elm.listeners[name];
        delete vnode.elm.effects[name];
      }
    },
    destroy(vnode) {
      delete vnode.elm.listeners[name];
      delete vnode.elm.effects[name];
    }
  };
};
