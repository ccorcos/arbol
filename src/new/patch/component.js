import init from "../component/init";
import statefulModule from "../component/modules/stateful";
import effectModule from "../component/modules/effect";
import patchv from "./view";

export default init([statefulModule, effectModule("view", patchv)]);
