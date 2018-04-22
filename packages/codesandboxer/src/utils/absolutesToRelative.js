// @flow

export default function absolutesToAbsolute(
  currentLocation: string,
  targetLocation: string,
) {
  let cr = currentLocation.split('/');
  let tr = targetLocation.split('/');

  // remove any shared values
  while (tr[0] && cr[0] === tr[0]) {
    cr.shift();
    tr.shift();
  }

  if (cr.length < 2) {
    return `./${tr.join('/')}`;
  }

  cr.shift();

  return `${cr.map(() => '..').join('/')}/${tr.join('/')}`;
}
