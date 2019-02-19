import LZString from 'lz-string';
function compress(input) {
  return LZString.compressToBase64(input)
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, ''); // Remove ending '='
}
function getParameters(files) {
  return compress(JSON.stringify(files));
}
export default getParameters;
