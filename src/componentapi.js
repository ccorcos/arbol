// TODO.
// ComponentElement should hold the bag and the event emitter so it can get passed on to the next vnode.

class EventEmitter {
  constructor() {
    this.id = 0;
    this.subscribers = {};
  }
  subscribe(fn) {
    const id = this.id;
    this.subscribers[id] = fn;
    this.id++;
    return id;
  }
  stop(id) {
    delete this.subscribers[id];
  }
  emit(value) {
    Object.keys(this.subscribers).forEach(key => this.subscribers[key](value));
  }
}

// initializes stuff thats shared by the whole component
export const componentModule = {
  create(emptyVNode, vnode) {
    // a `bag` is just some arguments that get passed to the effects functions
    vnode.bag = {};
    // a place to keep track of all the effect results
    vnode.effects = {};
    // an event emitter for handling updates
    vnode.update = new EventEmitter();
    // a place to keep event listener ids
    vnode.listeners = {};
  }
};

export const fetchModule = {
  create(vnode) {
    vnode.success = (...args) => vnode.data.success(...args);
    vnode.failure = (...args) => vnode.data.failure(...args);
    fetch(vnode.elm.tagName).then(vnode.success).catch(vnode.failure);
  },
  update(oldVNode, vnode) {
    oldVNode.success = (...args) => vnode.data.success(...args);
    oldVNode.failure = (...args) => vnode.data.failure(...args);
  },
  destroy(vnode) {
    oldvnodeVNode.success = () => {};
    oldVNode.failure = () => {};
  }
};
