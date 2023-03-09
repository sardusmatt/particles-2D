# particles-2D

A simple 2D particle system, with support for forces (gravity and drag already implemented). 

Developed in TypeScript 4.x, using webpack as a bundler for demo purposes.

## Main features
- Particles are characterized by lifespan, position, velocity and mass, and are influenced by external forces;
- Support for multiple emitters;
- Aging: particle colour fades out as the particle ages;
- Generic force system: currently the only modelled forces are gravity and drag (a viscous force applied to each particle, so that their velocity is proportionally reduced at each update if no external forces are applied), but the implementation is easily extensible with other, non-global types of forces, such as springs;

## TODO / WIP
- GUI to set simulator parameters, add/remove emitters on the fly etc.;
- 3D extension, using webGLContext instead of 2DContext for rendering;
- Collision detection and response.

## Demo
Check out a simple demo with 2 emitters [here](https://particles.incomingconnection.net).

## Local Testing
```shell
npm i
npm serve
```

## Production Build
```shell
npm build:prod
```



