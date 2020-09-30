const canvas = document.querySelector('.container')

buildField = (p, { width, height, scale = 20 }) => {
  const fieldStrength = 0.35
  const angleHeading = 270
  const angleScale = 0.5
  const noiseScale = 0.007

  const getVector = (x, y) => {
    const r = p.noise(x * noiseScale, y * noiseScale)
    const angle = p.radians(r * angleScale * 360 + (-45 + angleHeading))
    const vector = p5.Vector.fromAngle(angle)
    vector.setMag(fieldStrength)

    return vector
  }

  const drawVector = (vector, x, y) => {
    const length = 0.5 * scale
    p.push()

    p.stroke(50, 0.5)
    p.fill(50, 0.5)
    p.strokeWeight(length * 0.2)

    p.translate(x, y)
    p.rotate(vector.heading())
    p.line(0, 0, length, 0)
    p.triangle(length / 2, length * 0.2, length, 0, length / 2, length * -0.2)

    p.pop()
  }

  const draw = () => {
    for (let y = 0; y < height; y += scale) {
      for (let x = 0; x < width; x += scale) {
        const vector = getVector(x, y)
        drawVector(vector, x, y)
      }
    }
  }

  return {
    draw,
    getVector,
  }
}

const MAX_VELOCITY = 2

class Particle {
  constructor(p, { x, y, life }) {
    this.p = p
    this.life = life
    this.position = p.createVector(x, y)
    this.acceleration = p.createVector(0, 0)
    this.velocity = p.createVector(0, 0)

    this.previousPosition = this.position
  }

  update(force) {
    this.previousPosition = this.p.createVector(this.position.x, this.position.y)

    this.acceleration.add(force)
    this.velocity.add(this.acceleration)
    this.velocity.limit(MAX_VELOCITY)
    this.position.add(this.velocity)
    this.acceleration.mult(0)

    this.life -= 1
  }

  isDead() {
    return this.life <= 0
  }

  distanceFrom({ x, y }) {
    return Math.sqrt((x - this.position.x) ** 2 + (y - this.position.y) ** 2)
  }

  draw() {
    const { p } = this

    p.push()
    p.stroke(0, 0.3)
    p.strokeWeight(1)
    p.line(this.previousPosition.x, this.previousPosition.y, this.position.x, this.position.y)
    p.pop()
  }
}

const sketch = p => {
  const width = window.innerWidth
  const height = window.innerHeight
  const radius = window.innerHeight/3
  const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  const particleLife = 50
  const particleCount = 10000
  const particleOrigin = {
    x: width * 0.5,
    y: height * 0.5,
  }

  const gaussian = value => Math.abs(p.randomGaussian()) * value

  const field = buildField(p, { width, height })
  let particles = Array.from({ length: particleCount }).map(
    () =>
      new Particle(p, {
        x: gaussian(particleOrigin.x),
        y: height - gaussian(particleOrigin.y),
        life: p.randomGaussian(particleLife),
      })
  )

  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.colorMode(p.HSB)
    // p.blendMode(p.MULTIPLY)
    // p.noLoop()
  }

  p.draw = () => {
    // field.draw()

    particles = particles.filter(particle => {
      const { x, y } = particle.position
      const force = field.getVector(x, y)

      if (particle.distanceFrom(center) > radius || particle.isDead()) {
        return false
      }

      particle.update(force)
      particle.draw()
      return true
    })

    if (particles.length <= 0) {
      console.log('Stopping loop.')
      p.noLoop()
    }
  }
}

new p5(sketch, canvas) // eslint-disable-line no-new
