//Main canvas definition
/*stageWidth = 1024;
stageHeight = 768;
zIndex = 0;

Stage = createDiv("Scene1",0,0,stageWidth,stageHeight,"hidden");
addChild(document.body,Stage);*/

Stage = document.getElementById('Content');

stageWidth = Stage.offsetWidth;
stageHeight = Stage.offsetHeight;
stageX = Stage.offsetLeft;
stageY = Stage.offsetTop;
zIndex = 0;