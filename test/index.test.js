import {assertEquals} from 'https://deno.land/std/testing/asserts.ts';
import {Maybe, Check, Run, Future, Ok} from '../src/index.js';
const equals42 = x => x === 42;

Deno.test('Maybe', () => {
  const none = Maybe(null);
  assertEquals(none.match({None: () => true}), true);
  const some = Maybe(42);
  assertEquals(some.match({Some: v => v}), 42);
});

Deno.test('Valid', () => {
  const valid = Check(42, equals42);
  assertEquals(valid.match({Pass: x => x}), 42);
  const invalid = Check(41, equals42);
  assertEquals(invalid.match({Fail: x => x}), 41);
});

Deno.test('Task', () => {
  const success = Run(() => 42);
  assertEquals(success.match({Ok: x => x}), 42);
  const failure = Run(() => {throw new Error(42);});
  assertEquals(failure.match({Err: err => err.message}), '42');
});

Deno.test('Future', async () => {
  const answer = await Future(Promise.resolve(42));
  assertEquals(answer.match({Done: x => x}), 42);
});

Deno.test('Mix', () => {
  const id = Maybe(42).match({
    Some: _id => Check(42, equals42).match({
      Pass: _id => Run(() => _id).match({
        Ok: _id => _id,
      }),
    }),
  });
  assertEquals(id, 42);
});

Deno.test('Find User', async () => {
  const id = 42;
  const name = 'zaphod';
  const findPromise = Promise.resolve({id, name});
  const user = await Maybe(id).match({
    Some: async id => (await Future(findPromise)).match({
      Done: user => Ok(user),
    }),
  });
  assertEquals(user.val.name, name);
});