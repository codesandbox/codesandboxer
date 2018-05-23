"use babel";

import { CompositeDisposable } from "atom";
import csbfs from "codesandboxer-fs";
import pkgUp from "pkg-up";
import pkgDir from "pkg-dir";
import axios from "axios";
import * as csb from 'codesandboxer'

export default {
  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "codesandboxer:deploy": () => this.deploy()
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  deploy() {
    atom.notifications.addInfo('Deploying to codesandbox')
    let filePath = atom.workspace.getActiveTextEditor().getPath();
    csbfs
      .assembleFiles(filePath)
      .then(({ parameters }) => {
        // Atom provides its own fetch implementation which works inconstently
        // with what we find using unfetch everywhere else. We are using axios
        // for this specific post for now, and need to re-evaluate this later.
        return axios({
          url: "https://codesandbox.io/api/v1/sandboxes/define?json=1",
          method: "post",
          data: { parameters },
          mode: "cors",
        });
      })
      .then(a => {
        atom.notifications.addSuccess(`[open in codesandbox](${csb.getSandboxUrl(a.data.sandbox_id)})`)
      })
      .catch(e => {
        atom.notifications.addError(`Error in deploying to codesandbox ${e}`)
      });
  }
};
