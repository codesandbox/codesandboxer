# Changelog

## v0.4.0

* Added changelog
* Add preload prop, allowing fetching of content to happen before it is used
* For imports without file extensions, attempt `.js`, `.json`, then `/index.js`, in node resolution order, instead of just failing
* child render function now returns `isDeploying` and `error`, no longer returns `files`.
* `onLoadComplete()` prop was added. It is called with files and parameters in an object.
* `afterDeploy()` is no longer called with the parameters and files. Use onLoadComplete to hook into this information.
