## Things I am working on

- [x] More tests, make sure there is better file coverage
- [ ] Be super careful to catch all errors
- [ ] Rewrite readme to focus on use-cases and explaining how to implement them.
- [ ] For replacements and file fetching, support `requires` as well as `imports`
- [x] pull all of the logic around navigating filePaths into its own Package - not going to do this.
- [x] pull the logic around fetching and then deploying files to CSB into its own Package
- [ ] Look into supporting non-`create-react-app` uploads (Having to parse non-js files will need to be a part of this)
- [ ] Make the sendFilesToCSB() function take in the files object and some other metadata instead of only ever the parameters.
- [ ] With `codesandboxer`, refactor the shape of it. Take in a single object as argument, to make it easier to pass things around, and so we stop having the problem of ever-expanding functions. Move more properties into a generic `config` object
- [ ] Rename repository to `codesandboxer`, as this is now a monorepo
