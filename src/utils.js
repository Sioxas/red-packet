/**
 * Created by sioxa on 2017/2/17 0017.
 */
export function hex2rgb(color) {
  let t = color
  if (/^#/.test(color)) {
    t = color.slice(1)
  }
  if (t.length === 6)
    return {
      r: parseInt(t.slice(0, 1), 16),
      g: parseInt(t.slice(2, 3), 16),
      b: parseInt(t.slice(4, 5), 16)
    }
  if (t.length === 3) {
    let n = parseInt(t.slice(0, 1), 16)
    return {r: n, g: n, b: n}
  }
}


export function rgb2hex(r, g, b) {
  return '#'
    + parseInt(r).toString(16)
    + parseInt(g).toString(16)
    + parseInt(b).toString(16)
}

