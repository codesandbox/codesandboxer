// @flow
import { parseFile, parseSassFile, parseScssFile } from '../parseFile';
import replaceImports from '../replaceImports';
import absolutesToRelative from '../utils/absolutesToRelative';
import getUrl from './getUrl';
import 'isomorphic-unfetch';
import type {
  Package,
  GitInfo,
  ParsedFile,
  Config,
  ImportReplacement,
} from '../types';

const fetchRequest = url =>
  fetch(url).then(res => {
    if (res.status === 404) {
      throw new Error(`file not found at: ${url}`);
    }
    return res.text();
  });

/*
This is modified from the canvas answer here:
https://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript
*/
function fetchImage(url, path): Promise<ParsedFile> {
  return new Promise(resolve => {
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
  }).then(file => ({ file, deps: {}, internalImports: [], path }));
}

const fetchJS = (url, path, pkg, importReplacements): Promise<ParsedFile> =>
  fetchRequest(url)
    .then(content =>
      replaceImports(
        content,
        importReplacements.map(m => [absolutesToRelative(path, m[0]), m[1]]),
      ),
    )
    // this is not correct
    .then(content => parseFile(content, pkg))
    .then(file => ({ ...file, path }));

const fetchSass = (url, path) =>
  fetchRequest(url)
    .then(parseSassFile)
    .then(file => ({ ...file, path }));

const fetchScss = (url, path) =>
  fetchRequest(url)
    .then(parseScssFile)
    .then(file => ({ ...file, path }));

const fetchRaw = (url, path): Promise<ParsedFile> => {
  return fetch(url)
    .then(res => {
      if (res.status === 404) {
        throw new Error(`file not found at: ${url}`);
      }
      return res.text();
    })
    .then(file => ({ file, deps: {}, internalImports: [], path }));
};

/*
resolution order:
A.js
A.json
A.userExtension (in order provided)
A/index.js
A/index.json
A/index.userExtension (in order provided)
*/

const attemptToFetch = (url, path, pkg, importReplacements, extension) => {
  let newPath = `${path}${extension}`;
  let newUrl = url.replace(/.js$/, extension);
  if (extension === '.json') {
    return fetchRaw(newUrl, newPath).catch(error => {
      if (error.message.includes('file not found at:')) return;
      else throw error;
    });
  }
  return fetchJS(newUrl, newPath, pkg, importReplacements).catch(error => {
    if (error.message.includes('file not found at:')) return;
    else throw error;
  });
};

// Imports that are not named may be .js, .json, or /index.js. Node resolves them
// in that order.
async function fetchProbablyJS(url, path, pkg, importReplacements, config) {
  let extensions: string[] = config.extensions || [];
  // We add in the .js and .json extensions as the default accepted extensions
  extensions = ['.js', '.json', ...extensions];
  extensions = [
    ...extensions,
    // This account for when the path references an index file
    ...extensions.map(extension => `/index${extension}`),
  ];

  while (extensions.length) {
    let extension = extensions.shift();
    const data = await attemptToFetch(
      url,
      path,
      pkg,
      importReplacements,
      extension,
    );
    if (data) return data;
  }

  throw new Error(
    `file not found at: ${url}; tried extensions: ${extensions.join(', ')}`,
  );
}

let fetchFileContents = (
  url,
  path,
  { fileType, pkg, importReplacements },
  config,
): Promise<ParsedFile> => {
  if (config.extensions.includes(fileType) || fileType === '.js') {
    return fetchProbablyJS(url, path, pkg, importReplacements, config);
  }

  switch (fileType) {
    case '.png':
    case '.jpeg':
    case '.jpg':
    case '.gif':
    case '.bmp':
    case '.tiff':
      return fetchImage(url, path);
    case '.json':
    case '.css':
      return fetchRaw(url, path);
    case '.scss':
      return fetchScss(url, path);
    case '.sass':
      return fetchSass(url, path);
    default:
      throw new Error(`unparseable filetype: ${fileType} for file ${path}`);
  }
};

type HandleFileFetch = Promise<ParsedFile>;

export default async function fetchRelativeFile(
  path: string,
  pkg: Package,
  importReplacements: Array<ImportReplacement>,
  gitInfo: GitInfo,
  config?: Config,
): HandleFileFetch {
  config = config || { extensions: [] };
  // The new path is the file name we will provide to CodeSandbox
  // Get the url from the gitInfo. For JS files, we will need to add the filetype
  // This method needs to determine the filetype, so we return it.
  let { url, fileType } = getUrl(path, gitInfo);

  let file = await fetchFileContents(
    url,
    path,
    {
      fileType,
      pkg,
      importReplacements,
    },
    config,
  );
  return file;
}
