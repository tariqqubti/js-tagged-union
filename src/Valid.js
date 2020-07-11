import {Make} from './Tag.js';

export const Pass = Make('Pass');
export const Fail = Make('Fail');

export const Check = (x, pred) => 
  pred(x) ? Pass(x) : Fail(x);