// @flow
import resolvePath from './resolvePath';
import { parseFile } from './';
import type { Package, FetchConfig, ParsedFile } from './types';
const raw = {
  github: (path, { account, repository, branch = 'master' }) =>
    `https://raw.githubusercontent.com/${account}/${repository}/${branch}/${path}`,
  bitbucket: (path, { account, repository, branch = 'master' }) =>
    `https://api.bitbucket.org/1.0/repositories/${account}/${repository}/raw/${branch}/${path}`,
};

/*
This is modified from the canvas answer here:
https://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript
*/

const supportedImageFormats = [
  '.png',
  '.jpeg',
  '.jpg',
  '.gif',
  '.bmp',
  '.tiff',
];

const getUrl = (path, { host, ...urlConfig }) => {
  let getRaw = raw[host];
  if (typeof getRaw !== 'function')
    throw new Error(`Could not parse files from ${host}`);

  let url = getRaw(path, urlConfig);
  let fileType = '';
  let fileMatch = path.match(/.+\/.+(\..+)$/);
  if (!fileMatch) {
    return { fileType: '.js', url: `${url}.js` };
  } else {
    return { fileType: fileMatch[1], url };
  }
};

function fetchImage(url, newPath): Promise<{ file: string }> {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;

    img.onload = function() {
      var canvas: HTMLCanvasElement = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var dataURL;
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL();
      resolve(dataURL);
    };
  }).then(file => ({ file }));
}

const fetchJS = (url, newPath, pkg): ParsedFile => {
  return fetch(url)
    .then(a => a.text())
    .then(content => parseFile(content, pkg));
};

let fetchFileContents = (
  url,
  newPath,
  { isImage, pkg },
): {| file: string |} | ParsedFile => {
  if (isImage) return fetchImage(url, newPath);
  else return fetchJS(url, newPath, pkg);
};

type CommonFile = {
  file: string,
  name: string,
  replacementKey: [string, string],
};

type ImageFile = {
  image: true,
} & CommonFile;

type JSFile = CommonFile & ParsedFile;

export default async function handleFileFetch(
  basePath: string,
  source: string,
  pkg: Package,
  config: FetchConfig,
) {
  // The new path is the file name we will provide to codesandbox
  let newPath = resolvePath(basePath, source);
  try {
    // Get the url from the config. For JS files, we will need to add the filetype
    // This method needs to determine the filetype, so we return it.
    let { url, fileType } = getUrl(newPath, config);
    let isImage = false;
    // Currently we handle images, and js files. We error on other file types
    for (let format of supportedImageFormats) {
      if (fileType === format) isImage = true;
    }
    if (fileType !== '.js' && !isImage)
      throw new Error(`unparseable filetype: ${fileType}`);

    let file = await fetchFileContents(url, newPath, { isImage, pkg });
    return {
      ...file,
      absolutePath: newPath,
      newPath: `./${newPath}`,
      image: isImage,
      replacementKey: [source, `./${newPath}`],
    };
  } catch (e) {
    // There are a few ways this can error. fetchRelativeFile() is designed to throw
    // errors, leaving it to the consumer to handle them.
    throw new Error(e);
  }
}

const replaceMentKeys = {
  '../src': '@atlaskit/button',
};
