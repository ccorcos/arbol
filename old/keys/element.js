import MutableElement from "../core/mutableelement";

export default class KeymasterElement extends MutableElement {
  constructor(tagName) {
    super(tagName);
    this.handlers = {};
  }
}
