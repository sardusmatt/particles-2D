/**
 * 2D Vector auxiliary class with the minimal set of operations required for the simulation
 */
class Vector2 {
    x: number;
    y: number;

    /**
     * @param {number} x X coordinate
     * @param {number} y Y coordinate
     * @constructor
     */
    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Scale the vector by the specified amount. Assuming scalar is always defined
     * @param {number} scalar
     */
    scale (scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
    }
    /**
     * Add this to vect, saving the result on this. Assuming vect is always defined
     * @param {Vector2} v
     */
    add (v: Vector2) {
        this.x += v.x;
        this.y += v.y;
    }

    /**
     * Create and return a copy of the vector
     * @return {Vector2}
     */
    copy  () : Vector2 {
        return new Vector2(this.x, this.y);
    }

    /**
     * Reset to (0,0)
     */
    clear () {
        this.x = 0.0;
        this.y = 0.0;
    }
}

/**
 * Auxiliary class, used to check if particles fall outside the simulation area
 */
class SimulationArea {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    /**
     * @param minX
     * @param maxX
     * @param minY
     * @param maxY
     * @constructor
     */
    constructor (minX: number, maxX: number, minY: number, maxY: number) {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }

    /**
     * Return true iff the point represented by is contained in this
     * @param point
     * @return {Boolean}
     */
    contains (point: Vector2) : boolean {
        return (point.x >= this.minX &&
                point.x <= this.maxX &&
                point.y >= this.minY &&
                point.y <= this.maxY);
    }
}

export {Vector2, SimulationArea};
