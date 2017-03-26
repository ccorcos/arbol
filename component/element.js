import MutableElement from "../core/mutableelement";

export default class ComponentElement extends MutableElement {
  constructor(tagName) {
    super(tagName);
    // this bag is used to pass arguments into effects
    this.bag = {};
    // functions that are triggered on each state update
    this.listeners = {};
    // a place to keep some state for each of the effects
    this.effects = {};
  }
  update() {
    Object.keys(this.listeners).forEach(key => this.listeners[key]());
  }
}
