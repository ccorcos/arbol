import React from "react";
import ReactDOM from "react-dom";
import { css } from "glamor";
import keymaster from "keymaster";
import App from "./reactive";
import "./reactive";

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

  mousedown = event => {
    const point = {
      x: event.pageX,
      y: event.pageY
    };
    this.setState({
      state: "mousedown",
      start: point,
      current: point,
      selected: this.state.nextId
    });
  };

  mousemove = event => {
    if (this.state.state === "mousedown") {
      const point = {
        x: event.pageX,
        y: event.pageY
      };
      this.setState({
        current: point
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

  mouseup = event => {
    if (this.state.state === "mousedown") {
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

  mapRects = fn => {
    return Object.keys(this.state.rects).map(key => {
      return fn(this.state.rects[key], key);
    });
  };

  renderRect = (rect, key) => {
    return (
      <div
        className={box}
        key={key}
        onClick
        style={{ position: "absolute", ...rect }}
      />
    );
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
              selected={this.state.selected.toString() === id}
              onClick={this.onSelect}
            />
          );
        })}
        {this.state.state === "mousedown" &&
          <Rect
            id={this.state.nextId}
            position={this.position()}
            selected={this.state.selected === this.state.nextId}
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

class Rect extends React.PureComponent {
  onMouseDown = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  onClick = event => {
    this.props.onClick(this.props.id);
  };

  render() {
    return (
      <div
        className={css(rect, this.props.selected && selected)}
        onClick={this.onClick}
        onMouseDown={this.onMouseDown}
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
