var jsTaggedUnion = (function (exports) {
  'use strict';

  const Make = kind => {
    const Maker = val => new Instance(kind, val);
    Maker.kind = kind;
    return Maker;
  };

  class Instance {
    constructor(kind, val) {
      this.kind = kind;
      this.val = val;
    }
    is(x) {
      return this.kind === x.kind;
    }
    match(arms) {
      const arm = arms[this.kind];
      if(arm === true)
        return this;
      if(typeof arm === 'function')
        return arm(this.val);
      if(arms._)
        return arms._(this.val);
      throw new Error(`Case not matched: ${this}`);
    }
    toString() {
      return `${this.kind} (${this.val})`;
    }
  }

  const None = Make('None');
  const Some = Make('Some');

  const Maybe = val =>
    (typeof val === 'undefined' || val === null) ?
    None() : Some(val);

  const Pass = Make('Pass');
  const Fail = Make('Fail');

  const Check = (x, predicate) => 
    predicate(x) ? Pass(x) : Fail(x);

  const CheckForm = (form, predicates) => {
    const validations = [];
    const validated = {};
    for(const key in predicates)
      if(predicates.hasOwnProperty(key)) {
        validations.push(predicates[key](form[key]));
        validated[key] = form[key];
      }
    if(validations.every(v => v === true))
      return Pass({validated, validations});
    else
      return Fail({validated, validations});
  };

  const Ok = Make('Ok');
  const Err = Make('Err');

  const Run = fn => {
    try {
      const res = fn();
      if(res instanceof Error)
        return Err(res);
      return Ok(res);
    } catch(err) {return Err(err);}
  };

  const Loading = Make('Loading');
  const Done = Make('Done');

  const Future = async (promise) => {
    try {
      const res = await promise;
      if(res instanceof Error)
        return Err(res);
      return Done(res);
    }
    catch(err) {return Err(err);}
  };

  const HttpCodes = {
    200: Make('Success'),
    201: Make('Created'),
    400: Make('Bad'),
    401: Make('UnAuth'),
    403: Make('Forbidden'),
    404: Make('NotFound'),
    500: Make('ServerErr'),
    Other: Make('Other'),
  };

  const Http = async (promise) =>
    (await Future(promise)).match({
      Done: res => HttpCodes[res.status] ?
          HttpCodes[res.status](res) :
          HttpCodes.Other(res),
      Err: err => Err(err),
    });

  exports.Check = Check;
  exports.CheckForm = CheckForm;
  exports.Done = Done;
  exports.Err = Err;
  exports.Fail = Fail;
  exports.Future = Future;
  exports.Http = Http;
  exports.HttpCodes = HttpCodes;
  exports.Instance = Instance;
  exports.Loading = Loading;
  exports.Make = Make;
  exports.Maybe = Maybe;
  exports.None = None;
  exports.Ok = Ok;
  exports.Pass = Pass;
  exports.Run = Run;
  exports.Some = Some;

  return exports;

}({}));
