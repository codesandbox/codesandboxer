# Contributing

Thanks for considering contributing!

This project has been developed to serve use-cases that I have encountered with uploading files to codesandbox, and definitely doesn't cover all use-cases. I'd be happy though if you find something else you need for you to contribute a pull request. I'll make sure you get a review quickly.

If you're not confident raising a pull request, open an issue, and I can talk to you about the feature/bug fix you're looking for, and hopefully we can work out how to do it.

## For issues

If you are reporting a bug, an attempt to understand where in our code the bug comes from, or an easy way to reproduce it is greatly appreciated!

If you are requesting a feature, please make sure your use-case for the feature is clearly stated, so it's easy to evaluate.

## Deving on this project

There are a couple of things that are probably good to know(TM) to dev on this project.

### How do I get up and running?

We are using [bolt](https://github.com/boltpkg/bolt) to manage this monorepo. If you haven't worked on a bolt project, the quick get-up-and-running steps are:

```sh
yarn global add bolt
bolt
```

The `bolt` command will install npm packages and link them.

### Observing changes

Unfortunately, while packages are linked, their built versions are not necessarily kept up-to-date. Most importantly, if you make changes to `codesandboxer` which you want to test in other packages, you will need to build `codesandboxer`.

### Validating changes

Currently validation that things work is mostly being done through tests. The most important tests being the ones in `codesandboxer` and `codesandboxer-fs` which use the `/fixtures` directory to validate how they parse and load files.

## For Pull Requests

### Code Standards

We're using flow to help keep our code neat. If you could add types to your code, that would be 😎. Code that adds tests for its use-cases is also great.

### Documentation

If you add anything to the API, please update the documentation as well. (we also accept docs PRs if you see a way to improve our documentation)

### Monitoring changes

We are using [build-releases](https://www.npmjs.com/package/@atlaskit/build-releases) to add intents to change, so we can make sure our packages are released at the right semantic version. The simple answer is run `yarn changeset` and answer the questions. If you're not certain about semantic versioning, I would recommend checking out [this documentation](https://docs.npmjs.com/about-semantic-versioning).

## Please Be Nice

I'm currently working on a code of conduct, but until that's ready, I wanted to make sure that everyone felt welcome here. If you are looking to contribute, please make sure you are respectful to anyone participating on this project.