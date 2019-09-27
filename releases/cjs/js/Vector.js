"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// A mathematical vector
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = 0;
        this.y = 0;
        if (x)
            this.x = x;
        if (y)
            this.y = y;
    }
    /**
     * Sums to vectors together
     */
    Vector.add = function (vector1, vector2) {
        return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
    };
    /**
     * Subtracts `vector2` from `vector1` (e.i. `vector1 - vector2`)
     */
    Vector.subtract = function (vector1, vector2) {
        return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
    };
    /**
     * Clones the `Vector`
     */
    Vector.prototype.clone = function () {
        return new Vector(this.x, this.y);
    };
    /**
     * Adds `vector` to this Vector
     */
    Vector.prototype.add = function (vector) {
        this.x += vector.x;
        this.y += vector.y;
    };
    /**
     * Subtracts `vector` from this Vector
     */
    Vector.prototype.subtract = function (vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    };
    /**
     * Multiplies this Vector by `num`
     * @param num The Multiplier
     */
    Vector.prototype.multiply = function (num) {
        this.x *= num;
        this.y *= num;
    };
    /**
     * Divides this Vector by num
     * @param num The divisor
     */
    Vector.prototype.divide = function (num) {
        this.x = this.x / num;
        this.y = this.y / num;
    };
    /**
     * Returns the heading of this Vector
     */
    Vector.prototype.heading = function () {
        return Math.atan(this.y / this.x);
    };
    /**
     * Returns the angle of this Vector
     */
    Vector.prototype.angle = function () {
        return Math.atan2(this.y, this.x);
    };
    /**
     * Returns the magnitude of this Vector
     */
    Vector.prototype.magnitude = function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };
    /**
     * Normalizes this Vector (i.e. Reduces it to a magnitude of `1`)
     */
    Vector.prototype.normalize = function () {
        var m = this.magnitude();
        if (m > 0) {
            this.divide(m);
        }
    };
    /**
     * Limits the magnitude of this vector to `num`
     * @param num The limit
     */
    Vector.prototype.limit = function (num) {
        if (this.magnitude() > num) {
            this.normalize();
            this.multiply(num);
        }
    };
    return Vector;
}());
exports.Vector = Vector;
