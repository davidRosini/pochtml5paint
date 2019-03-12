/*--Utils--*/

/*
 * TODO: improve functions;
 */

/**
 * create a HTML div element and set them on body. 
 * @param {String} name     Id of the HTML div element.
 * @param {Int} x           The x position on screen.
 * @param {Int} y           The y position on screen.
 * @param {Int} width       The width of the visible area of div.
 * @param {Int} height      The height of the visible area of div.
 * @return {HTMLDivElement} return the reference of the div element created.
 */
function createDiv(id,x,y,width,height,position,overflow)
{
    var div = document.createElement('div');

    id = id ? id : "Scene"+parseInt(Math.random()*999999 + 2);
    x = isFinite(x) && (x > -1) ? x+"px" : "0px";
    y = isFinite(y) && (y > -1) ? y+"px" : "0px";
    width  = isFinite(width) ? width+"px" : "1px";
    height = isFinite(height) ? height+"px": "1px";
    position = position?position:"absolute";
    overflow = overflow?overflow:"auto";

    div.id = id;
    div.style.position = position;
    div.style.left = x;
    div.style.top = y;
    div.style.width = width;
    div.style.height = height;
    div.style.overflow = overflow;

    return div;
}

/**
 * create a HTML canvas element.
 * @param {Int} x      initial x position on screen.
 * @param {Int} y      initial y position on screen.
 * @param {Int} width  initial width of the canvas.
 * @param {Int} height initial height of the canvas.
 * @return {HTMLCanvasElement} return the reference of HTML canvas element created.
 */
function createCanvas(x,y,width,height)
{
    x = isFinite(x) && (x > -1) ? x+"px" : "0px";
    y = isFinite(y) && (y > -1) ? y+"px" : "0px";
    width  = isFinite(width)  && (width  > 0) ? String(width) : "1";
    height = isFinite(height) && (height > 0) ? String(height): "1";

    var canvas = document.createElement('canvas');

    canvas.style.position = "absolute";

    canvas.width = width;
    canvas.height = height;
    canvas.style.left = x;
    canvas.style.top = y;

    return canvas;
}

/*
 * TODO: improve function;
 */
function createInput(id,x,y,type,position)
{
    id = id ? id : "input"+parseInt(Math.random()*999999 + 2);
    x = isFinite(x) && (x > -1)? x+"px" : "0px";
    y = isFinite(y) && (y > -1)? y+"px" : "0px";
    type = type ? type : "text";
    position = position ? position : "absolute";

    var input = document.createElement('input');
    input.id = id;
    input.type = type;

    input.style.position = position;
    input.style.left = x;
    input.style.top = y;
    
    return input;
}

/**
 * add HTML element.
 * @param {HTMLelemnt} child
 * @param {HTMLelemnt} child
 */
function addChild(element,child)
{
    if (element instanceof HTMLElement)
    {
        if (child)
        {
            if (child instanceof HTMLElement)
            { 
                element.appendChild(child);
            }else
            {
                child = child.canvas;
                element.appendChild(child);
            }

            child.style.zIndex = zIndex.toString();
            zIndex++;
        }else{throw new Error("Invalid child parameter.")}
    }else{throw new Error("Invalid element parameter.")}
}

/**
 * remove a HTML element.
 * @param {HTMLelemnt} child
 * @param {HTMLelemnt} child
 */
function removeChild(element,child)
{
   if (element instanceof HTMLElement)
    {
        if (child)
        {
            if (child instanceof HTMLElement)
            { 
                element.removeChild(child);
            }else
            {
                element.removeChild(child.canvas);
            }
        }
        zIndex--;
    }else{throw new Error("Invalid parameter.")}
}