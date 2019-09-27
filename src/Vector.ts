// A mathematical vector
export class Vector {
  x: number = 0
  y: number = 0

  /**
   * Sums to vectors together
   */
  static add(vector1: Vector, vector2: Vector) {
    return new Vector(vector1.x + vector2.x, vector1.y + vector2.y)
  }

  /**
   * Subtracts `vector2` from `vector1` (e.i. `vector1 - vector2`)
   */
  static subtract(vector1: Vector, vector2: Vector) {
    return new Vector(vector1.x - vector2.x, vector1.y - vector2.y)
  }

  constructor(x: number, y: number) {
    if (x) this.x = x
    if (y) this.y = y
  }

  /**
   * Clones the `Vector`
   */
  clone() {
    return new Vector(this.x, this.y)
  }

  /**
   * Adds `vector` to this Vector
   */
  add(vector: Vector) {
    this.x += vector.x
    this.y += vector.y
  }

  /**
   * Subtracts `vector` from this Vector
   */
  subtract(vector: Vector) {
    this.x -= vector.x
    this.y -= vector.y
  }

  /**
   * Multiplies this Vector by `num`
   * @param num The Multiplier
   */
  multiply(num: number) {
    this.x *= num
    this.y *= num
  }

  /**
   * Divides this Vector by num
   * @param num The divisor
   */
  divide(num: number) {
    this.x = this.x / num
    this.y = this.y / num
  }

  /**
   * Returns the heading of this Vector
   */
  heading() {
    return Math.atan(this.y / this.x)
  }
  /**
   * Returns the angle of this Vector
   */
  angle() {
    return Math.atan2(this.y, this.x)
  }

  /**
   * Returns the magnitude of this Vector
   */
  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  /**
   * Normalizes this Vector (i.e. Reduces it to a magnitude of `1`)
   */
  normalize() {
    var m = this.magnitude()
    if (m > 0) {
      this.divide(m)
    }
  }

  /**
   * Limits the magnitude of this vector to `num`
   * @param num The limit
   */
  limit(num: number) {
    if (this.magnitude() > num) {
      this.normalize()
      this.multiply(num)
    }
  }
}
