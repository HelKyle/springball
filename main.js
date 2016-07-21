(function(window) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var width = canvas.width = window.innerWidth;
    var height = canvas.height = window.innerHeight;
    var ballRadius = 60;
    var drawRadius = ballRadius;
    var isDragging = false;
    var distance = 0;

    var mousePos = {
        x: width * 0.5,
        y: height * 0.5
    };

    function drawBall() {
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.5, drawRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#ea6d9e';
        ctx.fill();
    }
    function drawDragBall() {
        if (isDragging) {
            ctx.beginPath();
            ctx.arc(mousePos.x, mousePos.y, drawRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#ea6d9e';
            ctx.fill();
        }
    }
    function init() {
        addEventListener();
        requestAnimationFrame(loop);
    }

    function touchstart(event) {
        event.preventDefault();

        isDragging = true;

        mousePos.x = event.touches[0].pageX;
        mousePos.y = event.touches[0].pageY;

        distance = Math.sqrt(Math.pow(mousePos.x - width * 0.5) +
            Math.pow(mousePos.y - height * 0.5));
    }
    function touchmove(event) {
        event.preventDefault();
        mousePos.x = event.touches[0].pageX;
        mousePos.y = event.touches[0].pageY;

        distance = Math.sqrt(Math.pow(mousePos.x - width * 0.5) +
            Math.pow(mousePos.y - height * 0.5));
    }
    function touchend() {
        isDragging = false;
        release();
    }
    function release() {
        drawRadius = ballRadius;
    }
    function checkDistance() {
        console.log(distance);
        if (distance < ballRadius) {
            drawRadius = ballRadius * (1 - distance / ballRadius * 0.5);
        }
    }
    function addEventListener() {
        window.addEventListener('touchstart', touchstart);
        window.addEventListener('touchmove', touchmove);
        window.addEventListener('touchend', touchend);
    }
    function loop() {
        ctx.clearRect(0, 0, width, height);
        checkDistance();
        drawBall();
        drawDragBall();
        requestAnimationFrame(loop);
    }
    init();
})(window);
