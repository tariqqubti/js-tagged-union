import {Make} from './Tag.js';

export const Pass = Make('Pass');
export const Fail = Make('Fail');

export const Check = (x, predicate) => 
  predicate(x) ? Pass(x) : Fail(x);

export const CheckForm = (form, predicates) => {
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