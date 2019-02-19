/**
 * This bookmarklet can be run from any url that has a file open in BB or GH. Branches, commits, PR's, etc will all work.
 * Simply save it as a bookmark with "javascript: <paste>" and you should be good to go
 * To update it, use this site for now: https://mrcoles.com/bookmarklet/
 */

(() => {
  let parseUrl = url => {
    let matcher;
    if (url.match(/^https?:\/\/bitbucket.org/)) {
      matcher = /^https?:\/\/(bitbucket).org\/(.+?)\/(.+?)\/src\/(.+?)\/([^?#]+)/;
    } else if (!!url.match(/^https?:\/\/github.com/)) {
      matcher = /^https?:\/\/(github).com\/(.+?)\/(.+?)\/blob\/(.+?)\/([^?#]+)/;
    } else {
      return;
    }
    const [, host, repoOwner, repoSlug, commit, file] = url.match(matcher);
    return {
      host,
      repoOwner,
      repoSlug,
      commit,
      file,
    };
  };
  let location = window.location.href;
  let parsed = parseUrl(location);
  if (!parsed) {
    alert('Something went wrong! We couldnt parse your url!');
  }
  let encodedFile = encodeURIComponent(parsed.file);
  let url = `https://bitbucket-codesandboxer.netlify.com/deploy-file/index.html?host=${
    parsed.host
  }&repoOwner=${parsed.repoOwner}&repoSlug=${parsed.repoSlug}&commit=${
    parsed.commit
  }&file=${encodedFile}`;
  window.open(url, '_blank', '');
})();
