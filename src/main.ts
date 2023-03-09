import {ParticleSimulator} from "./particle-simulator";
import {Vector2} from "./math-utils";
import {Emitter} from "./emitter";

declare global {
    interface Window { simulation: any; }
}

/* Some key codes to avoid magic numbers */
const KEY_CODES = {LEFT:37, DOWN:40, RIGHT:39, UP:38, END:35, HOME:36, SPACE:32,
    F2: 113, F4: 115, T: 84, P: 80, R: 82, W: 87};

const TICK_INTERVAL: number = 1000/60;   // desired FPS 60

class Simulation {
    private canvas: HTMLCanvasElement | undefined; // canvas element reference
    private context2D: CanvasRenderingContext2D | undefined;
    private timeOfLastUpdate: number = new Date().getTime();
    private particleSimulator: ParticleSimulator | undefined;

    /* Current keyboard input */
    private downKeys: string[] = [];

    /* Mouse input */
    private prevMousePos: Vector2 = new Vector2(0.0, 0.0);
    private mouseDown: boolean = false;

    /**
     * Adjusts canvas size based on the size of the client window
     */
    setCanvasSize () {
        const canvasNode = document.getElementById('canvas') as HTMLCanvasElement;
        canvasNode.height = window.innerHeight * 0.95;
        canvasNode.width = window.innerWidth * 0.98;
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

        // TODO
    }

    handleMouseDown (event: MouseEvent) {
        this.mouseDown = true;

        // TODO
    }

    /**
     * Draw a new frame on the canvas
     */
    draw () {
        if (this.context2D && this.canvas && this.particleSimulator) {
            // Clear canvas context
            this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context2D.fillStyle = "black";
            this.context2D.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw particles
            this.particleSimulator.render(this.context2D);
        }
        else {
            console.warn('Undefined 2D context, canvas and/or particle simulator instance: skip drawing');
        }
    }

    /**
     * Update the simulation using the specified amount of time
     * @param {number} elapsedTime
     */
    update (elapsedTime: number) {
        if (this.particleSimulator) {
            this.particleSimulator.update(elapsedTime);
        }
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
    initSimulation () {
        if (this.canvas) {
            // For now no user driven init, simply create a couple of emitters and let them rip
            // Set the maximum number of active particles and the boundaries of the simulation area
            this.particleSimulator = new ParticleSimulator(2000, 0, this.canvas.width, 0, this.canvas.height);

            // Add two emitters at the bottom left and bottom right of the canvas
            // The first one randomizes the magnitude of the initial velocity applied to the
            // emitted particles, while the second does not
            this.particleSimulator.addEmitter(new Emitter(this.canvas.width - 50, this.canvas.height - 10, -0.2, -0.25, 100, true));
            this.particleSimulator.addEmitter(new Emitter(50, this.canvas.height - 10, 0.1, -0.1, 100, false));
        }
        else {
            console.warn('Failed to initialise simulation, no canvas reference');
        }
    }

    /**
     * The startup function is called every time the page is loaded or refreshed. It initializes the canvas and 2D context,
     * performs the setup of the particle system and starts the simulation
     */
    startup () {
        // Enlarge canvas based on the width and height of the client window
        this.setCanvasSize();

        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.context2D = this.canvas.getContext("2d") || undefined;

        /* Keyboard and mouse input hooks */
        // TODO
        document.onkeydown = this.handleKeyDown;
        document.onkeyup = this.handleKeyUp;
        document.onmousemove = this.handleMouseMove;
        document.onmousedown = this.handleMouseDown;
        document.onmouseup = this.handleMouseUp;

        this.initSimulation();

        /* Call update and draw every tickInterval milliseconds */
        setInterval(this.tick, TICK_INTERVAL);
    }
}

window.simulation = new Simulation();


