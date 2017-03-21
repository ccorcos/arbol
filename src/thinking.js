import React from "react";
import { css } from "glamor";

class Normal {}

class Parent {
  constructor(nextId, rects, state) {
    this.nextId = nextId;
    this.rects = rects;
    this.state = state;
  }
  draw(point) {
    return new Parent(
      this.nextId,
      this.rects,
      new Draw(point, point, this.addRect)
    );
  }
  addRect = rect => {
    return new Parent(
      this.nextId + 1,
      {
        ...this.rects,
        [this.nextId]: rect
      },
      new Normal()
    );
  };
  drag(point, id) {
    const rect = this.rects[id];
    return new Parent(
      this.nextId,
      this.rects,
      new Drag(point, point, rect, this.moveRect)
    );
  }
  moveRect = id =>
    rect => {
      return new Parent(
        this.nextId,
        {
          ...this.rects,
          [id]: rect
        },
        new Normal()
      );
    };
  move(p2) {
    return new Parent(
      this.nextId,
      this.rects,
      new Draw(this.state.p1, p2, this.state.done)
    );
  }
}

const pointsToRect = (p1, p2) => ({
  top: Math.min(p1.y, p2.y),
  left: Math.min(p1.x, p2.x),
  height: Math.abs(p1.y - p2.y),
  width: Math.abs(p1.x - p2.x)
});

class Draw {
  constructor(p1, p2, done) {
    this.p1 = p1;
    this.p2 = p2;
    this.done = done;
  }
  rect() {
    return pointsToRect(this.p1, this.p2);
  }
  up(p2) {
    const rect = pointsToRect(this.p1, p2);
    return this.done(rect);
  }
}

const pointsToMovedRect = (p1, p2, rect) => ({
  top: rect.top + (p1.y - p2.y),
  left: rect.left + (p1.x - p2.x),
  width: rect.width,
  height: rect.height
});

class Drag {
  constructor(p1, p2, rect, done) {
    this.p1 = p1;
    this.p2 = p2;
    this.rect = rect;
    this.done = done;
  }
  move(p2) {
    return new Drag(this.p1, p2, this.rect, this.done);
  }
  rect() {
    return pointsToMovedRect(this.rect, this.p1, this.p2);
  }
  up(p2) {
    const rect = pointsToMovedRect(this.rect, this.p1, p2);
    return this.done(rect);
  }
}

const canvas = css({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
});

class Canvas extends React.PureComponent {
  state = {
    fsm: new Parent(0, {}, new Normal())
  };

  onMouseDown = e => {
    this.setState({
      fsm: this.state.fsm.draw({ x: e.pageX, y: e.pageY })
    });
  };

  onMouseMove = e => {
    this.setState({
      fsm: this.state.fsm.move({ x: e.pageX, y: e.pageY })
    });
  };

  onMouseUp = e => {
    this.setState({
      fsm: this.state.fsm.state.up({ x: e.pageX, y: e.pageY })
    });
  };

  mapRects = fn => {
    return Object.keys(this.state.fsm.rects).map(key => {
      return fn(this.state.fsm.rects[key], key);
    });
  };

  render() {
    return (
      <div
        className={canvas}
        onMouseDown={
          this.state.fsm.state instanceof Normal ? this.onMouseDown : undefined
        }
        onMouseMove={
          this.state.fsm.state instanceof Draw ? this.onMouseMove : undefined
        }
        onMouseUp={
          this.state.fsm.state instanceof Draw ? this.onMouseUp : undefined
        }
      >
        {this.mapRects((rect, key) => <Rect key={key} position={rect} />)}
        {this.state.fsm.state instanceof Draw &&
          <Rect position={this.state.fsm.state.rect()} />}
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

class Rect extends React.PureComponent {
  render() {
    return (
      <div
        className={rect}
        style={{ position: "absolute", ...this.props.position }}
      />
    );
  }
}

export default Canvas;
