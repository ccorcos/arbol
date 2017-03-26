import h from "snabbdom/h";

const giphyUrl = topic =>
  `http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&&rating=pg&tag=${topic}`;

const noop = () => {};

export default (topic = "explosions") =>
  h(`gifs:${topic}`, {
    stateful: {
      init: () => ({
        topic,
        loading: true,
        error: undefined,
        result: undefined
      }),
      actions: {
        onSuccess: (state, json) => ({
          ...state,
          error: undefined,
          loading: false,
          result: json.data.image_url
        }),
        onError: (state, error) => ({
          ...state,
          error: "Aw bummer, it didn't work!",
          loading: false,
          result: undefined
        }),
        gimmeMore: (state, event) => ({
          ...state,
          error: undefined,
          result: undefined,
          loading: true
        })
      }
    },
    view: props =>
      ({ state, actions }) =>
        h("div", [
          h("h2", state.topic),
          state.loading
            ? h("span", "loading...")
            : state.error
                ? h("span", state.error)
                : h("img", { props: { src: state.result } }),
          h("button", { on: { click: actions.gimmeMore } }, "Gimme More!")
        ]),
    keys: props =>
      ({ state, actions }) =>
        h("giphy", {
          space: state.loading ? noop : actions.gimmeMore
        }),
    fetch: props =>
      ({ state, actions }) =>
        h(
          "giphy",
          state.loading
            ? [
                h("random-gif", {
                  url: giphyUrl(state.topic),
                  onSuccess: actions.onSuccess,
                  onError: actions.onError
                })
              ]
            : []
        )
  });
