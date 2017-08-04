import {diffChars} from 'diff'

export {coloredDiff, brDiff}

function coloredDiff (x, y) {
  if (x === y) return x
  let diff = diffChars(x, y)
  let right = ''
  let left = ''

  diff.forEach(function (part) {
    if (part.added) {
      left += '<strong class="has-text-info">' + part.value + '</strong>'
    } else if (part.removed) {
      right += '<strong class="has-text-danger">' + part.value + '</strong>'
    } else {
      left += part.value
      right += part.value
    }
  })

  return brDiff(left, right)
}

function brDiff (x, y) {
  return x + '<br/>' + y
}
