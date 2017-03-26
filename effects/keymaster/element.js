import MutableElement from "../../core/mutableelement";

export default class KeymasterElement extends MutableElement {
  constructor(tagName) {
    super(tagName);
    // a place to keep some handlers
    this.handlers = {};
  }
}
