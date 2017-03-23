// HTMLElement and Node are very similar / related types:
// http://stackoverflow.com/questions/9979172/difference-between-node-object-and-element-object

class ComponentElement {
  constructor(tagName) {
    this.tagName = tagName;
    this.children = [];
  }
  insertBefore(newNode, referenceNode) {
    const i = this.children.indexOf(referenceNode);
    if (i === -1) {
      throw new Error("referenceNode not found.");
    }
    newNode.parentNode = this;
    newNode.nextSibling = referenceNode;
    this.children.splice(i, 0, newNode);
  }
  removeChild(child) {
    const i = this.children.indexOf(child);
    if (i === -1) {
      throw new Error("child not found.");
    }
    child.parentNode = undefined;
    newNode.nextSibling = undefined;
    this.children.splice(i, 1);
  }
  appendChild(child) {
    child.parentNode = this;
    newNode.nextSibling = undefined;
    this.children.push(child);
  }
}

function error() {
  throw new Error("Unnecessary API feature.");
}

// function createElement(tagName: any): HTMLElement
function createElement(tagName) {
  return new ComponentElement(tagName);
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

export default {
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
