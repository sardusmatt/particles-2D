import {Vector2} from "./math-utils";
import {Particle} from "./particle";

/**
 * Force classes (gravity and drag)
 * Since both gravity and drag are global forces, they could probably be implemented
 * more efficiently by storing the acceleration in the integration method (for gravity)
 * and by multiplying the updated velocity for a scaling factor in the integrator (for
 * drag).
 * However, the approach used is more general and would allow us to add forces that act potentially
 * differently for different particles (e.g., anchored springs)
 */
interface Force {
    addToParticle (particle: Particle, elapsedTime?: number): void;
}

class Gravity implements Force {
    private gravityVector: Vector2;

    /**
     * Builds a Gravity force with the assigned vector
     * @param {Vector2} gravityVector
     */
    constructor (gravityVector: Vector2) {
        this.gravityVector = gravityVector;
    }

    addToParticle (particle: Particle, elapsedTime: number) {
        // only apply if the particle doesn't have infinite mass
        if (particle.getInverseMass() > 0) {
            const scaled = this.gravityVector.copy();
            scaled.scale(1.0 / particle.getInverseMass());
            particle.addForce(scaled);
        }
    }
}

class Drag implements Force {
    private dampingFactor: number;

    /**
     * Builds a Drag force with assigned damping factor
     * @param {number} dampingFactor how much drag should slow down the affected particle
     */
    constructor(dampingFactor: number) {
        this.dampingFactor = dampingFactor;
    }

    addToParticle (particle: Particle) {
        // only apply if the particle doesn't have infinite mass
        if (particle.getInverseMass() > 0) {
            const scaled = particle.getVelocity().copy();
            scaled.scale(-this.dampingFactor);
            particle.addForce(scaled);
        }
    }
}

export {Force, Gravity, Drag};


