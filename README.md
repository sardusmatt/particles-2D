** particles-2D **

A simple 2D particle system, with support for forces (gravity and drag already implemented). Developed in TypeScript 4.x.

Main features:
- particles are characterized by lifespan, position, velocity and mass, and are influenced by external forces;
- support for multiple emitters;
- aging: particle colour fades out as the particle ages;
- generic force system: currently the only modelled forces are gravity and drag (a viscous force applied to each particle, so that their velocity is proportionally reduced at each update if no external forces are applied), but the implementation is easily extensible with other, non-global types of forces, such as springs;
- simple simulator (currently no user input or GUI to set simulation parameters, yet).



