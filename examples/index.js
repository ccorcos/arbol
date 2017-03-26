import Counter from "./counter";
import DeltaCounter from "./delta-counter";
import TwoCounters from "./two-counters";
import start from "./start";

// start(Counter(), {});
// start(DeltaCounter(), { delta: 2 });
start(TwoCounters(), { multiple: 10 });
