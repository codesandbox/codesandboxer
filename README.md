# Codesandboxer

[![All Contributors](https://img.shields.io/badge/all_contributors-8-orange.svg?style=flat-square)](#contributors-)

Export a component to codesandboxer:

![react-codesandboxer-example](./docs/react-codesandboxer-example.gif)

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
- [atom-codesandboxer](https://github.com/noviny/atom-codesandboxer) is an atom extension to allow you to take an open file in atom and deploy it to codesandboxer (IN DEVELOPMENT).
- [bitbucket-codesandboxer](/packages/bitbucket-codesandboxer)

![vs-codesandboxer-example](./docs/vs-codesandboxer-example.gif)

## Desired future packages

Extend codesandboxer to support non-react sandboxes.

## Contributors ✨

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Noviny"><img src="https://avatars1.githubusercontent.com/u/15622106?v=4" width="100px;" alt="Ben Conolly"/><br /><sub><b>Ben Conolly</b></sub></a><br /><a href="https://github.com/codesandbox/codesandboxer/issues?q=author%3ANoviny" title="Bug reports">🐛</a> <a href="https://github.com/codesandbox/codesandboxer/commits?author=Noviny" title="Code">💻</a> <a href="https://github.com/codesandbox/codesandboxer/commits?author=Noviny" title="Documentation">📖</a> <a href="#ideas-Noviny" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-Noviny" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-Noviny" title="Maintenance">🚧</a> <a href="https://github.com/codesandbox/codesandboxer/commits?author=Noviny" title="Tests">⚠️</a> <a href="#tool-Noviny" title="Tools">🔧</a></td>
    <td align="center"><a href="https://twitter.com/JossMackison"><img src="https://avatars3.githubusercontent.com/u/2730833?v=4" width="100px;" alt="Joss Mackison"/><br /><sub><b>Joss Mackison</b></sub></a><br /><a href="https://github.com/codesandbox/codesandboxer/commits?author=jossmac" title="Code">💻</a></td>
    <td align="center"><a href="https://dominik-wilkowski.com"><img src="https://avatars3.githubusercontent.com/u/1266923?v=4" width="100px;" alt="Dominik Wilkowski"/><br /><sub><b>Dominik Wilkowski</b></sub></a><br /><a href="#content-dominikwilkowski" title="Content">🖋</a></td>
    <td align="center"><a href="https://github.com/lukebatchelor"><img src="https://avatars2.githubusercontent.com/u/18694878?v=4" width="100px;" alt="lukebatchelor"/><br /><sub><b>lukebatchelor</b></sub></a><br /><a href="https://github.com/codesandbox/codesandboxer/commits?author=lukebatchelor" title="Code">💻</a></td>
    <td align="center"><a href="https://twitter.com/CompuIves"><img src="https://avatars3.githubusercontent.com/u/587016?v=4" width="100px;" alt="Ives van Hoorne"/><br /><sub><b>Ives van Hoorne</b></sub></a><br /><a href="https://github.com/codesandbox/codesandboxer/commits?author=CompuIves" title="Code">💻</a> <a href="https://github.com/codesandbox/codesandboxer/commits?author=CompuIves" title="Tests">⚠️</a> <a href="https://github.com/codesandbox/codesandboxer/commits?author=CompuIves" title="Documentation">📖</a></td>
    <td align="center"><a href="https://gilles.demey.io"><img src="https://avatars1.githubusercontent.com/u/868844?v=4" width="100px;" alt="Gilles De Mey"/><br /><sub><b>Gilles De Mey</b></sub></a><br /><a href="https://github.com/codesandbox/codesandboxer/commits?author=gillesdemey" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/kangweichan"><img src="https://avatars1.githubusercontent.com/u/47547953?v=4" width="100px;" alt="kangweichan"/><br /><sub><b>kangweichan</b></sub></a><br /><a href="https://github.com/codesandbox/codesandboxer/commits?author=kangweichan" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://michaeldeboey.be"><img src="https://avatars3.githubusercontent.com/u/6643991?v=4" width="100px;" alt="Michaël De Boey"/><br /><sub><b>Michaël De Boey</b></sub></a><br /><a href="#maintenance-MichaelDeBoey" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification. Contributions of any kind welcome!

## LICENSE

MIT

<!-- prettier-ignore-start -->
[emojis]: https://allcontributors.org/docs/en/emoji-key
[all-contributors]: https://github.com/all-contributors/all-contributors
<!-- prettier-ignore-end -->
