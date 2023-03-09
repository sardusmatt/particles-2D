class RGBA {
    r: number;
    g: number;
    b: number;
    a: number;

    /**
     * Default constructor returns a fully-opaque white particle
     * @constructor
     */
    constructor () {
        this.r = 255;
        this.g = 255;
        this.b = 255;
        this.a = 1.0;
    }

    toString () : string {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }

    private static isAcceptableChannelValue (c: number) : boolean {
        return Number.isInteger(c) && c >= 0 && c < 256;
    }

    private static isAcceptableAlphaValue (c: number) : boolean {
        return c >= 0 && c <= 1;
    }

    static buildRGBA (r: number, g: number, b: number, a: number) : RGBA {
        // not ideal to do type checking at runtime, but it's not possible to statically check a float range anyway
        const rgba = new RGBA();
        let invalidInput : boolean = false;
        if (this.isAcceptableChannelValue(r)) {
            rgba.r = r;
        }
        else {
            invalidInput = true;
        }
        if (this.isAcceptableChannelValue(g)) {
            rgba.g = g;
        }
        else {
            invalidInput = true;
        }
        if (this.isAcceptableChannelValue(b)) {
            rgba.b = b;
        }
        else {
            invalidInput = true;
        }
        if (this.isAcceptableAlphaValue(a)) {
            rgba.a = a;
        }
        else {
            invalidInput = true;
        }

        if (invalidInput) {
            console.warn(`Invalid parameters passed to buildRGBA factory function: rgba(${r},${g},${b},${a})`);
        }

        return rgba;
    }

    static buildRandomRGBA() {
        return this.buildRGBA(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255), 1.0);
    }
}

export {RGBA};
