/*
 * BitmapData.js by David Rosini.
 * based on Actionscript 3.0 BitmapData class.
 * Version 0.1
 * HTML5 Canvas API implementation of the operation with image data.
 */

/*
 * TODO: implement data merge.
 */

/**
 * Creates a  BitmapData object with a specified width and height.
 * If you specify a value for the  fillColor parameter, every pixel in the bitmap is set
 * to that color.
 *
 * By default, the bitmap is created as transparent, unless you pass the value false
 * for the transparent parameter. After you create an opaque bitmap, you cannot change it to
 * a transparent bitmap. Every pixel in an opaque bitmap uses only 24 bits of color channel information.
 * If you define the bitmap as transparent, every pixel uses 32 bits of color channel information,
 * including an alpha transparency channel.
 * @param {Int}     width    The width of the bitmap image in pixels.
 * @param {Int}     height   The height of the bitmap image in pixels.
 * @param {Boolean} transparent  Specifies whether the bitmap image supports per-pixel transparency.
 *   The default value is true (transparent). To create a fully transparent bitmap, set the value
 *   of the transparent parameter to true and the value of the fillColor
 *   parameter to 0x00000000 (or to 0).
 * @param {Hex}     fillColor A 32-bit RGBA color value that you use to fill the bitmap image area.
 *   The default value is 0xFFFFFFFF (solid white).
 * @return {BitmapData} A new BitmapData object.
 */
