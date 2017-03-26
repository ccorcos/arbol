function error() {
  throw new Error("Unnecessary API feature.");
}

// Create something that mocks out the htmlDomApi that Snabbdom accepts as a second argument to init. This requires some MutableElement-like object.
export default MutableElementLike => {
  // function createElement(tagName: any): HTMLElement
  function createElement(tagName) {
    return new MutableElementLike(tagName);
  }

  // function createElementNS(namespaceURI: string, qualifiedName: string): Element
  const createElementNS = error;

  // function createTextNode(text: string): Text
  const createTextNode = error;

  // function createComment(text: string): Comment
  const createComment = error;

  // function insertBefore(parentNode: Node, newNode: Node, referenceNode: Node | null): void
  function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  }

  // function removeChild(node: Node, child: Node): void
  function removeChild(node, child) {
    node.removeChild(child);
  }

  // function appendChild(node: Node, child: Node): void
  function appendChild(node, child) {
    node.appendChild(child);
  }

  // function parentNode(node: Node): Node | null
  function parentNode(node) {
    return node.parentNode;
  }

  // function nextSibling(node: Node): Node | null
  function nextSibling(node) {
    return node.nextSibling;
  }

  // function tagName(elm: Element): string
  function tagName(elm) {
    return elm.tagName;
  }

  // function setTextContent(node: Node, text: string | null): void
  const setTextContent = error;

  // function getTextContent(node: Node): string | null
  const getTextContent = error;

  // function isElement(node: Node): node is Element
  function isElement(node) {
    return node instanceof ComponentElement;
  }

  // function isText(node: Node): node is Text
  function isText(node) {
    return false;
  }

  // function isComment(node: Node): node is Comment
  function isComment(node) {
    return false;
  }

  return {
    createElement,
    createElementNS,
    createTextNode,
    createComment,
    insertBefore,
    removeChild,
    appendChild,
    parentNode,
    nextSibling,
    tagName,
    setTextContent,
    getTextContent,
    isElement,
    isText,
    isComment
  };
};
