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
    function drawLine() {
        if (isDragging) {
            var angle = Math.atan((width * 0.5 - mousePos.x)/(height * 0.5 - mousePos.y));

            var y = drawRadius * Math.sin(angle);
            var x = Math.sqrt(Math.pow(drawRadius, 2) - Math.pow(y, 2));

            var y1 = height * 0.5 + y;
            var x1 = width * 0.5 + x;

            var y2 = height * 0.5 - y;
            var x2 = width * 0.5 - x;

            var y3 = mousePos.y + y;
            var x3 = mousePos.x + x;

            var y4 = mousePos.y - y;
            var x4 = mousePos.x - x;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x3, y3);

            ctx.moveTo(x2, y2);
            ctx.lineTo(x4, y4);
            ctx.strokeStyle = '#444';
            ctx.stroke();
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
        distance = Math.sqrt(Math.pow((mousePos.x - width * 0.5), 2) +
            Math.pow((mousePos.y - height * 0.5),2));
    }
    function touchmove(event) {
        event.preventDefault();
        mousePos.x = event.touches[0].pageX;
        mousePos.y = event.touches[0].pageY;

        distance = Math.sqrt(Math.pow((mousePos.x - width * 0.5), 2) +
            Math.pow((mousePos.y - height * 0.5),2));
    }
    function touchend() {
        isDragging = false;
        release();
    }
    function release() {
        drawRadius = ballRadius;
    }
    function changeDistance() {
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
        changeDistance();
        drawBall();
        drawDragBall();
        drawLine();
        requestAnimationFrame(loop);
    }
    init();
})(window);