function BitmapData(width,height,transparent,fillColor)
{
    Event.call(this);

    var _self = this,
        _filterType,
        _transparent,
        _width  = isFinite(width) && width !== 0 ? width : 1,
        _height = isFinite(height) && height !== 0 ? height : 1,
        _imageData = OffSetCanvas.context.createImageData(_width,_height),
        _data = _imageData.data;

    fillColor = isFinite(fillColor)?fillColor:0xFFFFFFFF;

    if(transparent == undefined){transparent = true};
    _transparent = transparent;
    
    if (_transparent)
    {
        fillColor = fillColor << 8;
    }

    /**
     * Returns a new BitmapData object that is a clone of the original instance
     * with an exact copy of the contained bitmap.
     * @return {BitmapData} A new BitmapData object that is identical to the original.
     */
    this.clone = function()
    {
        var cloneBmd = new BitmapData(_width, _height, _transparent);
        cloneBmd.imageData = OffSetCanvas.getDatafromSource(_imageData);

        return cloneBmd;
    }

    /**
     * Returns an RGBA color value that contains RGB data and alpha channel
     * data.
     * @param  {Int} x    The x position of the pixel.
     * @param  {Int} y    The y position of the pixel.
     * @return {Int}      A number representing an RGBA pixel value. If the (x, y) coordinates are
     *                    outside the bounds of the image, value 0 is returned.
     */
    this.getPixel = function(x,y)
    {
        if(x == undefined || y == undefined){throw new Error("Invalid Parameters.")}

        if(x > -1 && x < _width && y > -1 && y < _height)
        {
            var index = (x + y * _width) * 4;
            return (_data[index] << 24 | _data[index+1] << 16 | _data[index+2] << 8 | _data[index+3]);
        }
        return 0;
    }

    /**
     * Sets the color and alpha transparency values of a single pixel of a BitmapData
     * object.
     *
     * @param {Int} x        The x position of the pixel whose value changes.
     * @param {Int} y        The y position of the pixel whose value changes.
     * @param {Hex} color    The resulting RGBA color for the pixel. RGBA colors are often
     *                       specified in hexadecimal format; for example, 0xF10111A1.
     */
    this.setPixel = function(x, y,color)
    {
        if(x == undefined || y == undefined || isNaN(color)){throw new Error("Invalid Parameters.")};

        if(x > -1 && x < _width && y > -1 && y < _height)
        {
            var index = (x + y * _width) * 4;
            _data[index] =    color >>> 24;
            _data[index+1] = (color >> 16) & 0xFF;
            _data[index+2] = (color >> 8) & 0xFF;
            _data[index+3] =  color & 0xFF;

            this["dispatchEvent"]("Update");
        }
    }

    /**
     * Performs a flood fill operation on an image starting
     * at an (x, y) coordinate and filling with a certain color. The
     * floodFill() method is similar to the paint bucket tool in various paint
     * programs. The color is an RGBA color that contains alpha information and
     * color information.
     * @param {Int} x          The x coordinate of the image.
     * @param {Int} y          The y coordinate of the image.
     * @param {Hex} fillColor  The RGBA color to use as a fill. RGBA colors are often
     *                         specified in hexadecimal format; for example, 0x00336680.
     */
    this.floodFill = function(x,y,fillColor)
    {
        if(x == undefined || y == undefined){throw new Error("Invalid Parameters.")};

        if(x < 0 || x > _width ){x = 0;}
        if(y < 0 || y > _height ){y = 0;}

        fillColor = isFinite(fillColor)?fillColor:0xFFFFFFFF;

        var index,posi,
            pixelStack = [[x,y]],
            left = false,right = false,

            tolerance = 255*0.2,
            or = 0,og = 0,ob = 0,
            cr = 0,cg = 0,cb = 0;

        index = (x + y * _width) * 4;
        or = _data[index];
        og = _data[index+1];
        ob = _data[index+2];
        
        if ((or << 16 | og << 8 | ob) === fillColor >>> 8) { return };

        while(pixelStack.length)
        {
            posi = pixelStack.pop();

            x = posi[0];
            y = posi[1];

            left = false;
            right = false;

            do
            {
                index = (x + --y * _width) * 4;
                cr = _data[index];
                cg = _data[index+1];
                cb = _data[index+2];
            }while (y >= 0 && Math.sqrt((cr - or)*(cr - or) + (cg - og)*(cg - og) + (cb - ob)*(cb - ob)) <= tolerance && (cr << 16 | cg << 8 | cb) !== fillColor >>> 8)

            y++;

            do
            {
                index = (x + y * _width) * 4;
                _data[index]   =  fillColor >>> 24;
                _data[index+1] = (fillColor >> 16) & 0xFF;
                _data[index+2] = (fillColor >> 8) & 0xFF;
                _data[index+3] =  fillColor & 0xFF;
                if (x > 0)
                {
                    cr = _data[(index-4)];
                    cg = _data[(index-4)+1];
                    cb = _data[(index-4)+2];
                    if (Math.sqrt((cr - or)*(cr - or) + (cg - og)*(cg - og) + (cb - ob)*(cb - ob)) <= tolerance && (cr << 16 | cg << 8 | cb) !== fillColor >>> 8)
                    {
                        if(!left)
                        {
                            // Add pixel to stack
                            pixelStack.push([x - 1, y]);
                            left = true;
                        }
                    }else if(left)
                    {
                        left = false;
                    }
                }

                if (x < _width - 1)
                {
                    cr = _data[(index+4)];
                    cg = _data[(index+4)+1];
                    cb = _data[(index+4)+2];
                    if (Math.sqrt((cr - or)*(cr - or) + (cg - og)*(cg - og) + (cb - ob)*(cb - ob)) <= tolerance && (cr << 16 | cg << 8 | cb) !== fillColor >>> 8)
                    {
                        if(!right)
                        {
                            // Add pixel to stack
                            pixelStack.push([x + 1, y]);
                            right = true;
                        }
                    }else if(right)
                    {
                        right = false;
                    }
                }

                index = (x + (y+1) * _width) * 4;
                cr = _data[index];
                cg = _data[index+1];
                cb = _data[index+2];
            
            }while (++y < _height && Math.sqrt((cr - or)*(cr - or) + (cg - og)*(cg - og) + (cb - ob)*(cb - ob)) <= tolerance && (cr << 16 | cg << 8 | cb) !== fillColor >>> 8)
        }
        this["dispatchEvent"]("Update");
    }

    /**
     * Fills a rectangular area of pixels with a specified RGBA color.
     * @param  {Rectangle} rect  A rectangle object containing x, y, width and height.
     * @param  {Hex} fillColor   The RGBA color value that fills the area. RGBA colors are often
     *                           specified in hexadecimal format; for example, 0xFF336699.
     */
    this.fillRect = function(rect,fillColor)
    {
        if(!(rect instanceof Object)){throw new Error("Invalid rectangle object.")};

        var x = rect.x || 0,
            y = rect.y || 0,
            w = rect.width || 1,
            h = rect.height || 1,

            index,i,j,destW,destH,

            redChannel,greenChannel,blueChannel,alphaChannel;

        if(x < 0){x = _width + x;}else if(x >= _width){x = x - _width;}
        if(y < 0){y = _height + y;}else if(y >= _height){y = y - _height;}

        if(x + w > _width){w = _width - x;}
        if(y + h > _height){h = _height - y;}

        fillColor = isFinite(fillColor)?fillColor:0xFFFFFFFF;

        if (fillColor === 0){fillColor = 0x000000FF};

        redChannel   = fillColor >>> 24;
        greenChannel = (fillColor >> 16) & 0xFF;
        blueChannel  = (fillColor >> 8) & 0xFF;
        alphaChannel = fillColor & 0xFF;

        destW = x + w;
        destH = y + h;

        for (i = y; i < destH; i += 1)
        {
            for (j = x; j < destW; j+= 1)
            {
                index = (j + i * _width) * 4;

                _data[index]   = redChannel;
                _data[index+1] = greenChannel;
                _data[index+2] = blueChannel;
                _data[index+3] = alphaChannel;
            }
        }
        this["dispatchEvent"]("Update");
    }

    /**
     * Transfers data from one channel of another on the current bitmapData.
     * All of the data in the other channels in the destination bitmapData are preserved.
     *
     * The channel value that can be transfer are one of following values:
     * ColorChannel.RED,ColorChannel.GREEN,ColorChannel.BLUE and ColorChannel.ALPHA.
     *
     * @param  {Rectangle} rect    A rectangle object containing x, y, width and height.
     * @param  {Int} destX         destination x position of the rectangle on the image.
     * @param  {Int} destY         destination y position of the rectangle on the image.
     * @param  {int} sourceChannel the source channel. Use a value from the ColorChannel.RED, ColorChannel.BLUE,
     *                             ColorChannel.GREEN or ColorChannel.ALPHA.
     * @param  {int} destChannel   The destination channel. Use a value from the ColorChannel.RED, ColorChannel.BLUE,
     *                             ColorChannel.GREEN or ColorChannel.ALPHA.
     */
    this.copyChannel = function(rect,destX,destY,sourceChannel,destChannel)
    {
        if(!(rect instanceof Object)){throw new Error("Invalid rectangle object.")}

        if(destX == undefined || destY == undefined || sourceChannel == undefined || destChannel == undefined){throw new Error("Invalid Parameters.")}

        var x = rect.x || 0,
            y = rect.y || 0,
            w = rect.width || 1,
            h = rect.height || 1,

            chOri,chDest,

            iOri,iDest,i,j = 1;

        chOri = (sourceChannel & ColorChannel.RED) ? 0 : 0 | (sourceChannel & ColorChannel.GREEN) ? 1 : 0 | (sourceChannel & ColorChannel.BLUE)  ? 2 : 0 | (sourceChannel & ColorChannel.ALPHA) ? 3 : 0;
        chDest = (destChannel & ColorChannel.RED) ? 0 : 0 | (destChannel & ColorChannel.GREEN) ? 1 : 0 | (destChannel & ColorChannel.BLUE)  ? 2 : 0 | (destChannel & ColorChannel.ALPHA) ? 3 : 0;

        if(x < 0){x = _width + x;}else if(x >= _width){x = x - _width;};
        if(y < 0){y = _height + y;}else if(y >= _height){y = y - _height;};

        if(x + w > _width){w = _width - x;};
        if(y + h > _height){h = _height - y;};

        if(destX < 0){destX = _width + destX;}else if(destX >= _width){destX = destX - _width;};
        if(destY < 0){destY = _height + destY;}else if(destY >= _height){destY = destY - _height;};

        for (i = 0; i < h; i += 1)
        {
            for (j = 0; j < w; j += 1)
            {
                iOri = ((j + x) + (i + y) * _width) * 4;
                iDest = ((j + destX) + (i + destY) * _width) * 4;

                _data[iDest+chDest] = _data[iOri+chOri];
            }
        }

        this["dispatchEvent"]("Update");
    }

    /**
     * Fills an image with pixels representing random noise.
     * @param {Int} randomSeed      The random seed number to use. If you keep all other parameters
     *                              the same, you can generate different pseudo-random results by varying the random seed value. The noise
     *                              function is a mapping function, not a true random-number generation function, so it creates the same
     *                              results each time from the same random seed.
     * @param {Int} low             The lowest value to generate for each channel (0 to 255).
     * @param {Int} high            The highest value to generate for each channel (0 to 255).
     * @param {Int} channelOptions  A number that can be a combination of any of
     *                              the four color channel values (ColorChannel.RED, ColorChannel.BLUE, ColorChannel.GREEN and
     *                              ColorChannel.ALPHA). You can use the logical OR operator (|) to combine channel values.
     * @param {Boolean} grayScale   A Boolean value. If the value is true, a grayscale image is created by setting
     *                              all of the color channels to the same value.
     *                              The alpha channel selection is not affected by
     *                              setting this parameter to true.
     */
    this.noise = function(randomSeed, low, high, channelOptions, grayScale)
    {
        var i = 0,j = 0,index = 0;

        low  = isFinite(low)? low : 0;
        high = isFinite(high)? high : 255;
        PRNG.seed = randomSeed && isFinite(randomSeed)? randomSeed : new Date().getTime();
        channelOptions = isFinite(channelOptions)? channelOptions : ColorChannel.RGB;

        for (i = 0; i < _height; i += 1)
        {
            for (j = 0; j < _width; j += 1)
            {
                index = (j + i * _width) * 4;

                _data[index]   = (channelOptions & ColorChannel.RED)   ? PRNG.nextRange(low,high) : 0;
                _data[index+1] = (channelOptions & ColorChannel.GREEN) ? PRNG.nextRange(low,high) : 0;
                _data[index+2] = (channelOptions & ColorChannel.BLUE)  ? PRNG.nextRange(low,high) : 0;
                _data[index+3] = (channelOptions & ColorChannel.ALPHA) ? PRNG.nextRange(low,high) : _data[index+3];
                
                if (grayScale) {_data[index] = _data[index+1] = _data[index+2] = (_data[index] + _data[index+1] + _data[index+2])/3;}
            }
        }
        this["dispatchEvent"]("Update");
    }

    /**
     * Remaps the color channel values in an image that has up to
     * four arrays of color palette data, one for each channel.
     * 
     * it generate the resulting image: After the red, green, blue, and alpha values are computed,
     * they are added together using standard 32-bit-integer arithmetic.
     * The red, green, blue, and alpha channel values of each pixel are extracted into separate 0 to 255 values.
     * These values are used to look up new color values in the appropriate array: redArray, greenArray, blueArray, and alphaArray.
     * Each of these four arrays should contain 256 values. After all four of the new channel values are retrieved,
     * they are combined into a standard RGBA value that is applied to the pixel. Cross-channel effects can be supported with this method.
     * Each input array can contain full 32-bit values, and no shifting occurs when the
     * values are added together. This routine does not support per-channel clamping.
     * If no array is specified for a channel, the color channel is copied from the source image
     * to the destination image. You can use this method for a variety of effects such as
     * general palette mapping (taking one channel and converting it to a false color image).
     * You can also use this method for a variety of advanced
     * color manipulation algorithms, such as gamma, curves, levels, and quantizing.
     *
     * @param {Rectangle} rect   A rectangle that defines the area of the source image to use as input.
     * @param {int} destX        The x position within the destination image (the current BitmapData object)
     *                           that corresponds to the upper-left corner of the source rectangle.
     * @param {int} destY        The y position within the destination image (the current BitmapData object)
     *                           that corresponds to the upper-left corner of the source rectangle.
     * @param {Array} redArray   If redArray is not null, red = redArray[source red value] 
     *                           else red = source rect value.
     * @param {Array} greenArray If greenArray is not null, green = greenArray[source green value] 
     *                           else green = source green value.
     * @param {Array} blueArray  If blueArray is not null, blue = blueArray[source blue value] 
     *                           else blue = source blue value.
     * @param {Array} alphaArray If alphaArray is not null, alpha = alphaArray[source alpha value] 
     *                           else alpha = source alpha value.
     */
    this.paletteMap = function(imgData,rect,destX,destY,redArray,greenArray,blueArray,alphaArray)
    {
        /*
        * TODO: generate image color palette map.
        */

        if(!(rect instanceof Object)){throw new Error("Invalid rectangle object.")};

        if(destX == undefined || destY == undefined){throw new Error("Invalid Parameters.")}

        var x = rect.x || 0,
            y = rect.y || 0,
            w = rect.width || 1,
            h = rect.height || 1,

            r,g,b,a,

            iOri,iDest,i,j;

        if(x < 0){x = _width + x;}else if(x >= _width){x = x - _width;};
        if(y < 0){y = _height + y;}else if(y >= _height){y = y - _height;};

        if(x + width >= _width){width = _width - x;};
        if(y + height >= _height){height = _height - y;};

        if(destX < 0){destX = _width + destX;}else if(destX >= _width){destX = destX - _width;};
        if(destY < 0){destY = _height + destY;}else if(destY >= _height){destY = destY - _height;};

        for (i = 0; i < h; i += 1)
        {
            for (j = 0; j < w; j += 1)
            {
                iOri = ((j + x) + (i + y) * _width) * 4;
                iDest = ((j + destX) + (i + destY) * _width) * 4;

                r = _data[iOri];
                g = _data[iOri+1];
                b = _data[iOri+2];
                //a = _data[iOri+3];

                _data[iDest]   = redArray[r];;
                _data[iDest+1] = greenArray[g];
                _data[iDest+2] = blueArray[b];
                //_data[iDest+3] = alphaArray[a];
            }
        }
        this["dispatchEvent"]("Update");
    }

    this.flipData = function(ori)
    {
        var index = 0,mirrorIndex = 0,
            row = 0,col = 0,maxRow = 0,
            
            mirror = OffSetCanvas.context.createImageData(_width,_height),
            mData = mirror.data;
            
            ori = ori != undefined?ori:FlipMode.HORIZONTAL;

        for (row = 0; row < _height; row += 1)
        {
            for (col = 0; col < _width; col += 1)
            {
                index = (col + row * _width) * 4;

                if(ori === "horizontal")
                {
                    mirrorIndex = (_width - 1) - col;
                    mirrorIndex = (mirrorIndex + row * _width) * 4;
                }else if (ori === "vertical")
                {
                       maxRow = _height - row;
                       mirrorIndex = (col + maxRow * _width) * 4;
                }else{ return }/* if (ori === "rotation90")
                {
                }else if (ori === "rotation180")
                {
                }*/

                mData[mirrorIndex]   = _data[index];
                mData[mirrorIndex+1] = _data[index+1];
                mData[mirrorIndex+2] = _data[index+2];
                mData[mirrorIndex+3] = _data[index+3];
            }
        }
       _imageData = mirror;
       this["dispatchEvent"]("Update");
    }

    _filterType = {grayscale:function(mode)
    {
        var r,g,b,
            i,j,index;
        for (i = 0; i < _height; i += 1)
        {
            for (j = 0; j < _width; j += 1)
            {
                index = (j + i * _width) * 4;

                r = _data[index];
                g = _data[index+1];
                b = _data[index+2];

                if(mode === "average")
                {
                    r = g = b = (r+g+b)/3;
                }else if(mode === "lightness")
                {
                    r = g = b = 0.5*(Math.max(r,g,b) + Math.min(r,g,b));
                }else if(mode === "luminosity")
                {
                    r = g = b = 0.21 * r + 0.72 * g + 0.07 * b;
                }else{return}

                _data[index]   = r;
                _data[index+1] = g;
                _data[index+2] = b;
            }
        }
        _self["dispatchEvent"]("Update");
    }};

    this.applyFilter = function(type,mode)
    {
        if(type){_filterType[type](mode)};
    }

    this.updateData = function(value)
    {
        if (value instanceof ImageData)
        {
            _imageData = value;
            _data = _imageData.data;
            _width = _imageData.width;
            _height = _imageData.height;
        }
    }

    this.__defineGetter__("width", function() { return _width; });
    this.__defineGetter__("height", function() { return _height; });

    this.__defineGetter__("imageData", function()
                            {
                                return _imageData;
                            });

    this.__defineSetter__("imageData", function(value)
                            {
                                if (value instanceof ImageData)
                                {
                                    _imageData = value;
                                    _data = _imageData.data;
                                    _width = _imageData.width;
                                    _height = _imageData.height;
                                    this["dispatchEvent"]("Update");
                                }else{throw new Error("Invalid type value is not a imageData object.")}
                            });

    /*initial fill*/
    this.fillRect({x:0,y:0,width:_width,height:_height},fillColor);
}

