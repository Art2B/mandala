let currentColor = "#000"

const pickColor = (color) => {
  currentColor = color
}

window.onload = function () {
  var c = document.getElementById("canvas")
  var ctx = c.getContext("2d")

  var cHelp = document.getElementById('canvas-help')
  var ctxHelp = cHelp.getContext('2d')

  var radius = c.width*0.4
  var nbParts = 100
  var lastPosition = {
    x: null,
    y: null
  }

  ctx.strokeStyle = currentColor;
  
  var drawHelpLines = function () {
    ctxHelp.clearRect(0, 0, cHelp.width, cHelp.height)
    ctxHelp.beginPath()
    ctxHelp.arc(c.width/2, c.height/2, radius, 0,2*Math.PI)
    ctxHelp.stroke()

    for (var i = 0; i < nbParts; i++) {
      ctxHelp.beginPath()
      ctxHelp.moveTo(c.width/2, c.height/2)

      var angle = (2*Math.PI) * (i/nbParts)
      var newX = (c.width/2) + radius * Math.cos(angle)
      var newY = (c.height/2) + radius * Math.sin(angle)

      ctxHelp.lineTo(newX, newY)
      ctxHelp.stroke()
    }
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
    ctx.strokeStyle = currentColor;
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

  drawHelpLines()
  var canvasHolder = document.getElementById('canvas-holder')

  canvasHolder.addEventListener('mousedown', function () {
    canvasHolder.addEventListener('mousemove', handleMouseMove)
  })
  canvasHolder.addEventListener('mouseup', function () {
    canvasHolder.removeEventListener('mousemove', handleMouseMove)
    ctx.closePath()
    resetLastPosition()
  })

  // Export as jpg
  var exportBtn = document.getElementById('export-png')
  exportBtn.addEventListener('click', function (e) {
    exportBtn.href = c.toDataURL('image/png')
  })

  // Update nb parts
  var nbPartInput = document.getElementById('nb-parts')
  nbPartInput.addEventListener('change', function (e) {
    nbParts = e.target.value
    drawHelpLines()
  })
}
