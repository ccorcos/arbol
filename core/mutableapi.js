// `snabbdom.init` accepts an htmlDomApi argument that we're mocking out here to work with our mutable element type.

export default MutableElement => ({
  createElement(tagName) {
    return new MutableElement(tagName);
  },
  insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  },
  removeChild(node, child) {
    node.removeChild(child);
  },
  appendChild(node, child) {
    node.appendChild(child);
  },
  tagName(elm) {
    return elm.tagName;
  },
  parentNode(node) {
    return node.parentNode;
  },
  nextSibling(node) {
    return node.nextSibling;
  },
  // there are HTML-specific from Snabbdom
  createElementNS: error,
  createTextNode: error,
  createComment: error,
  setTextContent: error,
  getTextContent: error,
  isElement(node) {
    return node instanceof ComponentElement;
  },
  isText() {
    return false;
  },
  isComment() {
    return false;
  }
});

function error() {
  throw new Error("Unnecessary API feature.");
}
