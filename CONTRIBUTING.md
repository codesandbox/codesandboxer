# Contributing

Thanks for considering contributing!

This project has been developed to serve use-cases that I have encountered with
uploading files to codesandbox, and definitely doesn't cover all use-cases. I'd
be happy though if you find something else you need for you to contribute a pull
request. I'll make sure you get a review quickly.

If you're not confident raising a pull request, open an issue, and I can talk to
you about the feature/bug fix you're looking for, and hopefully we can work out
how to do it.

## For issues

If you are reporting a bug, an attempt to understand where in our code the bug
comes from, or an easy way to reproduce it is greatly appreciated!

If you are requesting a feature, please make sure your use-case for the feature
is clearly stated, so it's easy to evaluate.

## Deving on this project

There are a couple of things that are probably good to know(TM) to dev on this
project.

### How do I get up and running?

We are using [bolt](https://github.com/boltpkg/bolt) to manage this monorepo. If
you haven't worked on a bolt project, the quick get-up-and-running steps are:

```sh
pnpm global add bolt
bolt
pnpm run build
```

The `bolt` command will install npm packages and link them.

### Observing changes

If you are trying to observe changes across linked packages, you will need to
make sure they are built.

`pnpm run build` builds all packages. `pnpm run dev:csb` runs the build script
for `codesandboxer` and watches it for changes. `pnpm run dev:rcsb` runs the
build script for `react-codesandboxer` and watches it for changes.

The other packages do not need to be built.

### Validating changes

Currently validation that things work is mostly being done through tests. The
most important tests being the ones in `codesandboxer` and `codesandboxer-fs`
which use the `/fixtures` directory to validate how they parse and load files.

## Adding Templates

Codesandboxer currently supports:

- create-react-app
- create-react-app-typescript
- vue-cli

It should be easy to add new templates. Here are the places you would need to
modify:

1. Add a template file to `packages/codesandboxer/templates/`. A template should
   include a main file that imports from `example.js` (or the relevant
   filetype), as well as any other necessary files to run the sandbox. 1a. Once
   you have your template file, export it from
   `packages/codesandboxer/templates/index.js` added to the object with the name
   of the sandbox it is for.
2. If you want a different template to be used for `codesandboxer-fs` add a
   template to `packages/codesandboxer-fs/templates` in the same way. (we tend
   to make templates for codesandboxer-fs call out the use of the sandboxer more
   explicitly, as it may be less clear how to debug it)

## For Pull Requests

### Code Standards

We're using flow to help keep our code neat. If you could add types to your
code, that would be 😎. Code that adds tests for its use-cases is also great.

### Documentation

If you add anything to the API, please update the documentation as well. (we
also accept docs PRs if you see a way to improve our documentation)

### Monitoring changes

We are using
[build-releases](https://www.npmjs.com/package/@atlaskit/build-releases) to add
intents to change, so we can make sure our packages are released at the right
semantic version. The simple answer is run `pnpm run changeset` and answer the
questions. If you're not certain about semantic versioning, I would recommend
checking out
[this documentation](https://docs.npmjs.com/about-semantic-versioning).

## Please Be Nice

I'm currently working on a code of conduct, but until that's ready, I wanted to
make sure that everyone felt welcome here. If you are looking to contribute,
please make sure you are respectful to anyone participating on this project.