//import Event class
BitmapData.prototype = new Event();
BitmapData.prototype.constructor = BitmapData;

//static constants
FilterType = Object.create ( Object, {
    GRAYSCALE :{value: "grayscale"},
});

ColorChannel = Object.create ( Object, {
    RED  : {value:1},
    GREEN: {value:2},
    BLUE : {value:4},
    ALPHA: {value:8},
    RG   : {value:3},
    RB   : {value:5},
    GB   : {value:6},
    RGB  : {value:7},
    RGBA : {value:15}
});

/*
 * TODO: implement more flip modes.
 */
FlipMode = Object.create ( Object, {
    HORIZONTAL  :{value: "horizontal"},
    VERTICAL    :{value: "vertical"}
   /*ROTATION90  :{value: "rotation90"},
    ROTATION180 :{value: "rotation180"}*/,
});

/*
 * TODO: implement more grayscale modes.
 */
GrayScaleMode = Object.create ( Object, {
    AVERAGE    :{value: "average"},
    LIGHTNESS  :{value: "lightness"},
    LUMINOSITY :{value: "luminosity"},
});

//Object.defineProperties( window,{"FilterType" : {writable: false, configurable: false}});
//Object.defineProperties( window,{"ColorChannel" : {writable: false, configurable: false}});
//Object.defineProperties( window,{"FlipMode" : {writable: false, configurable: false}});
//Object.defineProperties( window,{"GrayScaleMode" : {writable: false, configurable: false}});