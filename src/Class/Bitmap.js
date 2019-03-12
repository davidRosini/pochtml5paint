/*
 * Bitmap.js by David Rosini.
 * based on Actionscript 3.0 Bitmap class.
 * Version 0.1
 * HTML5 Canvas API implementation to display of Bitmap data on screen.
 */

/**
 * Bitmap Class represent a display of a BitmapData on screen.
 * @param {BitmapData}  bitmapData The BitmapData object being referenced.
 * @return {Bitmap} A new Bitmap object.
 */
function Bitmap(bitmapData)
{
    var _bitmapData = bitmapData instanceof BitmapData?bitmapData:new BitmapData(),
        _x = 0,
        _y = 0,
        _width  = _bitmapData.width,
        _height = _bitmapData.height,

        _canvas = createCanvas(_x,_y,_width,_height),
        _context = _canvas.getContext("2d"),

        //Render modification on bitmap data. 
        update = function(evt)
        {
            _context.putImageData(_bitmapData.imageData,0,0);
        };

    //Clear data from canvas.
    this.clear = function()
    {
        _context.clearRect(0, 0,_width,_height);
    }

    //draw a source image or image data on canvas.
    this.draw = function(source,w,h)
    {
        /*
        * TODO: implement transform;
        */

        w = isFinite(w) ? w : source.width;
        h = isFinite(h) ? h : source.height;

        if (source instanceof Image || source instanceof HTMLCanvasElement)
        {
            _context.drawImage(source, 0, 0, w, h);

        }else if (source instanceof ImageData)
        {
            _context.putImageData(source, 0, 0, w, h);
        }else
        {
           throw new Error("Invalid type of image data.");
        }

        _bitmapData.updateData(_context.getImageData(0,0,_width,_height));
    }

    this.__defineGetter__("canvas", function() { return _canvas; });
    this.__defineGetter__("context", function() { return _context; });

    this.__defineGetter__("bitmapData", function() { return _bitmapData; });
    this.__defineSetter__("bitmapData", function(value)
                                                {
                                                    if(value instanceof BitmapData){
                                                        _bitmapData.removeEventListener("Update",update);
                                                        _bitmapData = value;
                                                        this.width  = _bitmapData.width;
                                                        this.height = _bitmapData.height;
                                                        _bitmapData.addEventListener("Update",update);
                                                        update();
                                                    }else{throw new Error("Object is not a BitmapData instance.")}
                                                });

    this.__defineGetter__("x", function() { return _x; });
    this.__defineSetter__("x", function(value)
                            {
                                if (isFinite(value))
                                {
                                    _x = value;
                                    _canvas.style.left = _x+"px";
                                }else{throw new Error("Invalid value for x.")}
                            });

    this.__defineGetter__("y", function() { return _y; });
    this.__defineSetter__("y", function(value)
                            {
                                if (isFinite(value))
                                {
                                    _y = value;
                                    _canvas.style.top = _y+"px";
                                }else{throw new Error("Invalid value for y.")}
                            });

    this.__defineGetter__("width", function() { return _width; });
    this.__defineSetter__("width", function(value)
                            {
                                if (isFinite(value) && value !== 0)
                                {
                                    _canvas.width = _width = value;
                                }else{throw new Error("Invalid value for width.")}
                            });

    this.__defineGetter__("height", function() { return _height; });
    this.__defineSetter__("height", function(value)
                            {
                                if (isFinite(value) && value !== 0)
                                {
                                    _canvas.height = _height = value;
                                }else{throw new Error("Invalid value for height.")}
                            });

    update();
    _bitmapData.addEventListener("Update",update);
}
Bitmap.prototype.constructor = Bitmap;