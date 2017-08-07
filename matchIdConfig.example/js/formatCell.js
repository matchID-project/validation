import moment from 'moment'
import {diffChars} from 'diff'
import {coloredDiff, brDiff} from '../../src/assets/js/formatCell'

export default {coloredDiff, brDiff, formatSex, formatDiff, formatDistance, formatRank, formatDate}

function formatDiff (value) {
  if (value === undefined) return ''

  let splittedDiff = value.split(' <> ', 2).map((v) => v.trim())

  return splittedDiff.length === 2 ? coloredDiff(splittedDiff) : value
}

function formatSex (doubleArray) {
  return coloredDiff(doubleArray.map(sexConvertor))
}

function sexeConvertor (value) {
  if (value === '1') return 'H'

  return 'F'
}

function formatDistance (value) {
  if (typeof value === 'undefined' || Number(value) === 0 || value === 'NaN') {
    return ''
  }

  if (value < 10) {
    return value + ' km'
  }

  return Math.round(value) + ' km'
}

function formatRank (value) {
  return Number(value) === 1 ? '' : '<span class="icon"><i class="fa fa-exclamation-triangle has-text-danger"></i></span>'
}

function formatDate (x, y) {
  let xDate = moment(x, 'YYYY-MM-DD').format('DD/MM/YYYY')
  let yDate = moment(y, 'YYYY-MM-DD').format('DD/MM/YYYY')
  return coloredDiff(xDate, yDate)
}
