import React from "react";
import { css } from "glamor";

// FIX.
// - dragging with id...

// TODO.
// - select, move, resize, delete

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
  move(p2) {
    return new Parent(
      this.nextId,
      this.rects,
      new Draw(this.state.p1, p2, this.state.done)
    );
  }
  drag(id, point) {
    const rect = this.rects[id];
    delete this.rects[id];
    return new Parent(
      this.nextId,
      this.rects,
      new Drag(point, point, rect, this.addRect)
    );
  }
  dragging(p2) {
    return new Parent(
      this.nextId,
      this.rects,
      new Drag(this.state.p1, p2, this.state.pos, this.state.done)
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

const pointsToMovedRect = (rect, p1, p2) => ({
  top: rect.top + (p1.y - p2.y),
  left: rect.left + (p1.x - p2.x),
  width: rect.width,
  height: rect.height
});

class Drag {
  constructor(p1, p2, pos, done) {
    this.p1 = p1;
    this.p2 = p2;
    this.pos = pos;
    this.done = done;
  }
  rect() {
    return pointsToMovedRect(this.pos, this.p1, this.p2);
  }
  up(p2) {
    const pos = pointsToMovedRect(this.pos, this.p1, p2);
    return this.done(pos);
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
    if (this.state.fsm.state instanceof Normal) {
      this.setState({
        fsm: this.state.fsm.draw({ x: e.pageX, y: e.pageY })
      });
    }
  };

  onMouseMove = e => {
    if (this.state.fsm.state instanceof Draw) {
      this.setState({
        fsm: this.state.fsm.move({ x: e.pageX, y: e.pageY })
      });
    }
  };

  onMouseUp = e => {
    if (this.state.fsm.state instanceof Draw) {
      this.setState({
        fsm: this.state.fsm.state.up({ x: e.pageX, y: e.pageY })
      });
    }
  };

  mapRects = fn => {
    return Object.keys(this.state.fsm.rects).map(key => {
      return fn(this.state.fsm.rects[key], key);
    });
  };

  onRectMouseDown = (id, e) => {
    if (this.state.fsm.state instanceof Normal) {
      debugger;
      e.preventDefault();
      e.stopPropagation();
      this.setState({
        fsm: this.state.fsm.drag(id, { x: e.pageX, y: e.pageY })
      });
    }
  };

  onRectMouseMove = (id, e) => {
    if (this.state.fsm.state instanceof Drag) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({
        fsm: this.state.fsm.dragging({ x: e.pageX, y: e.pageY })
      });
    }
  };

  onRectMouseUp = (id, e) => {
    if (this.state.fsm.state instanceof Drag) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({
        fsm: this.state.fsm.state.up({ x: e.pageX, y: e.pageY })
      });
    }
  };

  render() {
    console.log(this.state.fsm.state);
    return (
      <div
        className={canvas}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
      >
        {this.mapRects((rect, key) => (
          <Rect
            onMouseDown={this.onRectMouseDown}
            onMouseMove={this.onRectMouseMove}
            onMouseUp={this.onRectMouseUp}
            key={key}
            id={key}
            position={rect}
          />
        ))}
        {(this.state.fsm.state instanceof Draw ||
          this.state.fsm.state instanceof Drag) &&
          <Rect
            onMouseDown={() => {}}
            onMouseMove={() => {}}
            onMouseUp={() => {}}
            position={this.state.fsm.state.rect()}
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

class Rect extends React.PureComponent {
  onMouseDown = e => this.props.onMouseDown(this.props.id, e);
  onMouseMove = e => this.props.onMouseMove(this.props.id, e);
  onMouseUp = e => this.props.onMouseUp(this.props.id, e);
  render() {
    return (
      <div
        className={rect}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        style={{ position: "absolute", ...this.props.position }}
      />
    );
  }
}

export default Canvas;
