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
  ctx.moveTo(c.width/2, 0)
  ctx.lineTo(c.width/2, c.height)
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

    ctx.beginPath()
    ctx.moveTo((c.width - lastPosition.x), lastPosition.y)
    ctx.lineTo((c.width - e.offsetX), e.offsetY)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo((c.width - lastPosition.x), (c.height - lastPosition.y))
    ctx.lineTo((c.width - e.offsetX), (c.height - e.offsetY))
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
