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

You'll notice that we used the same `h` for the view function as well as the counter component itself. That's because components the component hierarchy itself is a lazy tree!

We can create two counters by creating a component that has counters as children. The children are passed through to the view function where you can pass props through if you want.

```js
const TwoCounters = () =>
  h("two-counters", {
      view: props =>
        ({ children: [first, second] }) =>
          h("div", [first(), second()]),
    },
    [Counter(), Counter()]
  );
```

In the same way that Snabbdom works, the component tree is patched together using modules. The stateful module will instantiate a component's state, and the effect module will wire up effects like rendering.

For example, here's the patch function we might create for rendering using Snabbdom:

```js
import initv from "arbol/effects/snabbdom/init";
import classModule from "snabbdom/modules/class";
import propsModule from "snabbdom/modules/props";
import styleModule from "snabbdom/modules/style";
import eventModule from "snabbdom/modules/eventlisteners";

const patchv = initv([
  classModule,
  propsModule,
  styleModule,
  eventModule,
]);
```

And we can create the patch function for our components similarly:

```js
import initc from "arbol/component/init";
import statefulModule from "arbol/component/modules/stateful";
import effectModule from "arbol/component/modules/effect";

const patchc = initc([
  statefulModule,
  effectModule("view", patchv),
]);
```

We're using the effect module to wire up the all the view functions inside each component with the `patchv` function.

Then to start everything up, we just need to patch our root component and then patch each of the effects.

```js
const cnode = patchc(TwoCounters())
const vnode = patchv(cnode.elm.effects.view.handler());
document.body.appendChild(vnode.elm);
```

Its really easy to introduce other declarative side-effects using this pattern. For example, if we want to make declarative HTTP effects, we simply need to add the `fetch` effect module to our component patch function.

```js
import initf from "../effects/fetch/init";
const patchf = initf();

const patchc = initc([
  statefulModule,
  effectModule("view", patchv),
  effectModule("fetch", patchf),
]);
```

And we can use it just by adding another function into our components:

```js
const Weather = () =>
  h("weather", {
    stateful: {
      init: () => ({
        loading: true,
        error: undefined,
        result: undefined
      }),
      actions: {
        onSuccess: (state, json) => ({
          error: undefined,
          loading: false,
          result: json.data.weather
        }),
        onError: (state, error) => ({
          error: "Aw bummer, it didn't work!",
          loading: false,
          result: undefined
        }),
      }
    },
    view: props =>
      ({ state, actions }) =>
        h("div", [
          state.loading
            ? h("span", "loading...")
            : state.error
                ? h("span", state.error)
                : h("span", state.result)
        ]),
    fetch: props =>
      ({ state, actions }) =>
        state.loading
          ? h("weather", {
            url: "/api/weather",
            onSuccess: actions.onSuccess,
            onError: actions.onError
          })
          : false
  });
```

In this way, we're dealing with asynchronous side-effects all the same. Fetching HTTP requests is no different from rendering to the DOM and awaiting an asynchronous user action.

Furthermore, all side-effects compose with their children, so you could imagine building something like Relay on top of an architecture like this. The beauty of this approach is the modular way in which you can create new effectful services. This approach can work with React or any other library by simply creating an effect module used by the component patch function.
