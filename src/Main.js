function Main()
{
    function init()
    {
        new CPanel();
    }

    function startRender()
    {
        requestAnimationFrame(render);
    }

    function stopRender()
    {
        cancelAnimationFrame(render);
    }

    function render()
    {
        requestAnimationFrame(render);
    }

    init();
}