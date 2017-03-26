import snabbdom from "snabbdom";
import classModule from "snabbdom/modules/class";
import propsModule from "snabbdom/modules/props";
import styleModule from "snabbdom/modules/style";
import eventModule from "snabbdom/modules/eventlisteners";

export default snabbdom.init([
  classModule,
  propsModule,
  styleModule,
  eventModule
]);
