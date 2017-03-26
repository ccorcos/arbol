// This is class represents an HTML DOM node and is supposed to hold all of the mutable state. VNodes have a .elm property that references a type like this and gets passed on from one VNode to the next.

export default class MutableElement {
  constructor(tagName) {
    this.tagName = tagName;
    this.children = [];
    this.parentNode = null;
    this.nextSibling = null;
  }
  insertBefore(newNode, referenceNode) {
    newNode.parentNode = this;
    newNode.nextSibling = referenceNode;
    this.children.splice(this.children.indexOf(referenceNode), 0, newNode);
  }
  removeChild(child) {
    child.parentNode = undefined;
    child.nextSibling = undefined;
    this.children.splice(this.children.indexOf(child), 1);
  }
  appendChild(child) {
    child.parentNode = this;
    child.nextSibling = undefined;
    this.children.push(child);
  }
}
