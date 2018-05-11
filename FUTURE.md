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
- [ ] Add error boundaries around the loaded example component, to allow a better debugging experience when something goes wrong.

## New packages to build

- [ ] `fs-codesandboxer`, which can read from your local filesystem instead of fetching grom github or bitbucket. Can use `codesandboxer` for `parseFile()`. May need some of the assembly logic in `getFiles` exposed separate to doing the fetch.
- [ ] deploy editor plugins (for vs code and atom), to open code directly from an editor. (this would rely on having `fs-codesandboxer` first)
- [ ] add plugins for github/bitbucket to allow you to open a file you are viewing in a web browser in codesandbox


## Supporting other sandbox types

Generically, it would be good if codesandboxer could take in an option for the kind of sandbox it wants to generate. As we have a set of base files we need to render the example, we realistically probably want a base for each sandbox type. Bonus points if we can go any way to dynamically discovering this.




