import MutableElement from "../core/mutableelement";

export default class ComponentElement extends MutableElement {
  constructor(tagName) {
    super(tagName);
    this.bag = {};
    this.listeners = {};
  }
  update() {
    Object.keys(this.listeners).forEach(key => this.listeners[key]());
  }
}
