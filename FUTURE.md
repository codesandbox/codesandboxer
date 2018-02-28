## We need more tests!

1. More tests, make sure there is better file coverage
2. Add a `preLoad` prop, for people who want to load ahead of time
3. Add the option to pass in states for the button:

```js
{
  base: <Component />;
  loading: <Component />;
  error: error => <Component error={error} />;
}
```

Passing in an object like this makes the button properly show feedback.

4. Chase up Joss about how to render the button, alongside the content that people pass us.
