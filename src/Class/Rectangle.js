/*
 * Rectangle.js by David Rosini.
 * based on Actionscript 3.0 Rectangle class.
 * Version 0.1
 * 
 * A Rectangle object is an area defined by its position,
 * as indicated by its top-left corner point (x, y) and by its width and its height.
 */

/**
 * Creates a new Rectangle object with the top-left corner specified by
 * the x and y parameters and with the specified width and height parameters.
 * If you call this function without parameters,
 * a rectangle with x and y set to 0 and width and height set to 1 is created.
 * 
 * @param  {Int}  x        The x coordinate of the top-left corner of the rectangle.
 * @param  {Int}  y        The y coordinate of the top-left corner of the rectangle.
 * @param  {Int}  width    The width of the rectangle, in pixels.
 * @param  {Int}  height   The height of the rectangle, in pixels.
 * @return {Rectangle}     A new Rectangle object.
 */
function Rectangle(x,y,width,height)
{
    this.x = isFinite(x)? x : 0;
    this.y = isFinite(y)? y : 0;

    this.width = isFinite(width) && width !== 0 ? width : 1;
    this.height = isFinite(height) && height !== 0 ? height : 1;

    /**
     * Returns a new Rectangle object with the same values for the x, y, 
     * width, and height properties as the original Rectangle object.
     * @return {Rectangle}  A new Rectangle object with the same values for the x, y, 
     *                      width, and height properties as the original Rectangle object.
     */
    this.clone = function()
    {
        return new Rectangle(this.x,this.y,this.width,this.height);
    }
}
Rectangle.constructor = Rectangle;