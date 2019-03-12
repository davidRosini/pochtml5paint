/*
 * OffSetCanvas.js by David Rosini.
 * Version 0.1
 * Static class Auxiliar of BitmapData to create and manipulate image data.
 */

/**
 * Static class utils to manipulate image data.
 * The canvas of this class is not displayed, 
 * it only serve as a backgroud canvas to get image data
 * from a loaded source image.
 * As default the width and height is set to size of the main canvas.
 * If the loaded source image exceeds the current size of this canvas, 
 * then will be set the canvas size to the current loaded source image size.
 */
OffSetCanvas = new function()
{
    var _width = stageWidth,
        _height = stageHeight,

        _canvas = document.createElement('canvas'),
        _context = _canvas.getContext("2d");

    _canvas.setAttribute("width",_width);
    _canvas.setAttribute("height",_height);

    this.getDatafromSource = function(value)
    {
        if (value.width > _width){ this.width = value.width; }
        if (value.height > _height){ this.height = value.height; }

        _context.clearRect(0, 0,_width,_height);

        if (value instanceof Image || value instanceof HTMLCanvasElement)
        {
            _context.drawImage(value, 0, 0);
        }else if (value instanceof ImageData)
        {
            _context.putImageData(value, 0, 0);
        }else
        {
           throw new Error("Invalid type of image data.");
        }

        return _context.getImageData(0,0,value.width,value.height);
    }

    this.clear = function()
    {
        _context.clearRect(0, 0,_width,_height);
    }

    this.__defineGetter__("canvas", function() { return _canvas; });
    this.__defineGetter__("context", function() { return _context; });

    this.__defineGetter__("width", function()
                            {
                                return _width;
                            });

    this.__defineSetter__("width", function(value)
                            {
                                if (value != undefined)
                                    _canvas.width = _width = value;
                                else{throw new Error("Invalid width value.")}
                            });

    this.__defineGetter__("height", function()
                            {
                                return _height;
                            });

    this.__defineSetter__("height", function(value)
                            {
                                if (value != undefined)
                                    _canvas.height = _height = value;
                                else{throw new Error("Invalid height value.")}
                            });
}
//Object.defineProperties( window,{"OffSetCanvas" :  {writable: false, configurable: false}});