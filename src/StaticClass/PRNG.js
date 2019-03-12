/*
 * PRNG.js
 *
 * Park-Miller-Carta Pseudo-Random Number Generator
 * http://www.firstpr.com.au/dsp/rand31/
 *
 * Pseudorandom Number Generator.
 */

PRNG = new function()
{
    var _seed = new Date().getTime();

    function genNextSeed()
    {
        var low  = 16807 * (_seed & 0xFFFF);
        var high = 16807 * (_seed >>> 16);

        low += (high & 0x7FFF) << 16;
        low += high >> 15;

        if(low > 0x7FFFFFFF){low -= 0x7FFFFFFF;}

        return (_seed = low);
    }

    this.nextRange = function(min,max)
    {
        return this.rand() * (max - min) + min;
    }

    this.rand = function()
    {
        return genNextSeed()/(2147483647.0);
    }

    this.__defineSetter__("seed", function(value) { if (value && value > 0){ _seed = value; } });
}