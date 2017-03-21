import React from "react";
import ReactDOM from "react-dom";
import { css } from "glamor";
import App from "./thinking";
import keymaster from "keymaster";

const canvas = css({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
});

class Canvas extends React.PureComponent {
  state = {
    state: "normal",
    start: undefined,
    current: undefined,
    selected: 0,
    nextId: 0,
    rects: {}
  };

  constructor(props) {
    super(props);
  }

  onMouseDown = event => {
    const point = {
      x: event.pageX,
      y: event.pageY
    };
    this.setState({
      state: "draw",
      start: point,
      current: point,
      selected: this.state.nextId
    });
  };

  onRectMouseDown = (id, event) => {
    if (this.state.state === "normal") {
      event.preventDefault();
      event.stopPropagation();

      const point = {
        x: event.pageX,
        y: event.pageY
      };
      this.setState({
        state: "move",
        start: point,
        selected: id
      });
    }
  };

  onMouseMove = event => {
    if (this.state.state === "draw") {
      const point = {
        x: event.pageX,
        y: event.pageY
      };
      this.setState({
        current: point
      });
    }
  };

  onRectMouseMove = (id, event) => {
    if (this.state.state === "move") {
      event.preventDefault();
      event.stopPropagation();

      const point = {
        x: event.pageX,
        y: event.pageY
      };
      console.log(this.state.rects[id].top, point.y, this.state.start.y);
      this.setState({
        rects: {
          ...this.state.rects,
          [id]: {
            top: this.state.rects[id].top + point.y - this.state.start.y,
            left: this.state.rects[id].left + point.x - this.state.start.x
          }
        }
      });
    }
  };

  position = () => {
    return {
      top: Math.min(this.state.start.y, this.state.current.y),
      left: Math.min(this.state.start.x, this.state.current.x),
      height: Math.abs(this.state.start.y - this.state.current.y),
      width: Math.abs(this.state.start.x - this.state.current.x)
    };
  };

  onMouseUp = event => {
    if (this.state.state === "draw") {
      const point = {
        x: event.pageX,
        y: event.pageY
      };
      this.setState({
        state: "normal",
        start: undefined,
        current: undefined,
        nextId: this.state.nextId + 1,
        rects: {
          ...this.state.rects,
          [this.state.nextId]: this.position()
        }
      });
    }
  };

  onRectMouseUp = (id, event) => {
    if (this.state.state === "move") {
      event.preventDefault();
      event.stopPropagation();

      this.onRectMouseMove(id, event);
      this.setState({
        state: "normal",
        start: undefined
      });
    }
  };

  mapRects = fn => {
    return Object.keys(this.state.rects).map(key => {
      return fn(this.state.rects[key], key);
    });
  };

  onSelect = id => {
    this.setState({
      selected: id
    });
  };

  render() {
    return (
      <div
        className={canvas}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
      >
        {this.mapRects((pos, id) => {
          return (
            <Rect
              key={id}
              id={id}
              position={pos}
              selected={this.state.selected.toString() === id}
              onMouseDown={this.onRectMouseDown}
              onMouseMove={this.onRectMouseMove}
              onMouseUp={this.onRectMouseUp}
            />
          );
        })}
        {this.state.state === "draw" &&
          <Rect
            id={this.state.nextId}
            position={this.position()}
            selected={this.state.selected === this.state.nextId}
            onMouseDown={this.onRectMouseDown}
            onMouseMove={this.onRectMouseMove}
            onMouseUp={this.onRectMouseUp}
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

class Rect extends React.PureComponent {
  onMouseDown = event => {
    this.props.onMouseDown(this.props.id, event);
  };

  onMouseMove = event => {
    this.props.onMouseMove(this.props.id, event);
  };

  onMouseUp = event => {
    this.props.onMouseUp(this.props.id, event);
  };

  render() {
    return (
      <div
        className={css(rect, this.props.selected && selected)}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        style={{ position: "absolute", ...this.props.position }}
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

const root = document.createElement("div");
document.body.appendChild(root);

ReactDOM.render(<App />, root);
