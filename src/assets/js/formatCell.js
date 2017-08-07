import {diffChars} from 'diff'

export {coloredDiff, brDiff}

function coloredDiff (doubleArray) {
  if (doubleArray.length !== 2) return 'Error => array\'s length must be 2'

  if (doubleArray[0] === doubleArray[1]) return doubleArray[0]

  let diff = diffChars(doubleArray[0], doubleArray[1])
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

  return brDiff([left, right])
}

function brDiff (doubleArray) {
  if (doubleArray.length !== 2) return 'Error => array\'s length must be 2'

  return doubleArray[0] + '<br/>' + doubleArray[1]
}
