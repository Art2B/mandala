window.onload = function () {
  var c = document.getElementById("canvas")
  var ctx = c.getContext("2d")

  ctx.beginPath();
  ctx.arc(c.width/2, c.height/2, c.width*0.4, 0,2*Math.PI);
  ctx.stroke();

  var lastPosition = {
    x: null,
    y: null
  }

  ctx.beginPath()
  ctx.moveTo(0, c.height/2)
  ctx.lineTo(c.width, c.height/2)
  ctx.stroke()

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

  var handleMouseMove = function (e) {
    if (!lastPosition.x || !lastPosition.y) {
      setLastPosition(e.offsetX, e.offsetY)
    }

    ctx.beginPath()
    ctx.moveTo( lastPosition.x, lastPosition.y)
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(lastPosition.x, (c.height - lastPosition.y))
    ctx.lineTo(e.offsetX, (c.height - e.offsetY))
    ctx.stroke()

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