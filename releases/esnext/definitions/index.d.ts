import { Vector } from './Vector';
interface IMatrix {
    translation: Vector;
    scale: Vector;
    rotation: number;
}
export default class Jraw {
    static math: {
        /**
         * `Math.PI * 2`
         */
        TAU: number;
        /**
         * Converts degrees to radians
         */
        toRad(degs: number): number;
        /**
         * Converts radians to degrees
         */
        toDeg(rads: number): number;
        /**
         * Returns of random number, optionally within a given range
         *
         * If `min` is omitted then the range is `0 <= x <= max`
         *
         * @param min The minimum value
         * @param max The maximum value
         */
        random(max?: number | undefined, min?: number | undefined): number;
        /**
         * Constrains a number within the given range
         * @param num The number to constrain
         * @param min Minimum value
         * @param max Maximum volume
         */
        constrain(num: number, min: number, max: number): number;
        /**
         * Converts polar coordinates to cartesian coordinates
         *
         * @param theta The angle in radians
         */
        toCartesian(radius: number, theta: number): {
            x: number;
            y: number;
        };
        /**
         * Converts cartesian coordinates to polar coordinates
         */
        toPolar(x: number, y: number): {
            radius: number;
            theta: number;
        };
    };
    canvasElement: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    connectPaths: boolean;
    width: number;
    height: number;
    translation: Vector;
    scaled: Vector;
    rotation: number;
    matrixStack: IMatrix[];
    animation?: (timestamp: number) => void;
    private animationRunning;
    constructor(canvas: HTMLCanvasElement);
    readonly animating: boolean;
    startAnimation(): void;
    stopAnimation(): void;
    toggleAnimaion(): void;
    setTextAlign(mode: CanvasTextAlign): this;
    setTextBaseline(mode: CanvasTextBaseline): this;
    setFont(font: string): this;
    text(str: string, x?: number, y?: number, font?: string, align?: CanvasTextAlign, baseline?: CanvasTextBaseline, maxWidth?: number): {
        fill: (color?: string | CanvasGradient | CanvasPattern) => Jraw;
        stroke: (color?: string | CanvasGradient | CanvasPattern) => Jraw;
    };
    resizeCanvas(x: number, y: number): void;
    clear(): this;
    save(): this;
    restore(): this;
    scale(x: number, y: number): this;
    rotate(angle: number): this;
    translate(x: number, y: number): this;
    pushMatrix(): this;
    resetMatrix(): this;
    popMatrix(): this;
    setFill(color: string | CanvasGradient | CanvasPattern): this;
    setStroke(color: string | CanvasGradient | CanvasPattern): this;
    stroke(color?: string | CanvasGradient | CanvasPattern, width?: number): this;
    fill(color?: string | CanvasGradient | CanvasPattern): this;
    rect(x: number, y: number, w: number, h: number): this;
    triangle(c1X: any, c1Y: any, c2X: any, c2Y: any, c3X: any, c3Y: any): this;
    circle(x: number, y: number, r: number): this;
    newPath(): this;
    closePath(): this;
    arc(x: number, y: number, r: number, sA: number, eA: number, counterclockwise: boolean | undefined): this;
    lineTo(x: number, y: number): this;
    moveTo(x: number, y: number): this;
    line(...points: number[]): this;
    setStrokeWidth(width: number): this;
    image(img: CanvasImageSource, x: number, y: number, w?: number, h?: number): this;
    private animationLoop;
}
export {};
