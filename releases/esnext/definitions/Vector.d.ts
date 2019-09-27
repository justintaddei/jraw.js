export declare class Vector {
    /**
     * Sums to vectors together
     */
    static add(vector1: Vector, vector2: Vector): Vector;
    /**
     * Subtracts `vector2` from `vector1` (e.i. `vector1 - vector2`)
     */
    static subtract(vector1: Vector, vector2: Vector): Vector;
    x: number;
    y: number;
    constructor(x: number, y: number);
    /**
     * Clones the `Vector`
     */
    clone(): Vector;
    /**
     * Adds `vector` to this Vector
     */
    add(vector: Vector): void;
    /**
     * Subtracts `vector` from this Vector
     */
    subtract(vector: Vector): void;
    /**
     * Multiplies this Vector by `num`
     * @param num The Multiplier
     */
    multiply(num: number): void;
    /**
     * Divides this Vector by num
     * @param num The divisor
     */
    divide(num: number): void;
    /**
     * Returns the heading of this Vector
     */
    heading(): number;
    /**
     * Returns the angle of this Vector
     */
    angle(): number;
    /**
     * Returns the magnitude of this Vector
     */
    magnitude(): number;
    /**
     * Normalizes this Vector (i.e. Reduces it to a magnitude of `1`)
     */
    normalize(): void;
    /**
     * Limits the magnitude of this vector to `num`
     * @param num The limit
     */
    limit(num: number): void;
}
