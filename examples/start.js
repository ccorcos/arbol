// component
import initc from "../component/init";
import statefulModule from "../component/modules/stateful";
import effectModule from "../component/modules/effect";
// view / snabbdom
import initv from "../effects/snabbdom/init";
import classModule from "snabbdom/modules/class";
import propsModule from "snabbdom/modules/props";
import styleModule from "snabbdom/modules/style";
import eventModule from "snabbdom/modules/eventlisteners";
// keys / keymaster
import initk from "../effects/keymaster/init";
// fetch / http
import initf from "../effects/fetch/init";

// create the patch functions
const patchv = initv([classModule, propsModule, styleModule, eventModule]);
const patchk = initk();
const patchf = initf();
const patchc = initc([
  statefulModule,
  effectModule("view", patchv),
  effectModule("keys", patchk),
  effectModule("fetch", patchf)
]);

// start everything up
const start = (cnode, props) => {
  cnode = patchc(cnode);
  let vnode = cnode.elm.effects.view.handler(props);
  vnode = patchv(vnode);
  document.body.appendChild(vnode.elm);
  patchk(cnode.elm.effects.keys.handler(props));
  patchf(cnode.elm.effects.fetch.handler(props));
};

export default start;
