# JavaScript Tagged Unions

Tagged Union implementation and some helper functions in JavaScript.

Inspired from:

* [union-js](https://github.com/quadrupleslap/union-js)
* Inspired from [pattern matching](https://doc.rust-lang.org/book/ch18-03-pattern-syntax.html) in Rust.

```js

import {Maybe, Run, Check, Http, Loading, Ok, Err} from '...';

// Each arm could be abstracted into its own function
const state = await Maybe(localStorage.getItem('userInfo')).match({ // null, undefined check
  Some: info => Run(() => JSON.parse(info)).match({ // parse json
    Ok: info => Check(info.id, x => /valid/.test(x)).match({ // run validation
      Pass: async id => (await Http(fetch(`/user/${id}`))).match({ // fetch
        Success: res => Ok(res.data), // res.status === 200
        NotFound: res => Err(Error(res.data)), // res.status === 404
        Err: err => Err(err), // timeout, disconnection, etc.
      }),
      Fail: () => Err(Error('Invalid stored user info')),
    })
    Err: () => Err(Error('Could not parse user info')),
  })
  None: () => Err(Error('Stored user info was not found'))
});
```

Back in React (or your favorite framework)

```jsx
{state.is(Loading) ?
  <Loading msg={state.val} /> :
state.is(Err) ?
  <Error msg={state.val.message} /> :
state.is(Ok) ?
  <View user={state.val} /> :
  <Error msg='Something went wrong' />
}
```

## Why

* Improve Correctness
* Avoid incomprehensible if statements
* Better handle side effects

Check [test](test/index.test.js) for more examples.
