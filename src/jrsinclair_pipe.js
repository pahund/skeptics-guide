const data = ["wurst", "boulette"];

const addSenf = x => `${x} mit senf`;
const addBroetchen = x => `${x} mit broetchen`;

const map = (f) => (functor) => functor.map(f);
const pipe = (x0, ...funcs) => funcs.reduce((x, f) => f(x), x0);

const result = pipe(data, map(addSenf),map(addBroetchen))//?
