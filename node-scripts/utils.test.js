const { cleanUp } = require('./utils');

describe('cleanUp()', () => {
    it('Returns empty array when not passed words', () => {
        expect(cleanUp([])).toEqual([])
        expect(cleanUp(undefined)).toEqual([])
        expect(cleanUp(null)).toEqual([])
    });
    it('Normalizes casing of words', () => {
        expect(cleanUp(["PROCESSING"])).toEqual(["Processing"])
        expect(cleanUp(["Processing"])).toEqual(["Processing"])
        expect(cleanUp(["processing"])).toEqual(["Processing"])
    });
    it('Returns special casing when it exists', () => {
        expect(cleanUp(["p5js"])).toEqual(["p5.js"])
        expect(cleanUp(["P5.js"])).toEqual(["p5.js"])
        expect(cleanUp(["P5"])).toEqual(["p5.js"])
        expect(cleanUp(["p5.js"])).toEqual(["p5.js"])

    });
})
