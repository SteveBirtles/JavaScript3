let w = 0, h = 0;
const ballImage = new Image();

let balls = [];

function fixSize() {
    w = window.innerWidth;
    h = window.innerHeight;
    const canvas = document.getElementById('ballCanvas');
    canvas.width = w;
    canvas.height = h;
}

let lastTimestamp = 0;
let mousePosition = {x: 0, y: 0}, leftMouseDown = false, rightMouseDown = false;

function pageLoad() {

    window.addEventListener("resize", fixSize);
    fixSize();

    ballImage.src = "ball.png";
    ballImage.onload = () =>window.requestAnimationFrame(redraw);

    for (let i = 0; i < 50; i++) {
        let x = Math.random() * w;
        let y = Math.random() * h;
        let dx = Math.random() * 100 - 50;
        let dy = Math.random() * 100 - 50;
        let r = Math.random() * 10 + 5;
        balls.push({x, y, dx, dy, r});
    }

    const canvas = document.getElementById('ballCanvas');

    canvas.addEventListener('mousemove', event => {
        mousePosition.x = event.clientX;
        mousePosition.y = event.clientY;
    }, false);

    canvas.addEventListener('mousedown', event => {
        if (event.button === 0) {
            leftMouseDown = true;
        } else {
            rightMouseDown = true;
        }
    }, false);

    canvas.addEventListener('mouseup', event => {
        if (event.button === 0) {
            leftMouseDown = false;
        } else {
            rightMouseDown = false;
        }
    }, false);

    canvas.oncontextmenu = function (e) {
        e.preventDefault();
    };

}

function redraw(timestamp) {

    const canvas = document.getElementById('ballCanvas');
    const context = canvas.getContext('2d');

    context.fillStyle = '#000088';
    context.fillRect(0, 0, w, h);

    if (lastTimestamp === 0) lastTimestamp = timestamp;
    const frameLength = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    function separation(b1, b2) {
        return Math.sqrt(Math.pow(b1.x - b2.x, 2) + Math.pow(b1.y - b2.y, 2));
    }

    let attraction = 0;
    if (leftMouseDown) {
        attraction = 100;
    } else if (rightMouseDown) {
        attraction = -100;
    } else {
        attraction = 0;
    }

    for (let b of balls) {

        const dSquared = separation(b, mousePosition);

        b.dx += attraction * (b.x - mousePosition.x) / dSquared;
        b.dy += attraction * (b.y - mousePosition.y) / dSquared;

    }

    for (let i = 1; i < balls.length; i++) {
        for (let j = 0; j < i; j++) {

            const b1 = balls[i];
            const b2 = balls[j];

            const s = separation(b1, b2);
            const overlap = b1.r + b2.r - s;

            if (overlap > 0) {

                const unitX = (b1.x - b2.x) / s;
                const unitY = (b1.y - b2.y) / s;

                b1.x += unitX * overlap / 2;
                b1.y += unitY * overlap / 2;
                b2.x -= unitX * overlap / 2;
                b2.y -= unitY * overlap / 2;

                const dotProduct1 = b1.dx * unitX + b1.dy * unitY;
                const dotProduct2 = b2.dx * unitX + b2.dy * unitY;

                b1.dx -= unitX * dotProduct1;
                b1.dy -= unitY * dotProduct1;
                b2.dx -= unitX * dotProduct2;
                b2.dy -= unitY * dotProduct2;

            }
        }
    }

    for (let b of balls) {

        b.x += b.dx * frameLength;
        b.y += b.dy * frameLength;

        if (b.x < b.r && b.dx < 0) {
            b.x = b.r;
            b.dx = 0;
        }
        if (b.y < b.r && b.dy < 0) {
            b.y = b.r;
            b.dy = 0;
        }
        if (b.x > w-b.r && b.dx > 0) {
            b.x = w-b.r;
            b.dx = 0;
        }
        if (b.y > h-b.r && b.dy > 0) {
            b.y = h-b.r;
            b.dy = 0;
        }

    }

    for (let ball of balls) {
        context.drawImage(ballImage, 0,0, ballImage.width, ballImage.height, ball.x-ball.r, ball.y-ball.r, ball.r*2, ball.r*2);
    }

    window.requestAnimationFrame(redraw);

}
