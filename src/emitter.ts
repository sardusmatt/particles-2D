import {PARTICLE_MIN_LIFESPAN, PARTICLE_MAX_LIFESPAN_INCREASE, Particle} from "./particle";
import {Vector2} from './math-utils';
import {RGBA} from "./utils";

const EMITTER_DEFAULT_DENSITY: number = 10; // default number of particles emitted p/s
// used to compute a particle's radius as proportional to its lifespan
const PARTICLE_MAX_LIFESPAN = PARTICLE_MIN_LIFESPAN + PARTICLE_MAX_LIFESPAN_INCREASE;
const DEFAULT_EMITTED_PARTICLE_MAX_RADIUS = 8.0;

class Emitter {
    // 2D position and direction of th emitter
    private position: Vector2;
    private direction: Vector2;
    // amount of emitted particles per second
    private density: number;
    // max radius assigned to any emitted particle
    private particleMaxRadius: number;
    // whether to randomise particles' initial velocity
    private randomiseInitialVelocity: boolean;

    /**
     * @param {number} posX X coordinate of the emitter
     * @param {number} posY Y coordinate of the emitter
     * @param {number} dirX X component of the launching direction
     * @param {number} dirY Y component of the launching direction
     * @param {number} particlesPerSecond total particles emitted per second
     * @param {number} particleMaxRadius max radius assigned to any emitted particle
     * @param randomiseInitialVelocity {boolean} true iff particles should have randomised initial velocity
     * @constructor
     */
    constructor (posX: number, posY: number, dirX: number, dirY: number, particlesPerSecond: number, particleMaxRadius: number, randomiseInitialVelocity: boolean) {
        this.position = new Vector2(posX, posY);
        this.direction = new Vector2(dirX, dirY);
        this.density = (particlesPerSecond && particlesPerSecond > 0) ? particlesPerSecond : EMITTER_DEFAULT_DENSITY;
        this.particleMaxRadius = (particleMaxRadius && particleMaxRadius > 0) ? particleMaxRadius : DEFAULT_EMITTED_PARTICLE_MAX_RADIUS;
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

        for (let i = 0; i < particlesToEmit; i++) {
            // Generate a random life span between 1 and 10 seconds
            const lifeSpan = PARTICLE_MIN_LIFESPAN + Math.round(Math.random() * PARTICLE_MAX_LIFESPAN_INCREASE);

            // If requested apply a variation to the initial velocity magnitude in [-0.5, 0.5] for each component
            // 0 values are skipped for stability reason
            const initialVelocity = this.direction.copy();
            if (this.randomiseInitialVelocity) {
                const impulseXVariation = (Math.random() - 0.5) || null;
                const impulseYVariation = (Math.random() - 0.5) || null;
                if (impulseXVariation) {
                    initialVelocity.x += impulseXVariation;
                }
                if (impulseYVariation) {
                    initialVelocity.y += impulseYVariation;
                }
            }

            // radius proportional to the particle lifespan and it's velocity
            const radius = lifeSpan / PARTICLE_MAX_LIFESPAN * this.particleMaxRadius * initialVelocity.magnitude();

            emittedParticles.push(new Particle(this.position.copy(), initialVelocity, lifeSpan, radius));
            // give particles a random colour
            emittedParticles[i].setBaseColour(RGBA.buildRandomRGBA());
            // Mass between 0 and 1 (actually zero-mass objects are not allowed for stability reasons)
            emittedParticles[i].setMass(Math.random());
        }

        return emittedParticles;
    }

    /**
     * For simplicity, let's keep the draw function in the same module. Every emitter is drawn as a white circle for now
     * @param {Emitter} emitter the emitter to be drawn
     * @param {CanvasRenderingContext2D} context 2D Canvas Context object
     */
    static draw (emitter: Emitter, context: CanvasRenderingContext2D) {
        context.beginPath();
        // position, radius, start angle, end angle
        context.arc(emitter.getPosition().x, emitter.getPosition().y, 10, 0, Math.PI * 2);
        context.closePath();
        context.fillStyle = 'rgba(255,255,255,1.0)';
        context.fill();
    }
}

export {EMITTER_DEFAULT_DENSITY, DEFAULT_EMITTED_PARTICLE_MAX_RADIUS, Emitter};
