# Minutiae

This is a collection of small implementation details and reasoning for those interested in the technical hows and whys.

## Why are there console errors from fetches?

There are two parts for this. The first is that even if a request's error is caught and handled, browsers will still log the failed network request. We don't have any control over this, even though we are handling these.

The second part is a file structure issue. When trying to retrieve a relative import such as `src` from a repository, we do not know if this is importing `src.js`, `src.json` or `src/index.js`. To handle this, we attempt to fetch each of these in node resolution order.

To avoid this, any file that will be uploaded to CodeSandbox would need to be imported from its exact path, to avoid ambiguity. This may be hard, as it is not just the example file that will have imports, and we do not want to force or recommend this code pattern on other parts of the codebase.
