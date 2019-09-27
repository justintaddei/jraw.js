import { Vector } from './Vector'

/*

Jraw.js - A JavaScript library for manipulating HTML canvases

By, Justin Taddei <mail@justintaddei.com>
Website: justintaddei.com

*/

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  function(callback) {
    return window.setTimeout(() => {
      callback(Date.now())
    }, 1000 / 60)
  }

window.cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  function(id) {
    return window.clearTimeout(id)
  }

interface IMatrix {
  translation: Vector
  scale: Vector
  rotation: number
}

const mathExt = {
  /**
   * `Math.PI * 2`
   */
  TAU: Math.PI * 2,

  /**
   * Converts degrees to radians
   */
  toRad(degs: number) {
    return degs * (Math.PI / 180)
  },

  /**
   * Converts radians to degrees
   */
  toDeg(rads: number) {
    return rads * (180 / Math.PI)
  },
  /**
   * Returns of random number, optionally within a given range
   *
   * If `min` is omitted then the range is `0 <= x <= max`
   *
   * @param min The minimum value
   * @param max The maximum value
   */
  random(max?: number, min?: number) {
    let r = Math.random()
    if (!max) {
      return r
    }
    if (!min) {
      return r * max
    }

    if (min < 0) {
      min = Math.abs(min)
      max += min
      r *= max
      r -= min
    } else {
      do {
        r = Math.random() * max
      } while (r < min)
    }

    return r
  },

  /**
   * Constrains a number within the given range
   * @param num The number to constrain
   * @param min Minimum value
   * @param max Maximum volume
   */
  constrain(num: number, min: number, max: number) {
    return Math.max(Math.min(num, max), min)
  },
  /**
   * Converts polar coordinates to cartesian coordinates
   *
   * @param theta The angle in radians
   */
  toCartesian(radius: number, theta: number) {
    const x = radius * Math.cos(theta)
    const y = radius * Math.sin(theta)

    return {
      x,
      y
    }
  },
  /**
   * Converts cartesian coordinates to polar coordinates
   */
  toPolar(x: number, y: number) {
    const vec = new Vector(x, y)

    return {
      radius: vec.magnitude(),
      theta: vec.angle()
    }
  }
}

// Jraw
export default class Jraw {
  public static math = mathExt

  public canvasElement: HTMLCanvasElement
  public context: CanvasRenderingContext2D
  public connectPaths: boolean = false
  public width: number
  public height: number
  public translation: Vector = new Vector(0, 0)
  public scaled: Vector = new Vector(1, 1)
  public rotation: number = 0
  public matrixStack: IMatrix[]
  public animation?: (timestamp: number) => void

  private animationRunning: boolean = false

  constructor(canvas: HTMLCanvasElement) {
    this.canvasElement = canvas
    this.context = this.canvasElement.getContext('2d') as CanvasRenderingContext2D
    this.width = this.canvasElement.width
    this.height = this.canvasElement.height
    this.matrixStack = [
      {
        rotation: 0,
        scale: this.scaled.clone(),
        translation: this.translation.clone()
      }
    ]

    this.animationLoop = this.animationLoop.bind(this)
  }

  public get animating() {
    return this.animationRunning
  }
  public startAnimation() {
    if (this.animationRunning) return

    this.animationRunning = true
    requestAnimationFrame(this.animationLoop)
  }

  public stopAnimation() {
    this.animationRunning = false
  }

  public toggleAnimaion() {
    if (this.animating) this.stopAnimation()
    else this.startAnimation()
  }

  public setTextAlign(mode: CanvasTextAlign) {
    this.context.textAlign = mode
    return this
  }

  public setTextBaseline(mode: CanvasTextBaseline) {
    this.context.textBaseline = mode
    return this
  }

  public setFont(font: string) {
    this.context.font = font
    return this
  }

  public text(
    str: string,
    x: number = 0,
    y: number = 0,
    font: string = this.context.font,
    align: CanvasTextAlign = this.context.textAlign,
    baseline: CanvasTextBaseline = this.context.textBaseline,
    maxWidth: number = Infinity
  ): {
    fill: (color?: string | CanvasGradient | CanvasPattern) => Jraw
    stroke: (color?: string | CanvasGradient | CanvasPattern) => Jraw
  } {
    const previousTextAlign = this.context.textAlign
    const previousBaseline = this.context.textBaseline
    const previousFont = this.context.font

    this.setTextAlign(align)
      .setTextBaseline(baseline)
      .setFont(font)

    return {
      fill: (color: string | CanvasGradient | CanvasPattern = this.context.strokeStyle) => {
        const previousColor = this.context.strokeStyle

        this.context.fillStyle = color
        this.context.fillText(str, x, y, maxWidth)
        this.context.fillStyle = previousColor
        this.setTextAlign(previousTextAlign)
          .setTextBaseline(previousBaseline)
          .setFont(previousFont)

        return this
      },
      stroke: (color: string | CanvasGradient | CanvasPattern = this.context.strokeStyle) => {
        const previousColor = this.context.strokeStyle

        this.context.strokeStyle = color
        this.context.strokeText(str, x, y, maxWidth)
        this.context.strokeStyle = previousColor
        this.setTextAlign(previousTextAlign)
          .setTextBaseline(previousBaseline)
          .setFont(previousFont)

        return this
      }
    }
  }

