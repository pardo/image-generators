function goFullscreen (elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen()
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen()
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen()
  }
}

function FisherYatesShuffle (myArray, randomGenerator) {
  if (randomGenerator === undefined) {
    randomGenerator = Math.random
  }
  var i = myArray.length
  var j
  var tempi
  var tempj
  if (i === 0) return false
  while (--i) {
    j = Math.floor(randomGenerator() * (i + 1))
    tempi = myArray[i]
    tempj = myArray[j]
    myArray[i] = tempj
    myArray[j] = tempi
  }
  return myArray
}

function range (start, end, step) {
  var range = []
  var i
  switch (arguments.length) {
    case 1:
      for (i = 0; i < start; i++) { range.push(i) }
      break
    case 2:
      if (end > start) {
        for (i = start; i < end; i++) { range.push(i) }
      } else {
        for (i = start; i > end; i--) { range.push(i) }
      }
      break
    case 3:
      if (start < end && step > 0) {
        for (i = start; i < end;) { range.push(i); i += step }
      } else if (start > end && step < 0) {
        for (i = start; i > end;) { range.push(i); i += step }
      }
      break
  }
  return range
}

function distancePoints (p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

function distanceXY (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

// 57.29577951308232 = 180 / Math.PI
function rad2deg (d) {
  return d * 57.29577951308232
}

function deg2rad (d) {
  return d / 57.29577951308232
}

function angleBetweenXY (x1, y1, x2, y2) {
  var a = Math.atan2(y2 - y1, x2 - x1)
  console.log(a)
  if (a < 0) { a += Math.PI * 2 }
  return a
}

function pointFollowingAnglePoint (pos, angle, distance) {
  // angle should be radians
  // 0-360 0 mean east 90 south 180 west 270 north in degrees
  return {
    x: pos.x + Math.cos(angle) * distance,
    y: pos.y + Math.sin(angle) * distance
  }
}

function mapObj (func, obj) {
  // iterate over objects keys
  // func(obj , key, index)
  var keys = Object.keys(obj)
  var result = []
  for (var i = 0; i < keys.length; i++) {
    result.push(
      func(obj[keys[i]], keys[i], i)
    )
  }
  return result
}

function getWindowSizePoint () {
  var winW = 0
  var winH = 0
  if (document.body && document.body.offsetWidth) {
    winW = document.body.offsetWidth
    winH = document.body.offsetHeight
  }
  if (document.compatMode === 'CSS1Compat' &&
  document.documentElement &&
  document.documentElement.offsetWidth) {
    winW = document.documentElement.offsetWidth
    winH = document.documentElement.offsetHeight
  }
  if (window.innerWidth && window.innerHeight) {
    winW = window.innerWidth
    winH = window.innerHeight
  }
  return {
    width: winW,
    height: winH
  }
}

function getElementSize (element) {
  return {
    width: element.offsetWidth,
    height: element.offsetHeight
  }
}

function downloadText (filename, text) {
  // download content as a data test
  var pom = document.createElement('a')
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  pom.setAttribute('download', filename)
  pom.click()
}

function getId (length) {
  // with a length of 6 the first collision occurs after more than 9000000 of ids
  var base62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var str = ''
  length = length || 10
  for (let i = 0; i < length; i++) {
    str += base62[Math.floor(Math.random() * 62)]
  }
  return str
}
// extracted from underscore
function debounce (func, wait, immediate) {
  var timeout
  var result
  return function () {
    var context = this
    var args = arguments
    var later = function () {
      timeout = null
      if (!immediate) result = func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) result = func.apply(context, args)
    return result
  }
}

function throttle (func, wait) {
  var context
  var args
  var timeout
  var throttling
  var more
  var result
  var whenDone = debounce(function () { more = throttling = false }, wait)
  return function () {
    context = this
    args = arguments
    var later = function () {
      timeout = null
      if (more) func.apply(context, args)
      whenDone()
    }
    if (!timeout) timeout = setTimeout(later, wait)
    if (throttling) {
      more = true
    } else {
      result = func.apply(context, args)
    }
    whenDone()
    throttling = true
    return result
  }
}

function changeColorLuminance (hex, lum) {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '')
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  lum = lum || 0
  // convert to decimal and change luminosity
  var rgb = '#'
  var c
  var i
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16)
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16)
    rgb += ('00' + c).substr(c.length)
  }
  return rgb
}

function randomHexColor () {
  var rgb = '#'
  var c
  var i
  for (i = 0; i < 3; i++) {
    c = Math.random() * 256
    c = Math.round(Math.min(Math.max(0, c), 255)).toString(16)
    rgb += ('00' + c).substr(c.length)
  }
  return rgb
}

function isTouchDevice () {
  return 'ontouchstart' in window || 'onmsgesturechange' in window
}

export {
  debounce,
  throttle,
  getId,
  downloadText,
  getWindowSizePoint,
  mapObj,
  pointFollowingAnglePoint,
  angleBetweenXY,
  deg2rad,
  rad2deg,
  distancePoints,
  distanceXY,
  range,
  FisherYatesShuffle,
  goFullscreen,
  isTouchDevice,
  changeColorLuminance,
  randomHexColor,
  getElementSize
}
