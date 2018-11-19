- Reorganise how templates are stored
    This is a bunch of changes that should mostly only be relevant internally.

    First is that there is a `/templates` directory instead of `constants.js` to
    store templates in. This makes it easy to read a template an easy to see how to add a new template

    Secondly, while `codesandboxer-fs` still has its own templates, it inherits templates from `codesandboxer`
    meaning that a template can be added in one and flow down to the other.

    This sets up for Vue sandboxes.