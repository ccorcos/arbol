# Arbol

Arbol is an architecture for writing unapologetically declarative code.

It's based on an insight that rendering to the DOM is an asynchronous side-effect that's fundamentally no different from an HTTP request, a WebSocket subscription, or a key event listener.

Declarative rendering libraries like React, Virtual DOM, and Snabbdom work by computing the difference between two lazy trees that are a declarative representation of the DOM. So let's use this same approach for all of our side-effects.

Arbol is just thin layer on top of Snabbdom which takes care of all the tree diffing letting you focus on building declarative services.

So where do I start? Let's start by defining a basic counter component.

```js
import h from "snabbdom/h";

const Counter = () =>
  h("counter", {
    stateful: {
      init: () => 0,
      actions: {
        inc: (state, event) => state + 1,
        dec: (state, event) => state - 1
      }
    },
    view: props =>
      ({ state, actions }) =>
        h("div", [
          h("button", { on: { click: actions.dec } }, "-"),
          h("span", state.toString()),
          h("button", { on: { click: actions.inc } }, "+")
        ]),
  });
```

You'll notice that we used the same `h` for the view function as well as the counter component itself. That's because components themselves are structures inside a lazy tree!

Man, this is really hard to explain. I'll stop here for now...
