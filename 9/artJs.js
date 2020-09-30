const container = document.querySelector('.container')
const canvas = document.createElement('canvas')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
container.appendChild(canvas)

var palette = ['#003049', '#D62828', '#F77F00', '#FCBF49', '#FCBF49', '#EAE2B7']
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
  const size = Math.floor(width / 32)
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

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}


function hexToRgb(hex) {
var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
return result ? {
  r: parseInt(result[1], 16),
  g: parseInt(result[2], 16),
  b: parseInt(result[3], 16)
} : null;
}

function hexComplimentary(hex){

  var rgb = 'rgb(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length/3 + '})', 'g')).map(function(l) { return parseInt(hex.length%2 ? l+l : l, 16); }).join(',') + ')';

  // Get array of RGB values
  rgb = rgb.replace(/[^\d,]/g, '').split(',');

  var r = rgb[0]/255.0, g = rgb[1]/255.0, b = rgb[2]/255.0;

  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2.0;

  if(max == min) {
      h = s = 0;  //achromatic
  } else {
      var d = max - min;
      s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

      if(max == r && g >= b) {
          h = 1.0472 * (g - b) / d ;
      } else if(max == r && g < b) {
          h = 1.0472 * (g - b) / d + 6.2832;
      } else if(max == g) {
          h = 1.0472 * (b - r) / d + 2.0944;
      } else if(max == b) {
          h = 1.0472 * (r - g) / d + 4.1888;
      }
  }

  h = h / 6.2832 * 360.0 + 0;

  // Shift hue to opposite side of wheel and convert to [0-1] value
  h+= 180;
  if (h > 360) { h -= 360; }
  h /= 360;

  if(s === 0){
      r = g = b = l; // achromatic
  } else {
      var hue2rgb = function hue2rgb(p, q, t){
          if(t < 0) t += 1;
          if(t > 1) t -= 1;
          if(t < 1/6) return p + (q - p) * 6 * t;
          if(t < 1/2) return q;
          if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
      };

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255); 
  b = Math.round(b * 255);

  // Convert r b and g values to hex
  rgb = b | (g << 8) | (r << 16); 
  return "#" + (0x1000000 | rgb).toString(16).substring(1);
}

function changeColors(color1, color2) {
  if(color1 != null) {
    palette = chroma.scale([color1, color2]).mode('lch').colors(6)
    sketch()
  }
  var color = chroma.random();
  palette = chroma.scale([color.desaturate(1), hexComplimentary(color.hex())]).mode('lch').colors(6);
  sketch()
}

function changeColorsManual() {
  var color1 = prompt("Please enter color n°1(in HTML notation: #FFFFFF):");
  var color2 = prompt("Please enter color n°2(in HTML notation: #FFFFFF):");
  if(color1 != null && color2 != null) {
    changeColors(color1, color2);
  }
}

sketch()