# Codesandboxer

Codesandboxer is a tool to allow you to deploy to go from an 'entry' file, and deploy that file and all related files to codesandbox. To allow its use in multiple contexts, it has been split into a monorepo.

The major use-case for codesandboxer is to allow you to easily share examples with others, or to link to editable versions of examples from a documentation website.

## Cool Stuff

With an entry file, we work to only upload the files you need, and the dependencies you use from your project, making lighter sandbox uploads.

Since we wrap the file we are given, codesandboxer can allow you to quickly open any react component in codesandbox, even if you are not set up to start editing it immediately.

## Core Bits

The core packages, [codesandboxer](/packages/codesandboxer) allows you to fetch files from github or bitbucket, given a git entry file.

[codesandboxer-fs](/packages/codesandboxer-fs) allows you to do the same kinds of actions from your terminal, and can be installed as a CLI. See its documentation for how to use it.

## Other packages

- [react-codesandboxer](/packages/react-codesandboxer) is a react wrapper around `codesandboxer` allowing you to easily render a button to open an example in codesandbox.
- [vs-codesandboxer](/packages/vs-codesandboxer) is a visual studio code extension to allow you to take an open file in vs-code and deploy it to codesandboxer (IN DEVELOPMENT).
- [atom-codesandboxer](/packages/atom-codesandboxer) is an atom extension to allow you to take an open file in atom and deploy it to codesandboxer (IN DEVELOPMENT).

## Desired future packages

Extend codesandboxer to support non-react sandboxes.

## Possible future packages

- bitbucket plugin to allow you to open a file from bitbucket directly into codesandbox.
- chrome extension to allow you to open a file from github directly into codesandbox

This repository is a mono-repo holding a number of related packages. Codesandboxer aims to make it easy
