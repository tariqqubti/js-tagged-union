import {Make} from './Tag.js';

export const Pass = Make('Pass');
export const Fail = Make('Fail');

export const Check = (x, predicate) => 
  predicate(x) ? Pass(x) : Fail(x);

export const CheckForm = form => {
  const passed = [];
  for(const [val, validator] of form)
    if(validator(val)) passed.push(val);

  if(form.length === passed.length)
    return Pass(passed);
  else
    return Fail(passed);
};