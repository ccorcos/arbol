import React from "react";

// Because JavaScript is single threaded, we can use this singleton to keep track of which computation is currently running
const Tracker = {
  // current computation
  current: undefined
};

// We're going to generate unique ids using this counter to identify each computation
let count = 0;
const id = () => count++;

// A Computation represents a reactive function
class Computation {
  constructor(fn) {
    this.id = id();
    this.active = true;
    this.fn = fn;
    this.run();
  }
  run() {
    if (this.active) {
      const prev = Tracker.current;
      Tracker.current = this;
      this.fn();
      Tracker.current = prev;
    }
  }
  stop() {
    this.active = false;
  }
}

// A Dependency keeps track of computations that depend on some value.
class Dependency {
  subscribers = {};
  depend() {
    if (Tracker.current) {
      this.subscribers[Tracker.current.id] = Tracker.current;
    }
  }
  run() {
    Object.keys(this.subscribers).forEach(id => this.subscribers[id].run());
  }
}

// A JavaScript object with reactive properties
class ReactiveMap {
  constructor(obj) {
    this.__obj = obj;
    this.__deps = {};
    Object.keys(obj).forEach(key => {
      const dep = new Dependency();
      this.__deps[key] = dep;
      Object.defineProperty(this, key, {
        get: () => {
          dep.depend();
          return this.__obj[key];
        },
        set: value => {
          this.__obj[key] = value;
          dep.run();
        }
      });
    });
  }
}

class ReactiveComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    const self = this;
    this.__render = false;
    this.__first = true;
  }
  componentWillMount() {
    const self = this;
    self.compuation = new Computation(() => {
      self.__render = self.view();
      if (self.__first) {
        self.__first = false;
      } else {
        self.forceUpdate();
      }
    });
  }

  componentWillUnmount() {
    this.computation.stop();
  }

  render() {
    return this.__render;
  }
}

class Counter extends ReactiveComponent {
  // constructor(props) {
  //   super(props);
  // }

  store = new ReactiveMap({
    count: 0
  });

  inc = () => this.store.count++;
  dec = () => this.store.count--;
  view = () => {
    return (
      <div>
        <button onClick={this.dec}>dec</button>
        <span>{this.store.count}</span>
      </div>
    );
  };
}

export default Counter;
