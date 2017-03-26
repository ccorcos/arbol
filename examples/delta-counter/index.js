import DeltaCounter from "./delta-counter";
import patchc from "../../src/patch/component";
import patchv from "../../src/patch/view";
import patchk from "../../src/patch/keys";

const vnode = patchc(DeltaCounter());

const root = document.createElement("div");
document.body.appendChild(root);
patchv(root, vnode.elm.view.effect({ delta: 10 }));

patchk(vnode.elm.keys.effect({ delta: 10 }));
