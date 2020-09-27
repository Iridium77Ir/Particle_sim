const body = document.querySelector('body')
const canvas = document.createElement('canvas')
canvas.width = window.innerWidth-1
canvas.height = window.innerHeight-10
body.appendChild(canvas)

const palette = ['#384259', '#F73859', '#7AC7C4', '#C4EDDE']
const getRColour = () => palette[Math.floor(Math.random() * palette.length)]

const radians = degrees => degrees * (Math.PI / 180)

const drawIsoCube = (ctx, { x, y, size, angle = 30, colour = 'white' }) => {
  const a = radians(angle)
  const dX = size * Math.cos(a)
  const dY = size * Math.sin(a)

  const moveTo = (rX, rY) => ctx.moveTo(x + rX, y + rY)
  const lineTo = (rX, rY) => ctx.lineTo(x + rX, y + rY)

  const fillSolid = () => {
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = colour
    ctx.fill()
  }

  const fillShadow = (x1, y1, x2, y2, a1, a2) => {
    const gradient = ctx.createLinearGradient(x + x1, y + y1, x + x2, y + y2)
    gradient.addColorStop(0, `rgba(${a1}, ${a1}, ${a1}, 0.75)`)
    gradient.addColorStop(1, `rgba(${a2}, ${a2}, ${a2}, 0.75)`)
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = gradient
    ctx.fill()
  }

  const stroke = () => {
    ctx.globalCompositeOperation = 'lighten'
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.stroke()
  }

  const rFace = () => {
    ctx.beginPath()
    moveTo(0, 0)
    lineTo(0, size)
    lineTo(dX, dY)
    lineTo(dX, dY - size)
    ctx.closePath()

    fillSolid()
    fillShadow(0, 0, dX, dY, 255, 196)
    stroke()
  }

  const lFace = () => {
    ctx.beginPath()
    moveTo(0, 0)
    lineTo(0, size)
    lineTo(-dX, dY)
    lineTo(-dX, dY - size)
    ctx.closePath()

    fillSolid()
    fillShadow(0, 0, -dX, dY, 222, 64)
    stroke()
  }

  const top = () => {
    ctx.beginPath()
    moveTo(0, 0)
    lineTo(dX, -dY)
    lineTo(0, -size)
    lineTo(-dX, -dY)
    ctx.closePath()

    fillSolid()
    fillShadow(0, 0, 0, -size, 255, 127)
    stroke()
  }

  lFace()
  rFace()
  top()
}

const sketch = () => {
  const { width, height } = canvas
  const ctx = canvas.getContext('2d')
  const size = Math.floor(width / 16)
  const grid = []
  const depth = 5
  const curve = 4

  const rowHeight = size
  const columnWidth = Math.sqrt(size ** 2 - (size / 2) ** 2)
  const curveWidth = columnWidth * 2 * (curve + 1)
  // const planes = Math.ceil(height / (rowHeight * 2))

  for (let y = 0; y <= height + rowHeight * 2; y += rowHeight * 2) {
    const plane = y / (rowHeight * 2)

    for (let x = width; x >= -curveWidth; x -= curveWidth) {
      for (let z = depth; z >= 0; z -= 1) {
        const yOffset = y - z * rowHeight
        grid.push({
          x: x - columnWidth,
          y: yOffset - rowHeight * 0.5,
          z,
          plane,
        })

        for (let c = 0; c < curve; c += 1) {
          grid.push({
            x: x + columnWidth * (0 + c),
            y: yOffset + rowHeight * 0.5 * c,
            z,
            plane,
          })
          grid.push({
            x: x + columnWidth * (curve * 2 - c),
            y: yOffset + rowHeight * 0.5 * c,
            z,
            plane,
          })
        }

        grid.push({
          x: x + columnWidth * curve,
          y: yOffset + rowHeight * 0.5 * curve,
          z,
          plane,
        })
      }
    }
  }

  const depthSort = (a, b) => {
    if (a.plane === b.plane) {
      if (a.y < b.y) {
        return -1
      }

      if (a.y > b.y) {
        return 1
      }

      return 0
    }

    if (a.plane > b.plane) {
      return -1
    }

    if (a.plane < b.plane) {
      return 1
    }

    return 0
  }

  const depthFilter = ({ z }) => {
    if (z === 0) {
      return Math.random() > 0.25
    }

    return true
  }

  grid
    .sort(depthSort)
    .filter(depthFilter)
    .map(cube => ({
      ...cube,
      size,
      colour: getRColour(),
    }))
    .forEach(cube => drawIsoCube(ctx, cube))
}

sketch()
