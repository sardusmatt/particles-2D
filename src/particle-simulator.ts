import {Emitter} from "./emitter";
import {Particle} from "./particle";
import {SimulationArea, Vector2} from "./math-utils";
import {Drag, Gravity} from "./forces";

const DEFAULT_MAX_PARTICLES_PER_SIMULATION: number = 500;
const DEFAULT_GRAVITY: Gravity = new Gravity(new Vector2(0.0, 0.00001));
const DEFAULT_DRAG: Drag = new Drag(0.001);
/**
 * ParticleSimulator class is a container for the simulated emitters and particles
 *  # emitters: currently active emitters
 *  # particles: currently active particles
 *  # maxParticles: the maximum number of particles that can be active at a given time
 *  # boundaries: the simulation area is bound to the size of the canvas, so that particles that
 *    go outside the boundaries are pruned
 */
class ParticleSimulator {
    private emitters: Emitter[];
    private particles: Particle[];
    private maxParticles: number;
    private boundaries: SimulationArea;

    // simulation forces
    private gravity: Gravity = DEFAULT_GRAVITY;
    private drag: Drag = DEFAULT_DRAG;

    /**
     * @param {number} maxNumberOfParticles max numbers of particles active at any time
     * @param {number} minX minimum X of the simulation area
     * @param {number} maxX maximum X of the simulation area
     * @param {number} minY minimum Y of the simulation area
     * @param {number} maxY maximum Y of the simulation area
     */
    constructor(maxNumberOfParticles, minX, maxX, minY, maxY) {
        this.emitters = [];
        this.particles =  [];
        this.maxParticles = (maxNumberOfParticles && maxNumberOfParticles > 0) ? maxNumberOfParticles : DEFAULT_MAX_PARTICLES_PER_SIMULATION;
        this.boundaries = new SimulationArea(minX, maxX, minY, maxY);
    }

    /**
     * Set a new max particle limit for the simulation
     * @param {number} maxParticles the new upper particle limit at any given time
     */
    setMaxParticlesLimit (maxParticles: number) {
        if (maxParticles && maxParticles > 0) {
            this.maxParticles = maxParticles;
        }
    }

    /**
     * Set the gravity (or removes it altogether) for the simulation
     * @param {Gravity} gravity if not passed, gravity force will be disabled
     */
    setGravity (gravity?: Gravity) {
        this.gravity = gravity;
    }

    /**
     * Set the drag force (or removes it altogether) for the simulation
     * @param {Drag} drag if not passed, drag force will be disabled
     */
    setDrag (drag?: Drag) {
        this.drag = drag;
    }

    addEmitter (emitter: Emitter) {
        this.emitters.push(emitter);
    }

    // Debug method. Particles should not be added directly (instead emitters should be used)
    addParticle (p: Particle) {
        if (this.particles.length < this.maxParticles) {
            this.particles.push(p);
        }
    }

    /**
     * Update existing particles, removing them if they are not active anymore, then add new particles from the emitters
     * @param {number} elapsedTime
     */
    update (elapsedTime) {
        // Update current particle list
        const currentlyActiveParticles = [];
        this.particles.forEach(p => {
            // Add forces
            if (this.gravity) {
                this.gravity.addToParticle(p, elapsedTime);
            }
            if (this.drag) {
                this.drag.addToParticle(p);
            }

            if (p.update(elapsedTime) && this.boundaries.contains(p.getPosition())) { // particle is still active
                currentlyActiveParticles.push(p);
            }
        });

        this.particles = currentlyActiveParticles;

        // Then add new particles from the emitters
        this.emitters.forEach(e => {
            const newParticles: Particle[] = e.emitParticles(elapsedTime);
            const maxNewParticles: number = this.maxParticles - this.particles.length;
            // Add as many particles as possible and then leave.
            // Note that this is not a fair policy. If there is not enough room for all the particles,
            // available slots should be distributed among the emitters (possibly proportionally to the density)
            if (maxNewParticles < newParticles.length) {
                this.particles.push(...newParticles.slice(0, maxNewParticles));
                return;
            } else {
                this.particles.push(...newParticles);
            }
        });
    }

    /**
     * Render the active particles on the 2D context passed as argument
     * No check is performed on the particles to see if they are still alive,
     * since the method is supposed to be called after the update phase
     * @param {CanvasRenderingContext2D} context to draw particles on
     */
    render (context: CanvasRenderingContext2D) {
        this.particles.forEach(p => {
            Particle.draw(p, context);
        });
    }
}

export {DEFAULT_MAX_PARTICLES_PER_SIMULATION, ParticleSimulator};
