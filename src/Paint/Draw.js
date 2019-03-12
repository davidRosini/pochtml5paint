/*
 * Draw.js by David Rosini.
 * Version 0.1
 * HTML5 Canvas API implementation of a drawing tool.
 */

function Draw(width,height)
{
    Event.call(this);

    var self = this,
        drawDisplay,
        offsetDraw,

        fillColor = 0x000000FF,

        toolSelector = "null",
        ctrlTool = false,

        arrStates,limState,currStatePosi,

        eventType,toolType,toolMove,toolUpdateDisplay,toolUpdateoffSet,

        tagA = document.createElement('a');

        this.currentColor = "#000000";

        this.width = width;
        this.height = height;

    //Class start.
    function init()
    {
        drawDisplay = new Bitmap(new BitmapData(self.width,self.height,false));
        offsetDraw = new Bitmap(new BitmapData(self.width,self.height));

        offsetDraw.context.font = '16px sans-serif';
        offsetDraw.context.textBaseline = "top";

        offsetDraw.clear();
        offsetDraw.context.lineWidth = 2;
        offsetDraw.canvas.style.cursor = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAADklEQVQIW2NkgAJGGAMAAC0AA7HLAIQAAAAASUVORK5CYII=) 0 0, crosshair";
        offsetDraw.canvas.addEventListener('mousedown', evtDraw, false);
        offsetDraw.canvas.onselectstart = "return false";

        self.changeColor(self.currentColor);

        arrStates = [];
        limState = 20;
        currStatePosi = 0;

        addChild(Stage,drawDisplay);
        addChild(Stage,offsetDraw);

        saveState();
        document.addEventListener('keypress', evtRestore, false);

        /* file upload */
        document.body.addEventListener('drop' , evtFileUpload , false);
        document.body.addEventListener('dragover', evtdragFX, false);

    }

    function evtdragFX(evt)
    {
        evt.stopPropagation();

        switch(evt.type)
        {
            case 'dragover':
                console.log("copy");
                evt.dataTransfer.dropEffect = 'copy';
                break;
        }
    }

    //Event handler to upload image and draw on canvas.
    function evtFileUpload(evt)
    {
        console.log("upload")
        evt.stopPropagation();

        var file, fReader,img,w,h;

        if(evt.dataTransfer)
        {
            file = evt.dataTransfer.files[0];

        }else if(evt.target.files)
        {
            file = evt.target.files[0];
        }

        if (file.type.match('image.*')) 
        {
            fReader = new FileReader();

            fReader.readAsDataURL(file);

            fReader.onload = function(evt)
            {
                img = new Image();
                img.src = evt.target.result;
                img.onload = function(evt)
                {
                    w = img.width > drawDisplay.canvas.width? drawDisplay.canvas.width : img.width;
                    h = img.height > drawDisplay.canvas.height? drawDisplay.canvas.height : img.height; 

                    drawDisplay.draw(img,w,h);
                    saveState();
                };
            };
        }else{throw new Error("Invalid type of file.");}
    }

    //Mouse event handler.
    function evtDraw(evt)
    {
        evt.stopPropagation();
        evt.preventDefault();

        eventType[evt.type](evt.layerX,evt.layerY);
    }

    //Event handler to draw text on canvas.
    function evtDrawText(evt)
    {
        evt.stopPropagation();
        evt.preventDefault();

        var TF   = evt.target,
            text = TF.value,
            x    = TF.offsetLeft,
            y    = TF.offsetTop;

        TF.onkeypress = null;
        TF.onkeydown  = null;
        TF.removeEventListener('blur',evtDrawText,false);
        TF.removeEventListener('change',evtDrawText,false);

        Stage.removeChild(TF);
        TF = null;

        if (text !== "")
        {
            offsetDraw.context.fillStyle = self.currentColor;
            offsetDraw.context.fillText(text,x,y);
            updateFromOffset();
            offsetDraw.clear();
            offsetDraw.canvas.onselectstart = "return false";
        }
    }

    //update canvas.
    function updateFromOffset()
    {
        drawDisplay.draw(offsetDraw.canvas);
        saveState();
    }

    function updateDisplay()
    {
        drawDisplay.draw(drawDisplay.canvas);
        saveState();
    }
    
    //save data to restore.
    function saveState()
    {
        if (currStatePosi < arrStates.length - 1)
        {
            arrStates = arrStates.slice(0,currStatePosi + 1);
        }

        arrStates.push(drawDisplay.context.getImageData(0,0,drawDisplay.width,drawDisplay.height));

        if (arrStates.length > limState)
        {
            arrStates.shift();
        }

        currStatePosi = arrStates.length - 1;
    }

    //Restore saved data.
    function evtRestore(evt)
    {
        evt.stopPropagation();

        if (evt.keyCode === 25 || evt.keyCode === 26)
        {
            evt.preventDefault();

            self.restore(evt.keyCode);
        }
    }

    //Objects with config for function behavior.
    toolUpdateoffSet  = {pencil:true,line:true,rect:true,ellipse:true};
    toolUpdateDisplay = {eraser:true};

    toolMove = {eraser:true,pencil:true,line:true,rect:true,ellipse:true};

    //Objects that contains types of mouse event function.
    eventType = {
        mousedown:function(x,y)
        {
            if (toolType[toolSelector])
            {
                offsetDraw.canvas.removeEventListener('mousedown', evtDraw, false);
                offsetDraw.canvas.addEventListener('mouseup', evtDraw, false);
                offsetDraw.canvas.addEventListener('mouseout', evtDraw, false);

                if (toolMove[toolSelector])
                {
                    offsetDraw.canvas.addEventListener('mousemove', evtDraw, false);
                }

                toolType[toolSelector](x,y);
            }
        },

        mousemove:function(x,y)
        {
            toolType[toolSelector](x,y);
        },
        
        mouseup:function(x,y)
        {
            this.evtEnd(x,y);
        },

        mouseout:function(x,y)
        {
            this.evtEnd(x,y);
        },

        evtEnd:function(x,y)
        {
            ctrlTool = false;
            if(toolUpdateoffSet[toolSelector]){updateFromOffset();}
            if(toolUpdateDisplay[toolSelector]){updateDisplay();}

            offsetDraw.clear();

            offsetDraw.canvas.addEventListener('mousedown', evtDraw, false);
            offsetDraw.canvas.removeEventListener('mousemove', evtDraw, false);
            offsetDraw.canvas.removeEventListener('mouseup', evtDraw, false);
            offsetDraw.canvas.removeEventListener('mouseout', evtDraw, false);
        }
    };

    //Object that contains each tool function.
    toolType = {
        startX:0,
        startY:0,
        pencil:function(x,y)
        {
            if(!ctrlTool)
            {
                ctrlTool = true;
                offsetDraw.context.beginPath();
                offsetDraw.context.moveTo(x, y);
            }else
            {
                offsetDraw.context.lineTo(x,y);
                offsetDraw.context.stroke();
            }
        },

        line:function(x,y)
        {
            if(!ctrlTool)
            {
                ctrlTool = true;
                this.startX = x;
                this.startY = y;
            }else
            {
                offsetDraw.clear();
                offsetDraw.context.beginPath();
                offsetDraw.context.moveTo(this.startX, this.startY);
                offsetDraw.context.lineTo(x, y);
                offsetDraw.context.stroke();
                offsetDraw.context.closePath();
            }
        },

        rect:function(x,y)
        {
            if(!ctrlTool)
            {
                ctrlTool = true;
                this.startX = x;
                this.startY = y;
            }else
            {
                var offX = Math.min(x, this.startX),
                    offY = Math.min(y, this.startY),
                    w = Math.abs(x - this.startX),
                    h = Math.abs(y - this.startY);

                offsetDraw.clear();
                offsetDraw.context.strokeRect(offX, offY, w, h);
            }
        },

        ellipse:function(x,y)
        {
            if(!ctrlTool)
            {
                ctrlTool = true;
                this.startX = x;
                this.startY = y;
            }else
            {
                var centerX = Math.min(x, this.startX),
                    centerY = Math.min(y, this.startY),
                    w = Math.abs(x - this.startX),
                    h = Math.abs(y - this.startY);

                    centerX = centerX + w/2;
                    centerY = centerY + h/2;

                offsetDraw.clear();
                offsetDraw.context.beginPath();
                offsetDraw.context.moveTo(centerX, centerY - h/2); // A1

                offsetDraw.context.bezierCurveTo(
                centerX + w/2, centerY - h/2, // C1
                centerX + w/2, centerY + h/2, // C2
                centerX, centerY + h/2); // A2

                offsetDraw.context.bezierCurveTo(
                centerX - w/2, centerY + h/2, // C3
                centerX - w/2, centerY - h/2, // C4
                centerX, centerY - h/2); // A1

                offsetDraw.context.stroke();
                offsetDraw.context.closePath();
            }
        },

        paintBucket:function(x,y)
        {
            if(!ctrlTool)
            {
                ctrlTool = true;
                drawDisplay.bitmapData.floodFill(x,y,fillColor);
                saveState();
            }
        },

        eraser:function(x,y)
        {
            if(!ctrlTool)
            {
                ctrlTool = true;
                drawDisplay.context.fillStyle = "#FFFFFF";
            }else
            {
                offsetDraw.clear();
                offsetDraw.context.strokeRect(x-20/2, y-20/2, 20, 20);
                drawDisplay.context.fillRect(x-20/2, y-20/2, 20, 20);
            }
        },

        text:function(x,y)
        {
            if(!ctrlTool)
            {
                var TF;

                ctrlTool = true;

                TF = document.createElement('input');

                Stage.appendChild(TF);

                TF.id = "TF";
                TF.type = "text";

                TF.style.position = "absolute";
                TF.style.left = x + "px";
                TF.style.top = y + "px";
                TF.style.color = self.currentColor;
                TF.value = "";

                setTimeout(function()
                {
                    TF.focus();
                    TF.addEventListener('blur',evtDrawText,false);
                    TF.addEventListener('change',evtDrawText,false);
                },10);
            }
        },

        eyeDropper:function(x,y)
        {
            if(!ctrlTool)
            {
                ctrlTool = true;
                self.changeColor("#"+self.formatRGBAToHex(drawDisplay.bitmapData.getPixel(x,y)).substr(0,6));
                self["dispatchEvent"]("changeDisplayColor");
            }
        }
    };

    /*Public functions*/

    //Function that restore canvas data to a old state. 
    this.restore = function(action)
    {
        if(action === 25 || action === "redo")
        {
            if (currStatePosi === arrStates.length - 1)
            {
                return;
            }
            //redo ctrl+y;
            currStatePosi++;
        }else if(action === 26 || action === "undo")
        {
            if (currStatePosi === 0)
            {
                return;
            }
            //undo ctrl+z;
            currStatePosi--;
        }

        drawDisplay.bitmapData.imageData = arrStates[currStatePosi];
    }

    //save canvas data to file image.
    this.saveImage = function(type)
    {
        var strData = drawDisplay.canvas.toDataURL("image/png");

        strData = strData.replace("image/png","image/octet-stream");

        tagA.download = "image.png";
        tagA.href = strData;
        tagA.click();
    }

    //Event to change do selected tool.
    this.evtChangeTool = function(type)
    {
        toolSelector = type;
    }

    //Event to change the selected color.
    this.changeColor = function(color)
    {
        this.currentColor = color.toUpperCase();

        drawDisplay.context.strokeStyle = this.currentColor;
        drawDisplay.context.fillStyle = this.currentColor;

        offsetDraw.context.strokeStyle = this.currentColor;
        offsetDraw.context.fillStyle = this.currentColor;

        fillColor = eval("0x"+color.split("#").join("")+"FF");
    }

    /**
     * convert a number to a hex string
     * containing the formart of FFFFFFFF.
     * @param  {int}     RGBA a unsigned integer.
     * @return {String}  return a string in the format of hex FFFFFFFF.
     */
    this.formatRGBAToHex = function(RGBA)
    {
        if (isNaN(RGBA)){throw new Error("Parameter is not a valid number.")}

        var hexStr = "",
            r = RGBA >>> 24 & 0xFF,
            g = RGBA >> 16 & 0xFF,
            b = RGBA >> 8 & 0xFF,
            a = RGBA & 0xFF;

        hexStr += r.toString(16).toUpperCase();
        if (hexStr.length < 2){ hexStr += "0"};
        hexStr += g.toString(16).toUpperCase();
        if (hexStr.length < 4){ hexStr += "0"};
        hexStr += b.toString(16).toUpperCase();
        if (hexStr.length < 6){ hexStr += "0"};
        hexStr += a.toString(16).toUpperCase();
        if (hexStr.length < 8){ hexStr += "0"};

        return hexStr;
    }

    //initialize
    init();
}

//import Event class
Draw.prototype = new Event();
Draw.prototype.constructor = Draw;