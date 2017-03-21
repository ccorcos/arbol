import React from "react";
import { css } from "glamor";

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

const RenderLoop = {
  waiting: false,
  queue: {},
  run(dep) {
    this.queue[dep.id] = dep;
    if (!this.waiting) {
      this.waiting = true;
      window.requestAnimationFrame(() => this.flush());
    }
  },
  flush() {
    Object.keys(this.queue).forEach(id => this.queue[id].run());
    this.queue = {};
    this.waiting = false;
  }
};

// A Dependency keeps track of computations that depend on some value.
class Dependency {
  constructor() {
    this.subscribers = {};
    this.id = id();
  }
  depend() {
    if (Tracker.current) {
      this.subscribers[Tracker.current.id] = Tracker.current;
    }
  }
  run() {
    Object.keys(this.subscribers).forEach(id =>
      RenderLoop.run(this.subscribers[id]));
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

const canvas = css({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
});

class Canvas extends ReactiveComponent {
  store = new ReactiveMap({
    state: "normal",
    start: undefined,
    current: undefined,
    selected: 0,
    nextId: 0,
    rects: {}
  });

  constructor(props) {
    super(props);
  }

  mousedown = event => {
    const point = {
      x: event.pageX,
      y: event.pageY
    };
    this.store.state = "mousedown";
    this.store.start = point;
    this.store.current = point;
    this.store.selected = this.store.nextId;
  };

  mousemove = event => {
    if (this.store.state === "mousedown") {
      const point = {
        x: event.pageX,
        y: event.pageY
      };
      this.store.current = point;
    }
  };

  position = () => {
    return new ReactiveMap({
      top: Math.min(this.store.start.y, this.store.current.y),
      left: Math.min(this.store.start.x, this.store.current.x),
      height: Math.abs(this.store.start.y - this.store.current.y),
      width: Math.abs(this.store.start.x - this.store.current.x)
    });
  };

  mouseup = event => {
    if (this.store.state === "mousedown") {
      const point = {
        x: event.pageX,
        y: event.pageY
      };
      this.store.state = "normal";
      this.store.rects[this.store.nextId] = this.position();
      this.store.start = undefined;
      this.store.current = undefined;
      this.store.nextId++;
    }
  };

  mapRects = fn => {
    return Object.keys(this.store.rects).map(key => {
      return fn(this.store.rects[key], key);
    });
  };

  onSelect = id => {
    this.store.selected = id;
  };

  view() {
    return (
      <div
        className={canvas}
        onMouseDown={this.mousedown}
        onMouseMove={this.mousemove}
        onMouseUp={this.mouseup}
      >
        {this.mapRects((pos, id) => {
          return (
            <Rect
              key={id}
              id={id}
              position={pos}
              selected={this.store.selected.toString() === id}
              onClick={this.onSelect}
            />
          );
        })}
        {this.store.state === "mousedown" &&
          <Rect
            id={this.store.nextId}
            position={this.position()}
            selected={this.store.selected === this.store.nextId}
            onClick={this.onSelect}
          />}
      </div>
    );
  }
}

const rect = css({
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "black",
  backgroundColor: "#cccccc",
  borderRadius: 3
});

const selected = css({
  borderWidth: 4,
  borderColor: "blue"
});

class Rect extends ReactiveComponent {
  onMouseDown = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  onClick = event => {
    this.props.onClick(this.props.id);
  };

  view() {
    return (
      <div
        className={css(rect, this.props.selected && selected)}
        onClick={this.onClick}
        onMouseDown={this.onMouseDown}
        style={{
          position: "absolute",
          top: this.props.position.top,
          bottom: this.props.position.bottom,
          width: this.props.position.width,
          height: this.props.position.height
        }}
      />
    );
  }
}

const style = css({
  color: "blue"
});

class Index extends React.PureComponent {
  render() {
    return (
      <div className={style}>
        Hello World!
        <Canvas />
      </div>
    );
  }
}

export default Index;
