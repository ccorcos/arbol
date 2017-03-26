import TwoCounters from "./two-counters";
import patchc from "../../src/patch/component";
import patchv from "../../src/patch/view";
import patchk from "../../src/patch/keys";

const vnode = patchc(TwoCounters());

const root = document.createElement("div");
document.body.appendChild(root);
patchv(root, vnode.elm.view.effect({ multiple: 10 }));

patchk(vnode.elm.keys.effect({ multiple: 10 }));
