import MutableElement from "../../core/mutableelement";

// each element needs a unique scope so we can clean everything up at the end
let count = 0;
const scope = () => (count++).toString();

export default class KeymasterElement extends MutableElement {
  constructor(tagName) {
    super(tagName);
    // a place to keep some handlers
    this.handlers = {};
    // create a unique scope for this element
    this.scope = scope();
  }
}