  public resizeCanvas(x: number, y: number) {
    this.width = this.canvasElement.width = x
    this.height = this.canvasElement.height = y
  }

  public clear() {
    this.context.clearRect(0 - this.translation.x, 0 - this.translation.y, this.width, this.height)
    this.newPath()
    return this
  }
  public save() {
    this.context.save()
    return this
  }
  public restore() {
    this.context.restore()
    return this
  }

  public scale(x: number, y: number) {
    y = y || x
    this.context.scale(x, y)
    this.scaled.add(new Vector(x, y))

    return this
  }
  public rotate(angle: number) {
    this.context.rotate(angle)
    this.rotation += angle

    return this
  }
  public translate(x: number, y: number) {
    this.context.translate(x, y)
    this.translation.add(new Vector(x, y))
    return this
  }
  public pushMatrix() {
    this.matrixStack.push({
      rotation: this.rotation,
      scale: this.scaled.clone(),
      translation: this.translation.clone()
    })
    return this
  }
  public resetMatrix() {
    this.context.setTransform(1, 0, 0, 1, 0, 0)
    this.translation = new Vector(0, 0)
    this.scaled = new Vector(0, 0)
    this.rotation = 0
    return this
  }
  public popMatrix() {
    this.resetMatrix()

    const stack = this.matrixStack.pop()
    if (!stack) return this

    this.translate(stack.translation.x, stack.translation.y)
    this.scale(stack.scale.x, stack.scale.y)
    this.rotate(stack.rotation)
    return this
  }

  public setFill(color: string | CanvasGradient | CanvasPattern) {
    this.context.fillStyle = color
    return this
  }
  public setStroke(color: string | CanvasGradient | CanvasPattern) {
    this.context.strokeStyle = color
    return this
  }

  public stroke(
    color: string | CanvasGradient | CanvasPattern = this.context.strokeStyle,
    width: number = this.context.lineWidth
  ) {
    const previousStroke = this.context.strokeStyle
    const previousWidth = this.context.lineWidth
    this.setStrokeWidth(width)
    this.setStroke(color)
    this.context.stroke()
    this.setStrokeWidth(previousWidth)
    this.setStroke(previousStroke)
    return this
  }
  public fill(color: string | CanvasGradient | CanvasPattern = this.context.fillStyle) {
    const previousColor = this.context.fillStyle

    this.context.fillStyle = color
    this.context.fill()
    this.context.fillStyle = previousColor

    return this
  }
  public rect(x: number, y: number, w: number, h: number) {
    if (!this.connectPaths) {
      this.newPath()
    }
    this.context.rect(x, y, w, h)
    return this
  }
  public triangle(c1X: any, c1Y: any, c2X: any, c2Y: any, c3X: any, c3Y: any) {
    if (!this.connectPaths) {
      this.newPath()
    }

    this.line(c1X, c1Y, c2X, c2Y, c3X, c3Y, c1X, c1Y)

    return this
  }

  public circle(x: number, y: number, r: number) {
    if (!this.connectPaths) {
      this.newPath()
    }
    this.context.arc(x, y, r, 0, Jraw.math.TAU)
    return this
  }

  public newPath() {
    this.context.beginPath()
    return this
  }
  public closePath() {
    this.context.closePath()
    return this
  }

  public arc(x: number, y: number, r: number, sA: number, eA: number, counterclockwise: boolean | undefined) {
    if (!this.connectPaths) {
      this.newPath()
    }
    this.context.arc(x, y, r, sA, eA, counterclockwise)
    return this
  }
  public lineTo(x: number, y: number) {
    this.context.lineTo(x, y)
    return this
  }
  public moveTo(x: number, y: number) {
    this.context.moveTo(x, y)
    return this
  }
  public line(...points: number[]) {
    if (!this.connectPaths) {
      this.newPath()
    }

    this.moveTo(points[0], points[1])

    for (let i = 2; i < points.length; i += 2) {
      this.lineTo(points[i], points[i + 1])
    }

    return this
  }
  public setStrokeWidth(width: number) {
    this.context.lineWidth = width
    return this
  }

  public image(img: CanvasImageSource, x: number, y: number, w?: number, h?: number) {
    if (w && h) {
      this.context.drawImage(img, x, y, w, h)
    } else {
      this.context.drawImage(img, x, y)
    }

    return this
  }

  private animationLoop(timestamp: number) {
    if (!this.animationRunning || typeof this.animation !== 'function') {
      this.animationRunning = false
      return
    }

    this.animation(timestamp)

    requestAnimationFrame(this.animationLoop)
  }
}
