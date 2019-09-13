# vs-codesandboxer

Open a component from your editor into codesandboxer, using `codesandboxer-fs`
under-the-hood.

Can be used with the command `Deploy to CodeSandbox` or right click in your
active file to select to deploy it. Once your needed files/dependencies have
been sorted out, an 'open in CodeSandbox' link will open as a notification.
Click it and you'll be able to see your component in codesandbox, and share it
with others.

## Main use-cases

Sharing! When you want to get opinions on changes to a component but are not
publishing built isolated version anywhere, you can open it here and share it
more easily.

This can help teams that are working asynchronously/remotely share proposed
changes easily and start getting feedback, outside heavier more robust git-based
processes.

## Provisos

We use auto-detection for the kind of sandbox we should create. You should use
`codesandboxer-fs` through the command line if you need to pass in more options.

The only sandboxes we currently support are:

- create-react-app
- create-react-app-typescript
- vue-cli
