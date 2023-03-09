import {ParticleSimulator, DEFAULT_MAX_CONCURRENT_PARTICLES} from "./particle-simulator";
import {Vector2} from "./math-utils";
import {Emitter} from "./emitter";

declare global {
    interface Window { startSim: any; }
}

/* Some key codes to avoid magic numbers */
const KEY_CODES = {LEFT:37, DOWN:40, RIGHT:39, UP:38, END:35, HOME:36, SPACE:32,
    F2: 113, F4: 115, T: 84, P: 80, R: 82, W: 87};

class Simulation {
    private canvas: HTMLCanvasElement; // canvas element reference
    private context2D: CanvasRenderingContext2D | null;
    private timeOfLastUpdate: number;
    private particleSimulator: ParticleSimulator;

    /* Current keyboard input */
    private downKeys: string[];

    /* Mouse input */
    private prevMousePos: Vector2 = new Vector2(0.0, 0.0);
    private mouseDown: boolean = false;

    constructor(doc: Document, windowHeight: number, windowWidth: number) {
        this.canvas = doc.getElementById('canvas') as HTMLCanvasElement;
        // Enlarge canvas based on the width and height of the client window
        this.canvas.height = windowHeight;
        this.canvas.width = windowWidth;
        this.context2D = this.canvas.getContext("2d");
        // Set the maximum number of active particles and the boundaries of the simulation area
        this.particleSimulator = new ParticleSimulator(DEFAULT_MAX_CONCURRENT_PARTICLES, 0, this.canvas.width, 0, this.canvas.height);
        // initialise with the current time
        this.timeOfLastUpdate = new Date().getTime();

        /* Current keyboard input */
        this.downKeys = [];
        /* Mouse input */
        this.prevMousePos = new Vector2(0.0, 0.0);
        this.mouseDown = false;
        this.attachInputHooks(doc);
    }

    private attachInputHooks (doc: Document) {
        /* Keyboard and mouse input hooks */
        // TODO
    }

    handleKeyDown (event: KeyboardEvent) {
        switch (event.code) {
            // TODO
        }
    }

    handleKeyUp (event: KeyboardEvent) {
        switch (event.code) {
            // TODO
        }
    }

    handleKeyboardInput () {
        // TODO
    }

    handleMouseMove (event: MouseEvent) {
        const dx = this.prevMousePos.x - event.clientX;
        const dy = this.prevMousePos.y - event.clientY;
        this.prevMousePos.x = event.clientX;
        this.prevMousePos.y = event.clientY;

        // TODO
    }

    handleMouseUp (event: MouseEvent) {
        this.mouseDown = false;
    }

    handleMouseDown (event: MouseEvent) {
        this.mouseDown = true;
    }

    /**
     * Draw a new frame on the canvas
     */
    draw () {
        if (this.context2D) {
            // Clear canvas context
            this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context2D.fillStyle = "black";
            this.context2D.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw particles
            this.particleSimulator.render(this.context2D);
        }
        else {
            console.warn('null 2D context, skipping draw');
        }
    }

    /**
     * Update the simulation using the specified amount of time
     * @param {number} elapsedTime
     */
    update (elapsedTime: number) {
        this.particleSimulator.update(elapsedTime);
    }

    /**
     * The function is ideally invoked every tickInterval milliseconds, and is in charge
     * of updating the simulation and drawing the resulting frame on the canvas
     */
     tick () {
        const timeOfThisUpdate = new Date().getTime();
        const timeFromLastUpdate = (timeOfThisUpdate - this.timeOfLastUpdate);
        this.timeOfLastUpdate = timeOfThisUpdate;

        this.handleKeyboardInput();

        this.update(timeFromLastUpdate);
        this.draw();
    }

    /**
     * Particle system initialization
     */
    initDemoSimulation () {
        // For now no user driven init, simply create a couple of emitters and let them rip
        // Add two emitters at the bottom left and bottom right of the canvas
        // The first one randomizes the magnitude of the initial velocity applied to the
        // emitted particles, while the second does not
        this.particleSimulator.addEmitter(new Emitter(200, this.canvas.height - 200, 0.1, -0.15, 16, 90, false));
        this.particleSimulator.addEmitter(new Emitter(this.canvas.width / 2 + 50, this.canvas.height / 2 - 10, -0.2, -0.2, 15, 30, true));
    }
}

window.startSim = () => {
    const sim = new Simulation(document, window.innerHeight, window.innerWidth);
    sim.initDemoSimulation();
    const fps = 60;

    const simulate = () => {
        sim.tick();

        // force fps, since just using requestAnimationFrame doesn't provide a consistent fps on mobile
        setTimeout(() => {
            requestAnimationFrame(simulate);
        }, 1000 / fps);
    };

    requestAnimationFrame(simulate);
};




