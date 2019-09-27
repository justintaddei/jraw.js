import { Vector } from './Vector';
/*

Jraw.js - A JavaScript library for manipulating HTML canvases

By, Justin Taddei <mail@justintaddei.com>
Website: justintaddei.com

*/
window.requestAnimationFrame =
    window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(() => {
                callback(Date.now());
            }, 1000 / 60);
        };
window.cancelAnimationFrame =
    window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        function (id) {
            return window.clearTimeout(id);
        };
const mathExt = {
    /**
     * `Math.PI * 2`
     */
    TAU: Math.PI * 2,
    /**
     * Converts degrees to radians
     */
    toRad(degs) {
        return degs * (Math.PI / 180);
    },
    /**
     * Converts radians to degrees
     */
    toDeg(rads) {
        return rads * (180 / Math.PI);
    },
    /**
     * Returns of random number, optionally within a given range
     *
     * If `min` is omitted then the range is `0 <= x <= max`
     *
     * @param min The minimum value
     * @param max The maximum value
     */
    random(max, min) {
        let r = Math.random();
        if (!max) {
            return r;
        }
        if (!min) {
            return r * max;
        }
        if (min < 0) {
            min = Math.abs(min);
            max += min;
            r *= max;
            r -= min;
        }
        else {
            do {
                r = Math.random() * max;
            } while (r < min);
        }
        return r;
    },
    /**
     * Constrains a number within the given range
     * @param num The number to constrain
     * @param min Minimum value
     * @param max Maximum volume
     */
    constrain(num, min, max) {
        return Math.max(Math.min(num, max), min);
    },
    /**
     * Converts polar coordinates to cartesian coordinates
     *
     * @param theta The angle in radians
     */
    toCartesian(radius, theta) {
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        return {
            x,
            y
        };
    },
    /**
     * Converts cartesian coordinates to polar coordinates
     */
    toPolar(x, y) {
        const vec = new Vector(x, y);
        return {
            radius: vec.magnitude(),
            theta: vec.angle()
        };
    }
};
// Jraw
export default class Jraw {
    constructor(canvas) {
        this.connectPaths = false;
        this.translation = new Vector(0, 0);
        this.scaled = new Vector(1, 1);
        this.rotation = 0;
        this.animationRunning = false;
        this.canvasElement = canvas;
        this.context = this.canvasElement.getContext('2d');
        this.width = this.canvasElement.width;
        this.height = this.canvasElement.height;
        this.matrixStack = [
            {
                rotation: 0,
                scale: this.scaled.clone(),
                translation: this.translation.clone()
            }
        ];
        this.animationLoop = this.animationLoop.bind(this);
    }
    get animating() {
        return this.animationRunning;
    }
    startAnimation() {
        if (this.animationRunning)
            return;
        this.animationRunning = true;
        requestAnimationFrame(this.animationLoop);
    }
    stopAnimation() {
        this.animationRunning = false;
    }
    toggleAnimaion() {
        if (this.animating)
            this.stopAnimation();
        else
            this.startAnimation();
    }
    setTextAlign(mode) {
        this.context.textAlign = mode;
        return this;
    }
    setTextBaseline(mode) {
        this.context.textBaseline = mode;
        return this;
    }
    setFont(font) {
        this.context.font = font;
        return this;
    }
    text(str, x = 0, y = 0, font = this.context.font, align = this.context.textAlign, baseline = this.context.textBaseline, maxWidth = Infinity) {
        const previousTextAlign = this.context.textAlign;
        const previousBaseline = this.context.textBaseline;
        const previousFont = this.context.font;
        this.setTextAlign(align)
            .setTextBaseline(baseline)
            .setFont(font);
        return {
            fill: (color = this.context.strokeStyle) => {
                const previousColor = this.context.strokeStyle;
                this.context.fillStyle = color;
                this.context.fillText(str, x, y, maxWidth);
                this.context.fillStyle = previousColor;
                this.setTextAlign(previousTextAlign)
                    .setTextBaseline(previousBaseline)
                    .setFont(previousFont);
                return this;
            },
            stroke: (color = this.context.strokeStyle) => {
                const previousColor = this.context.strokeStyle;
                this.context.strokeStyle = color;
                this.context.strokeText(str, x, y, maxWidth);
                this.context.strokeStyle = previousColor;
                this.setTextAlign(previousTextAlign)
                    .setTextBaseline(previousBaseline)
                    .setFont(previousFont);
                return this;
            }
        };
    }
    resizeCanvas(x, y) {
        this.width = this.canvasElement.width = x;
        this.height = this.canvasElement.height = y;
    }
    clear() {
        this.context.clearRect(0 - this.translation.x, 0 - this.translation.y, this.width, this.height);
        this.newPath();
        return this;
    }
    save() {
        this.context.save();
        return this;
    }
    restore() {
        this.context.restore();
        return this;
    }
    scale(x, y) {
        y = y || x;
        this.context.scale(x, y);
        this.scaled.add(new Vector(x, y));
        return this;
    }
    rotate(angle) {
        this.context.rotate(angle);
        this.rotation += angle;
        return this;
    }
    translate(x, y) {
        this.context.translate(x, y);
        this.translation.add(new Vector(x, y));
        return this;
    }
    pushMatrix() {
        this.matrixStack.push({
            rotation: this.rotation,
            scale: this.scaled.clone(),
            translation: this.translation.clone()
        });
        return this;
    }
    resetMatrix() {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.translation = new Vector(0, 0);
        this.scaled = new Vector(0, 0);
        this.rotation = 0;
        return this;
    }
    popMatrix() {
        this.resetMatrix();
        const stack = this.matrixStack.pop();
        if (!stack)
            return this;
        this.translate(stack.translation.x, stack.translation.y);
        this.scale(stack.scale.x, stack.scale.y);
        this.rotate(stack.rotation);
        return this;
    }
    setFill(color) {
        this.context.fillStyle = color;
        return this;
    }
    setStroke(color) {
        this.context.strokeStyle = color;
        return this;
    }
    stroke(color = this.context.strokeStyle, width = this.context.lineWidth) {
        const previousStroke = this.context.strokeStyle;
        const previousWidth = this.context.lineWidth;
        this.setStrokeWidth(width);
        this.setStroke(color);
        this.context.stroke();
        this.setStrokeWidth(previousWidth);
        this.setStroke(previousStroke);
        return this;
    }
    fill(color = this.context.fillStyle) {
        const previousColor = this.context.fillStyle;
        this.context.fillStyle = color;
        this.context.fill();
        this.context.fillStyle = previousColor;
        return this;
    }
    rect(x, y, w, h) {
        if (!this.connectPaths) {
            this.newPath();
        }
        this.context.rect(x, y, w, h);
        return this;
    }
    triangle(c1X, c1Y, c2X, c2Y, c3X, c3Y) {
        if (!this.connectPaths) {
            this.newPath();
        }
        this.line(c1X, c1Y, c2X, c2Y, c3X, c3Y, c1X, c1Y);
        return this;
    }
    circle(x, y, r) {
        if (!this.connectPaths) {
            this.newPath();
        }
        this.context.arc(x, y, r, 0, Jraw.math.TAU);
        return this;
    }
    newPath() {
        this.context.beginPath();
        return this;
    }
    closePath() {
        this.context.closePath();
        return this;
    }
    arc(x, y, r, sA, eA, counterclockwise) {
        if (!this.connectPaths) {
            this.newPath();
        }
        this.context.arc(x, y, r, sA, eA, counterclockwise);
        return this;
    }
    lineTo(x, y) {
        this.context.lineTo(x, y);
        return this;
    }
    moveTo(x, y) {
        this.context.moveTo(x, y);
        return this;
    }
    line(...points) {
        if (!this.connectPaths) {
            this.newPath();
        }
        this.moveTo(points[0], points[1]);
        for (let i = 2; i < points.length; i += 2) {
            this.lineTo(points[i], points[i + 1]);
        }
        return this;
    }
    setStrokeWidth(width) {
        this.context.lineWidth = width;
        return this;
    }
    image(img, x, y, w, h) {
        if (w && h) {
            this.context.drawImage(img, x, y, w, h);
        }
        else {
            this.context.drawImage(img, x, y);
        }
        return this;
    }
    animationLoop(timestamp) {
        if (!this.animationRunning || typeof this.animation !== 'function') {
            this.animationRunning = false;
            return;
        }
        this.animation(timestamp);
        requestAnimationFrame(this.animationLoop);
    }
}
Jraw.math = mathExt;
