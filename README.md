# Codesandboxer

Codesandboxer is a tool to allow you to deploy to go from an 'entry' file, and deploy that file and all related files to codesandbox. Its goal is to allow you to do this from any component written anywhere, from code you are viewing on github through to code running locally on your machine, as well as build making this easy into your own websites.

To allow its use in multiple contexts, it has been split into a monorepo.

The major use-case for codesandboxer is to allow you to easily share examples with others, or to link to editable versions of examples from a documentation website.

## Cool Stuff

With an entry file, we work to only upload the files you need, and the dependencies you use from your project, making lighter sandbox uploads.

Since we wrap the file we are given, codesandboxer can allow you to quickly open any react component in codesandbox, even if you are not set up to start editing it immediately.

## Core Bits

The core packages, [codesandboxer](/packages/codesandboxer) allows you to fetch files from github or bitbucket, given a git entry file.

[codesandboxer-fs](/packages/codesandboxer-fs) allows you to do the same kinds of actions from your terminal, and can be installed as a CLI. See its documentation for how to use it.

## Other packages

- [react-codesandboxer](/packages/react-codesandboxer) is a react wrapper around `codesandboxer` allowing you to easily render a button to open an example in codesandbox.
- [vs-codesandboxer](/packages/vs-codesandboxer) is a visual studio code extension to allow you to take an open file in vs-code and deploy it to codesandboxer.
- [atom-codesandboxer](/packages/atom-codesandboxer) is an atom extension to allow you to take an open file in atom and deploy it to codesandboxer.
- Deploy from bitbucket or github http://bitbucket-codesandboxer.netlify.com/ (TEMPORARY HOME)

## Desired future packages

Extend codesandboxer to support non-react sandboxes.
