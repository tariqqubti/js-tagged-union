import {Make} from './Tag.js';

export const Pass = Make('Pass');
export const Fail = Make('Fail');

export const Check = (x, predicate) => 
  predicate(x) ? Pass(x) : Fail(x);

export const CheckForm = (form, validators) => {
  const keys = Object.keys(validators);

  const passed = {};
  for(const key of keys)
    if(validators[key](form[key]))
      passed[key] = form[key];

  const passedKeys = Object.keys(passed);
  if(passedKeys.length === keys.length)
    return Pass(passed);
  else
    return Fail(passed);
};