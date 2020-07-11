import {Make} from './Tag.js';

export const None = Make('None');
export const Some = Make('Some');

export const Maybe = val =>
  (typeof val === 'undefined' || val === null) ?
  None() : Some(val);