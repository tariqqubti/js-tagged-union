export const Make = kind => {
  const Maker = val => new Instance(kind, val);
  Maker.kind = kind;
  return Maker;
};

export class Instance {
  constructor(kind, val) {
    this.kind = kind;
    this.val = val;
  }
  is(x) {
    return this.kind === x.kind;
  }
  match(arms) {
    if(arms[this.kind])
      return arms[this.kind](this.val);
    if(arms._)
      return arms._(this.val);
    throw new Error(`Case not matched: ${this}`);
  }
  toString() {
    return `${this.kind} (${this.val})`;
  }
}