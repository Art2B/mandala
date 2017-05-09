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

  var nbParts = 4

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

  var drawLines = function (x, y) {
    ctx.beginPath()
    ctx.moveTo( lastPosition.x, lastPosition.y)
    ctx.lineTo(x, y)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(lastPosition.x, (c.height - lastPosition.y))
    ctx.lineTo(x, (c.height - y))
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo((c.width - lastPosition.x), lastPosition.y)
    ctx.lineTo((c.width - x), y)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo((c.width - lastPosition.x), (c.height - lastPosition.y))
    ctx.lineTo((c.width - x), (c.height - y))
    ctx.stroke()
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

}