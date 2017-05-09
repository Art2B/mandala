window.onload = function () {
  var c = document.getElementById("canvas")
  var ctx = c.getContext("2d")

  var radius = c.width*0.4

  ctx.beginPath();
  ctx.arc(c.width/2, c.height/2, radius, 0,2*Math.PI);
  ctx.stroke();

  var lastPosition = {
    x: null,
    y: null
  }

  var nbParts = 12

  // draw help line for mirroring
  for (var i = 0; i < nbParts; i++) {
    ctx.beginPath()
    ctx.moveTo(c.width/2, c.height/2)

    var angle = (2*Math.PI) * (i/nbParts)
    var newX = (c.width/2) + radius * Math.cos(angle)
    var newY = (c.height/2) + radius * Math.sin(angle)

    ctx.lineTo(newX, newY)
    ctx.stroke()
  }

  var setLastPosition = function (x, y) {
    lastPosition = {
      x: x,
      y: y
    }
  }
  var resetLastPosition = function () {
    lastPosition = {
      x: 0,
      y: 0
    }
  }

  function and(x, y) {
    return x ? y : false;
  }

  function solveAngle(a, b, c) {
    var temp = (a * a + b * b - c * c) / (2 * a * b);
    if (and(temp >= -1, 0.9999999 >= temp))
      return Math.acos(temp)
    else if (1 >= temp)  // Explained in https://www.nayuki.io/page/numerically-stable-law-of-cosines
      return Math.sqrt((c * c - (a - b) * (a - b)) / (a * b))
    else
      throw "No solution";
  }

  function rotatePoint (point, rotation) {
    var radius = Math.sqrt(Math.pow(point.x - (c.width/2), 2) + Math.pow(point.y - (c.height/2), 2))
    var p1 = {
      x: (c.width/2) + radius * Math.cos(0),
      y: (c.height/2) + radius * Math.sin(0)
    }
    var a = point.x - p1.x
    var b = point.y - p1.y
    var distBetweenPosAndP1 = Math.sqrt( Math.pow(a, 2) + Math.pow(b, 2) )
    var angleBetweenPosAndP1 = solveAngle(radius, radius, distBetweenPosAndP1)

    var testX = Math.round((c.width/2) + radius * Math.cos(-angleBetweenPosAndP1))
    var testY = Math.round((c.height/2) + radius * Math.sin(-angleBetweenPosAndP1))

    var angleDirection = ( testX === point.x && testY === point.y) ? -1 : 1
    var angle = rotation + (angleBetweenPosAndP1 * angleDirection)

    return {
      x: (c.width/2) + radius * Math.cos(angle),
      y: (c.height/2) + radius * Math.sin(angle)
    }
  }

  var drawLines = function (x, y) {
    for (var i = 0; i < nbParts; i++) {
      if (i === 0) {
        ctx.beginPath()
        ctx.moveTo(lastPosition.x, lastPosition.y)
        ctx.lineTo(x, y)
        ctx.stroke()
        continue
      }

      var rotation = (2*Math.PI) * (i/nbParts)
      let lastPositionRotated = rotatePoint(lastPosition, rotation)
      var positionRotated = rotatePoint({x: x, y: y}, rotation)

      // draw line
      ctx.beginPath()
      ctx.moveTo(lastPositionRotated.x, lastPositionRotated.y)
      ctx.lineTo(positionRotated.x, positionRotated.y)
      ctx.stroke()
    }
  }

  var handleMouseMove = function (e) {
    if (!lastPosition.x || !lastPosition.y) {
      setLastPosition(e.offsetX, e.offsetY)
    }
    drawLines(e.offsetX, e.offsetY)
    setLastPosition(e.offsetX, e.offsetY)
  }

  c.addEventListener('mousedown', function () {
    c.addEventListener('mousemove', handleMouseMove)
  })
  c.addEventListener('mouseup', function () {
    c.removeEventListener('mousemove', handleMouseMove)
    ctx.closePath()
    resetLastPosition()
  })

  // COLOR PICKER - 20height
  var cp = document.getElementById("colorPicker")
  var cpCtx = cp.getContext("2d")

  //COLORS
  const heightCP = 30

  var   base    = '#000',
        white   = '#FFF',
        red     = '#F44336',
        blue    = '#2196F3',
        pink    = '#9C27B0',
        teal    = '#009688',
        indigo  = '#3F51B5',
        orange  = '#FF9800'

  const colors = [base, white, red, blue, pink, teal, indigo, orange]

  colors.forEach((color, index) => {
    cpCtx.fillStyle = color
    cpCtx.fillRect(index * heightCP, 0, 30, 30)
  })

}
