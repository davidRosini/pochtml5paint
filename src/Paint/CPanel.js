/*
 * CPanel.js by David Rosini.
 * Version 0.1
 * Control panel to assist draw class and handler button events.
 */

function CPanel()
{
    var drawingTool,
        colorPallet,
        buttonPanel,buttonList,buttonState,
        sTool,
        cPanel;

    //Class start.
    function init()
    {
        drawingTool = new Draw(stageWidth,stageHeight);
        drawingTool.addEventListener("changeDisplayColor",evtChangeDisplayColor);

        cPanel = document.getElementById('CPanel');

        colorPallet = createInput("colorPallet",10,10,"color","relative");
        colorPallet.style.cssFloat = "left";
        colorPallet.addEventListener('change',evtChangeColor, false);

        createButtonPanel();

        addChild(cPanel,colorPallet);
        addChild(cPanel,buttonPanel);
    }

    //Create and configurate buttons on the panel.
    function createButtonPanel()
    {
        var btn;

        buttonPanel = createDiv("BPanel",20,2.5,23*7,22*2,"relative");
        buttonPanel.style.cssFloat = "left";

        buttonList = { pencil:     {btnRef:undefined,selState:false,x:"0px"  , y:"0px" ,backPosXN:"0px"   ,backPosXC:"-115px"},
                       paintBucket:{btnRef:undefined,selState:false,x:"23px" , y:"0px" ,backPosXN:"-23px" ,backPosXC:"-138px"},
                       eraser:     {btnRef:undefined,selState:false,x:"46px" , y:"0px" ,backPosXN:"-46px" ,backPosXC:"-161px"},
                       text:       {btnRef:undefined,selState:false,x:"0px"  , y:"22px",backPosXN:"-69px" ,backPosXC:"-184px"},
                       eyeDropper: {btnRef:undefined,selState:false,x:"23px" , y:"22px",backPosXN:"-92px" ,backPosXC:"-207px"},
                       line:       {btnRef:undefined,selState:false,x:"92px" , y:"0px" ,backPosXN:"-230px",backPosXC:"-253px"},
                       rect:       {btnRef:undefined,selState:false,x:"115px", y:"0px" ,backPosXN:"-276px",backPosXC:"-299px"},
                       ellipse:    {btnRef:undefined,selState:false,x:"138px", y:"0px" ,backPosXN:"-322px",backPosXC:"-345px"},

                       undo:       {btnRef:undefined,selState:undefined,x:"92px" , y:"22px",backPosXN:"-368px",backPosXC:"-368px", callFunc:drawingTool.restore},
                       redo:       {btnRef:undefined,selState:undefined,x:"115px", y:"22px",backPosXN:"-391px",backPosXC:"-391px", callFunc:drawingTool.restore},
                       save:       {btnRef:undefined,selState:undefined,x:"138px", y:"22px",backPosXN:"-414px",backPosXC:"-414px", callFunc:drawingTool.saveImage}};

        for(i in buttonList)
        {
            btn = document.createElement('div');
            btn.id = i;
            btn.className = 'Pbtn';

            btn.style.left = buttonList[i].x;
            btn.style.top = buttonList[i].y;
            btn.style.backgroundPosition = buttonList[i].backPosXN  + " 0px";

            buttonList[i].btnRef = btn;

            buttonPanel.appendChild(btn);

            btn.addEventListener('mouseover',evtBtnHandler,false);
            btn.addEventListener('mouseout',evtBtnHandler,false);
            btn.addEventListener('click',evtclickHandler,false);
        }

        buttonList["pencil"].btnRef.click();
    }

    //Mouse event handler.
    function evtBtnHandler(evt)
    {
        evt.stopPropagation();
        evt.preventDefault();

        var posX = buttonList[this.id].selState? buttonList[this.id].backPosXC : buttonList[this.id].backPosXN;

        if (evt.type === "mouseover")
        {
            this.style.backgroundPosition = posX + " -22px";
        }else if (evt.type === "mouseout")
        {
            this.style.backgroundPosition = posX + " 0px";
        }
    }

    function evtclickHandler(evt)
    {
        evt.stopPropagation();
        evt.preventDefault();

        var type,
            targetName,
            btnTarget;

        type = evt.type;
        btnTarget = evt.target;
        targetName = btnTarget.id;

        if(type === "click")
        {
            if (buttonList[targetName].selState !== undefined)
            {
                for(i in buttonList)
                {
                    if (buttonList[i].selState === true)
                    {
                        buttonList[i].selState = false;
                        buttonList[i].btnRef.style.backgroundPosition = buttonList[i].backPosXN + " 0px";
                    }
                }

                buttonList[targetName].selState = true;
                drawingTool.evtChangeTool(targetName);
            }else
            {
                buttonList[targetName].callFunc(targetName);
            }

            btnTarget.style.backgroundPosition = buttonList[targetName].backPosXC + " 0px";
        }
    }

    //Event handler to change color on draw class.
    function evtChangeColor(evt)
    {
        evt.stopPropagation();
        evt.preventDefault();

        drawingTool.changeColor(this.value);
    }

    //Event handler to change color on the display palette.
    function evtChangeDisplayColor(evt)
    {
        colorPallet.value = this.currentColor;
    }

    //initialize
    init();
}