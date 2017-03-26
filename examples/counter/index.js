import Counter from "./counter";
import patchc from "../../src/patch/component";
import patchv from "../../src/patch/view";
import patchk from "../../src/patch/keys";

const vnode = patchc(Counter());

const root = document.createElement("div");
document.body.appendChild(root);
patchv(root, vnode.elm.view.effect());

patchk(vnode.elm.keys.effect());
