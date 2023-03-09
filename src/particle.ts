import {RGBA} from "./utils";
import {Vector2} from "./math-utils";

const PARTICLE_MIN_LIFESPAN: number = 1000; // minimum particle life span
const PARTICLE_MAX_LIFESPAN_INCREASE: number = 10000; // max number of ms added to the base lifespans
const PARTICLE_DEFAULT_RADIUS: number = 5.0;

class Particle {
    private position: Vector2;
    private velocity: Vector2;
    private lifespan: number;
    private age: number;
    private radius: number;
    private inverseMass: number;
    private baseColour: RGBA;
    private forceAccumulator: Vector2;

    /**
     * @param {Vector2} position the particle starting position
     * @param {Vector2} velocity the particle starting velocity
     * @param {number} particleLifespan how long the particle will be kept alive (in ms) (if not specified default value is PARTICLE_MIN_LIFESPAN)
     * @param {number} particleRadius radius of the circle representing the particle (if not specified default value is PARTICLE_DEFAULT_RADIUS)
     * @constructor
     */
    constructor (position: Vector2, velocity: Vector2, particleLifespan: number, particleRadius?: number) {
        this.position = position;
        this.velocity = velocity;
        this.lifespan = particleLifespan ? particleLifespan : PARTICLE_MIN_LIFESPAN;
        this.radius = particleRadius ? particleRadius : PARTICLE_DEFAULT_RADIUS;
        this.age = 0; // just created
        this.inverseMass = 0.0;
        this.forceAccumulator = new Vector2(0,0); // force vector result, combining all forces applied to the particle (e.g., gravity, drag)
        this.baseColour = new RGBA();
    }

    getPosition () : Vector2 {
        return this.position;
    }

    getVelocity () : Vector2 {
        return this.velocity;
    }

    getLifeLeft () : number {
        return this.lifespan - this.age;
    }

    getRadius () : number {
        return this.radius;
    }

    getInverseMass () : number {
        return this.inverseMass;
    }

    setMass (mass: number) {
        // no negative or zero-mass particles, so approximate to the biggest possible inverse mass if a <= value is passed
        this.inverseMass = (mass > 0) ? (1.0 / mass) : Number.MAX_VALUE;
    }

    setInverseMass (invMass: number) {
        // zero-inverse-mass potentially useful to represent immovable objects
        this.inverseMass = (invMass > 0) ? invMass : 0.0;
    }

    getBaseColour () : RGBA {
        return this.baseColour;
    }

    setBaseColour (rgba: RGBA) {
        this.baseColour = rgba;
    }

    /**
     * Return arbitrary age-based colour shift
     * @return RGBA
     */
    getCurrentAgedColour () : RGBA {
        const newAlpha = this.getLifeLeft() / this.lifespan;
        return RGBA.buildRGBA(Math.round(this.baseColour.r * newAlpha), Math.round(this.baseColour.g * newAlpha), Math.round(this.baseColour.b * newAlpha), newAlpha);
    }

    /**
     * Add the parameter vector to the force accumulator
     * @param force
     */
    addForce (force: Vector2) {
        this.forceAccumulator.add(force);
    }

    /**
     * Update particle attributes, based on the amount of time passed from the last call to the update method
     * Returns true if the particle is still active, false otherwise
     * Note that particle velocity is updated before updating its location. Also note that the 1/2at^2 component
     * in the position update is assumed to be insignificant, since the amount of time between two
     * subsequent calls to update is typically small enough to disregard this term.
     * @param elapsedTime
     * @return {Boolean}
     */
    update (elapsedTime: number) : boolean {
        this.age += elapsedTime;

        // time is over: the particle is going to disappear and will not be drawn, so avoid updating
        if (this.getLifeLeft() <= 0) {
            return false;
        }

        // else update attributes based on the elapsed time
        // compute acceleration term
        const delta = this.forceAccumulator.copy();
        delta.scale(this.inverseMass);
        // use it to update velocity
        delta.scale(elapsedTime);
        this.velocity.add(delta);

        // update position
        const translation = this.velocity.copy();
        translation.scale(elapsedTime);
        this.position.add(translation);

        // Clear all forces
        this.forceAccumulator.clear();
        return true;
    }

    /**
     * For simplicity, let's keep the draw function in the same module as the physics
     * @param {Particle} particle the particle to be drawn
     * @param {CanvasRenderingContext2D} context 2D Canvas Context object
     */
    static draw (particle: Particle, context: CanvasRenderingContext2D) {
        context.beginPath();
        // position, radius, start angle, end angle
        context.arc(particle.getPosition().x, particle.getPosition().y, particle.getRadius(), 0, Math.PI * 2);
        context.closePath();
        context.fillStyle = particle.getCurrentAgedColour().toString(); // this directly returns the 'rgba(...' string we need
        context.fill();
    }
}

export {PARTICLE_MIN_LIFESPAN, PARTICLE_MAX_LIFESPAN_INCREASE, Particle};
