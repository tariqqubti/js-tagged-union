import {Make} from './Tag.js';

export const Ok = Make('Ok');
export const Err = Make('Err');

export const Run = fn => {
  try {
    const res = fn();
    if(res instanceof Error)
      return Err(res);
    return Ok(res);
  } catch(err) {return Err(err);}
};

export const Loading = Make('Loading');
export const Done = Make('Done');

export const Future = async (promise) => {
  try {
    const res = await promise;
    if(res instanceof Error)
      return Err(res);
    return Done(res);
  }
  catch(err) {return Err(err);}
};

export const HttpCodes = {
  200: Make('Success'),
  201: Make('Created'),
  400: Make('Bad'),
  401: Make('UnAuth'),
  403: Make('Forbidden'),
  404: Make('NotFound'),
  500: Make('ServerErr'),
  Other: Make('Other'),
};

export const Http = async (promise) =>
  (await Future(promise)).match({
    Done: res => HttpCodes[res.status] ?
        HttpCodes[res.status](res) :
        HttpCodes.Other(res),
    Err: err => Err(err),
  });