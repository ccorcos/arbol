import init from "../component/init";
import statefulModule from "../component/modules/stateful";
import effectModule from "../component/modules/effect";
import patchv from "./view";
import patchk from "./keys";

export default init([
  statefulModule,
  effectModule("view", patchv),
  effectModule("keys", patchk)
]);
