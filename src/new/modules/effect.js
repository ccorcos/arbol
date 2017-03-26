export default (name, patch) => {
  return {
    create(emptyVNode, vnode) {
      if (vnode.data[name]) {
        const elm = vnode.elm;
        elm[name] = {};

        const effect = props => {
          const vnode = effect.vnode;
          const elm = vnode.elm;
          elm[name].props = props;
          const children = (vnode.children || [])
            .map(child => child.elm[name].effect);
          const result = vnode.data[name](props)(elm.bag, children);
          elm[name].result = result;
          return result;
        };
        effect.vnode = vnode;
        elm[name].effect = effect;

        const listener = () => {
          const vnode = listener.vnode;
          const elm = vnode.elm;
          const props = elm[name].props;
          const prev = elm[name].result;
          const next = elm[name].effect(props);
          patch(prev, next);
        };
        listener.vnode = vnode;
        elm.listeners[name] = listener;
      }
    },
    update(oldVnode, vnode) {
      if (vnode.data[name]) {
        vnode.elm[name].handler.vnode = vnode;
        vnode.listeners[name].vnode = vnode;
      }
    },
    destroy(vnode) {
      if (vnode.data[name]) {
        delete vnode.elm.listeners[name];
      }
    }
  };
};
