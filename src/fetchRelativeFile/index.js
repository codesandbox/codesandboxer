// @flow
import resolvePath from '../utils/resolvePath';
import parseFile from '../parseFile';
import replaceImports from '../replaceImports';
import type {
  Package,
  FetchConfig,
  ParsedFile,
  Dependencies,
  Import,
} from '../types';
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

function fetchImage(url, path): Promise<ParsedFile> {
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
  }).then(file => ({ file, deps: {}, internalImports: [] }));
}

const fetchJS = (url, path, pkg, importReplacements): Promise<ParsedFile> => {
  return fetch(url)
    .then(a => a.text())
    .then(content => replaceImports(content, importReplacements))
    .then(content => parseFile(content, pkg));
};

let fetchFileContents = (
  url,
  path,
  { isImage, pkg, importReplacements },
): Promise<ParsedFile> => {
  if (isImage) return fetchImage(url, path);
  else return fetchJS(url, path, pkg, importReplacements);
};

type HandleFileFetch = Promise<{
  file: string,
  deps: Dependencies,
  internalImports: Array<string>,
}>;

export default async function fetchRelativeFile(
  path: string,
  pkg: Package,
  importReplacements: Array<[string, string]>,
  config: FetchConfig,
): HandleFileFetch {
  // The new path is the file name we will provide to codesandbox
  // Get the url from the config. For JS files, we will need to add the filetype
  // This method needs to determine the filetype, so we return it.
  let { url, fileType } = getUrl(path, config);
  let isImage = false;
  // Currently we handle images, and js files. We error on other file types
  for (let format of supportedImageFormats) {
    if (fileType === format) isImage = true;
  }
  if (fileType !== '.js' && !isImage)
    throw new Error(`unparseable filetype: ${fileType}`);

  let file = await fetchFileContents(url, path, {
    isImage,
    pkg,
    importReplacements,
  });
  return { ...file, isImage };
}
