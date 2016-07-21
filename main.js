(function(window) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var width = canvas.width = window.innerWidth;
    var height = canvas.height = window.innerHeight;

    var ballRadius = 40;
    var minRadius = ballRadius * 0.8;
    var drawRadius = ballRadius;
    var isDragging = false;
    var dragEnd = false;

    var isEscape = false;
    var distance = 0;
    var x1, x2, x3, x4, y1, y2, y3 ,y4;
    var cx1, cx2, cy1, cy2;
    var angle = 0;

    var showLine = false;

    var tween = null;
    var bounceTime = 600;
    var bounceTimer = null;

    var centerPos = {
        x: width * 0.5,
        y: height * 0.5
    };
    var mousePos = {
        x: width * 0.5,
        y: height * 0.5
    };

    function drawBall() {
        ctx.beginPath();
        ctx.arc(centerPos.x, centerPos.y, drawRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#ea6d9e';
        ctx.fill();
    }
    function drawDragBall() {
        if (!dragEnd) {
            ctx.beginPath();
            ctx.arc(mousePos.x, mousePos.y, drawRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#ea6d9e';
            ctx.fill();
        }
    }
    function drawLine() {
        // if (isDragging) {

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x3, y3);

            ctx.moveTo(x2, y2);
            ctx.lineTo(x4, y4);
            ctx.strokeStyle = '#444';
            ctx.stroke();
        // }
    }
    function drawBezier() {
        // && !isEscape
        if (!dragEnd) {
            ctx.beginPath();
            ctx.moveTo(x1,y1);
            ctx.quadraticCurveTo(cx1, cy1, x3,y3);
            ctx.lineTo(x4,y4);
            ctx.quadraticCurveTo(cx2, cy2, x2,y2);
            ctx.lineTo(x1,y1);
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

        tween && tween.stop();

        mousePos.x = event.touches[0].pageX;
        mousePos.y = event.touches[0].pageY;
        distance = Math.sqrt(Math.pow((mousePos.x - centerPos.x), 2) +
            Math.pow((mousePos.y - centerPos.y),2));
        if (distance < ballRadius) {
            dragEnd = false;
            isDragging = true;
        }
    }
    function touchmove(event) {

        if (isDragging) {
            event.preventDefault();
            mousePos.x = event.touches[0].pageX;
            mousePos.y = event.touches[0].pageY;

            calDistance();

            if (mousePos.x <= 0 || mousePos.y <= 0 || mousePos.x >= width || mousePos.y >= height) {
                touchend();
            }
        }


    }
    function touchend() {
        isDragging = false;

        // 选择缓动函数
        var bounce_animate_type = TWEEN.Easing.Elastic.Out;

        // 调用Tween.js，声明开始和结束位置。
        tween = new TWEEN.Tween(mousePos)
            .to(centerPos, bounceTime)
            .easing(bounce_animate_type)
            .onUpdate(function() {
                calDistance();
            })
            .onComplete(function() {
                dragEnd = true;
                cancelAnimationFrame(bounceTimer);
            })
            .start();
        bounce();
    }
    function bounce(time) {
        // drawRadius = ballRadius;
        bounceTimer = requestAnimationFrame(bounce);
        TWEEN.update(time);
    }
    function calDistance() {
        distance = Math.sqrt(Math.pow((mousePos.x - centerPos.x), 2) +
            Math.pow((mousePos.y - centerPos.y),2));
    }
    function changeSize() {
        // if (distance < ballRadius + 500) {
        //     var rate = (1 - distance / ballRadius * 0.5);
        //     isEscape = false;
        //     drawRadius = ballRadius * rate;
        // } else{
        //     isEscape = true;
        // }

        var rate = (1 - distance / ballRadius * 0.5);
        isEscape = false;
        drawRadius = ballRadius * rate;
        if (drawRadius < minRadius) {
            drawRadius = minRadius;
        }
    }
    function addEventListener() {
        canvas.addEventListener('touchstart', touchstart);
        canvas.addEventListener('touchmove', touchmove);
        canvas.addEventListener('touchend', touchend);
    }
    function calPos() {
        cx1 = (x1 + x4) / 2;
        cy1 = (y1 + y4) / 2;
        cx2 = (x2 + x3) / 2;
        cy2 = (y2 + y3) / 2;


        angle = Math.atan((centerPos.x - mousePos.x)/(centerPos.y - mousePos.y));

        var y = drawRadius * Math.sin(angle);
        var x = Math.sqrt(Math.pow(drawRadius, 2) - Math.pow(y, 2));

        y1 = centerPos.y - y;
        x1 = centerPos.x + x;

        y2 = centerPos.y + y;
        x2 = centerPos.x - x;

        y3 = mousePos.y - y;
        x3 = mousePos.x + x;

        y4 = mousePos.y + y;
        x4 = mousePos.x - x;
    }
    function loop() {
        ctx.clearRect(0, 0, width, height);
        calPos();
        changeSize();
        drawBall();
        drawDragBall();
        if (document.getElementById('checkbox').checked) {
            drawLine();
        }
        drawBezier();
        requestAnimationFrame(loop);
    }
    init();
})(window);
