import {PARTICLE_MIN_LIFESPAN, PARTICLE_MAX_LIFESPAN_INCREASE, Particle} from "./particle";
import {Vector2} from './math-utils';
import {RGBA} from "./utils";

const EMITTER_DEFAULT_DENSITY: number = 10; // default number of particles emitted p/s

class Emitter {
    // 2D position and direction of th emitter
    private position: Vector2;
    private direction: Vector2;
    // amount of emitted particles per second
    private density: number;
    // whether to randomise particles' initial velocity
    private randomiseInitialVelocity: boolean;

    /**
     * @param {number} posX X coordinate of the emitter
     * @param {number} posY Y coordinate of the emitter
     * @param {number} dirX X component of the launching direction
     * @param {number} dirY Y component of the launching direction
     * @param {number} particlesPerSecond total particles emitted per second
     * @param randomiseInitialVelocity {boolean} true iff particles should have randomised initial velocity
     * @constructor
     */
    constructor (posX: number, posY: number, dirX: number, dirY: number, particlesPerSecond: number, randomiseInitialVelocity: boolean) {
        this.position = new Vector2(posX, posY);
        this.direction = new Vector2(dirX, dirY);
        this.density = (particlesPerSecond && particlesPerSecond > 0) ? particlesPerSecond : EMITTER_DEFAULT_DENSITY;
        this.randomiseInitialVelocity = randomiseInitialVelocity;
    }

    getPosition () {
        return this.position;
    }

    getDirection () {
        return this.direction;
    }

    getDensity () {
        return this.density;
    }

    doesRandomiseInitialVelocity () {
        return this.randomiseInitialVelocity;
    }

    emitParticles (elapsedTime: number) : Particle[] {
        // the amount of particles that should be emitted, need to divide by 1000 since elapsed time is in ms but density is p/s
        const particlesToEmit: number = Math.round((elapsedTime / 1000) * this.density);
        const emittedParticles: Particle[] = [];

        let lifeSpan = 0;

        for (let i = 0; i < particlesToEmit; i++) {
            // Generate a random life span between 1 and 10 seconds
            lifeSpan = PARTICLE_MIN_LIFESPAN + Math.round(Math.random() * PARTICLE_MAX_LIFESPAN_INCREASE);

            // If requested apply a variation to the initial velocity magnitude in [0, 1]
            const impulseVariation = this.randomiseInitialVelocity ? Math.random() : 1.0;
            const variedVelocity = this.direction.copy();
            variedVelocity.scale(impulseVariation);

            emittedParticles.push(new Particle(this.position, variedVelocity, lifeSpan));
            // give particles a random colour
            emittedParticles[i].setBaseColour(RGBA.buildRandomRGBA());
            // Mass between 0 and 1 (actually zero-mass objects are not allowed for stability reasons)
            emittedParticles[i].setMass(Math.random());
        }

        return emittedParticles;
    }
}

export {EMITTER_DEFAULT_DENSITY, Emitter};
