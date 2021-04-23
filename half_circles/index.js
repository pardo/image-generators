import Drawable from './drawable'
import Rainbow from 'rainbowvis.js'
import { range, angleBetweenXY, distanceXY } from '../helpers'
import ColorsArray from '../colors'
import seedrandom from 'seedrandom'
import Graphemescope from '../graphemescope'

// initialization
var drawable = new Drawable()
let main = document.getElementById('main')
drawable.createAndAppend(main)
var timed = 0

function getDrawArc (ctx, nextColor, centerX, centerY, halfDistance, isClockwise) {
  return function (startAngle, endAngle) {
    ctx.strokeStyle = nextColor()
    ctx.beginPath()
    ctx.arc(
      centerX,
      centerY,
      halfDistance,
      startAngle,
      endAngle,
      isClockwise
    )
    ctx.stroke()
  }
}

function drawPoints (points, ctx, nextColor) {
  return new Promise(function (resolve, reject) {
    var isClockwise = true
    for (let i = 1; i < points.length; i++) {
      var p0 = points[i - 1]
      var p1 = points[i]
      var centerX = (p0[0] + p1[0]) / 2
      var centerY = (p0[1] + p1[1]) / 2
      var distance = distanceXY(p0[0], p0[1], p1[0], p1[1])
      // var angle = angleBetweenXY(p0[0], p0[1], p1[0], p1[1])
      var drawArc = getDrawArc(ctx, nextColor, centerX, centerY, distance / 2, isClockwise)
      var angleStep = Math.PI * 0.25 * (isClockwise ? -1 : 1)
      var endAngle = Math.PI * (isClockwise ? -1 : 1)
      // we need to reverse the order because we draw from left to right
      var offset = angleStep * 0.1
      var anglesToDraw = range(0, endAngle, angleStep)
      if (p0[0] < p1[0]) {
        anglesToDraw = anglesToDraw.reverse()
      }
      anglesToDraw.forEach(angle => {
        drawArc(angle - offset, angle + angleStep + offset)
      })
      
      isClockwise = !isClockwise
    }
    resolve()
  })
}

function getColorGetter (colors, startingPosition) {
  // statingPosition must be a number between 0 and 1
  // this will return a function that each time it is called will return a color
  var colorIndex = 0
  function nextColor () {
    var color = colors[colorIndex]
    colorIndex += 1
    colorIndex %= colors.length
    return color
  }
  return nextColor
}

function getColorsArray (seed) {
  var spectrumSize = parseInt(seed() * 40) + 15
  var palette = ColorsArray[parseInt(seed() * ColorsArray.length)]
  // set colors rainbox
  var rainbow = new Rainbow()
  // var palette = getNextColorPalette()
  rainbow.setSpectrum.apply(rainbow, palette)
  rainbow.setNumberRange(0, spectrumSize)
  return range(0, spectrumSize).map((c) => {
    return '#' + rainbow.colorAt(c)
  }).concat(
    range(spectrumSize, 0).map((c) => {
      return '#' + rainbow.colorAt(c)
    })
  )
}

function getPoints (xStart, xEnd, yStart, yEnd, minSize, maxSize, getRandom) {
  var points = []
  var pointsArrays = []
  for (var y = yStart; y < yEnd; y += maxSize) {
    points = []
    var x = xStart
    points.push([x, y])
    while (x < xEnd) {
      var jumpSize = getRandom(minSize, maxSize)
      x = x + jumpSize * ((jumpSize - parseInt(jumpSize)) > 0.85 ? -1 : 1)
      points.push([x, y])
    }
    points.push([xEnd, y])
    pointsArrays.push(points)
  }
  return pointsArrays
}

window.render = function render (width, height, name, options) {
  if (rendering) {
    return rendersArgs.push([width, height, name, options])
  }
  if (options === undefined) { options = {} }
  var elapsed = new Date()
  rendering = true // lock
  drawable.resize({width: width, height: height})
  var seed = seedrandom(name)
  var pointsArrays = []
  function getRandom (min, max) {
    return seed() * (max - min) + min
  }
  var scale = Math.max(Math.max(width, height) / 1000, 1)
  if (options.scale) {
    scale = options.scale
  }
  var minSize = getRandom(3, 15) * scale
  var maxSize = getRandom(minSize * 1.3, 100) * scale
  var colors = getColorsArray(seed)
  var ctx = drawable.context2d
  ctx.lineWidth = parseInt(getRandom(minSize / 2, minSize)) * scale
  minSize = Math.max(minSize, ctx.lineWidth * 1.2)
  // ctx.rotate(Math.PI / 4)
  var graphemescopeAngle = seed()
  var graphemescopeCount = parseInt(getRandom(0, 2))
  if (options.avoidGraphemescope) {
    graphemescopeCount = 0
  }
  // generate points
  pointsArrays = getPoints(0 - minSize, width + minSize, parseInt(maxSize / 2), height, minSize, maxSize, getRandom)
  // set background color
  if (options.bgColor === undefined) {
    drawable.fill(colors[0])
  } else {
    drawable.fill(options.bgColor)
  }

  Promise.all(pointsArrays.map((points, index) => {
    return drawPoints(points, ctx, getColorGetter(colors))
  })).then(() => {
    window.doGraphemescope(graphemescopeCount, graphemescopeAngle, function () {
      console.log('Elapsed: ' + ((new Date()).getTime() - elapsed.getTime()) / 1000)
      console.log(`Done:${name}`)
      setTimeout(() => { rendering = false }, 500)
    })
  })
}

window.doGraphemescope = function (times, angle, callback) {
  if (times === undefined || times === 0) {
    return callback()
  }
  var imageElement = new window.Image()
  imageElement.src = drawable.element.toDataURL()
  imageElement.onload = function () {
    var graphemescope = new Graphemescope(drawable.element)
    graphemescope.setImageDirect(imageElement)
    graphemescope.angleTarget = angle
    graphemescope.zoomTarget = 1
    graphemescope.easeEnabled = false
    graphemescope.update()
    graphemescope.draw()
    console.log(`Graphemescope ${times}`)
    setTimeout(() => {
      if (times > 0) {
        times -= 1
        window.doGraphemescope(times, angle, callback)
      } else {
        callback()
      }
    }, 100)
  }
}

// render loop
var rendersArgs = []
var rendering = false
setInterval(() => {
  if (!rendering) {
    var args = rendersArgs.shift()
    if (args) {
      window.render.apply(window, args)
    }
  }
}, 500)
