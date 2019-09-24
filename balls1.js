let w = 0, h = 0;
const ballImage = new Image();

const gravity = 10;

class Ball {
    constructor (x, y, dx, dy, r) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.r = r;
        this.mass = Math.pow(r, 2);
    }
    velocity() {
        return Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2));
    }
    static seperation(b1, b2) {
        return Math.sqrt(Math.pow(b1.x - b2.x, 2) + Math.pow(b1.y - b2.y, 2));
    }
}

let balls = [];

function fixSize() {
    w = window.innerWidth;
    h = window.innerHeight;
    const canvas = document.getElementById('ballCanvas');
    canvas.width = w;
    canvas.height = h;
}

let lastTimestamp = 0, fps = 0, fpsTimestamp = -1, frames = 0;
let mousePosition = {x: 0, y: 0}, leftMouseDown = false, rightMouseDown = false;

function processFrameRate(timestamp) {

    const frameLength = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    if (fpsTimestamp === -1) fpsTimestamp = timestamp;

    if (timestamp - fpsTimestamp > 1000) {
        fps = frames;
        frames = 0;
        fpsTimestamp += 1000
        window.top.document.title = "Bouncing Ball Demo (" + fps + " FPS)";
    }
    frames++;

    return frameLength;

}

function pageLoad() {

    window.addEventListener("resize", fixSize);
    fixSize();

    ballImage.src = "ball1.png";

    for (let i = 0; i < 5000; i++) {
        let x = Math.random() * w;
        let y = Math.random() * h;
        let dx = Math.random() * 100 - 50;
        let dy = Math.random() * 100 - 50;
        let r = Math.random() * 3 + 2;
        let mass = Math.pow(r, 2);
        balls.push(new Ball(x, y, dx, dy, r));
    }

    window.requestAnimationFrame(redraw);

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

    const frameLength = processFrameRate(timestamp)

    let attraction = 0;
    if (leftMouseDown) {
        attraction = 100;
    } else if (rightMouseDown) {
        attraction = -100;
    } else {
        attraction = 0;
    }

    for (let b of balls) {

        const dSquared = Ball.seperation(b, mousePosition);

        b.dx += attraction * (b.x - mousePosition.x) / dSquared;
        b.dy += attraction * (b.y - mousePosition.y) / dSquared + gravity;

    }

    for (let i = 1; i < balls.length; i++) {
        for (let j = 0; j < i; j++) {

            const b1 = balls[i];
            const b2 = balls[j];

            const s = Ball.seperation(b1, b2);
            const overlap = b1.r + b2.r - s;

            if (overlap > 0) {

                const unitX = (b1.x - b2.x) / s;
                const unitY = (b1.y - b2.y) / s;

                b1.x += unitX * overlap / 2;
                b1.y += unitY * overlap / 2;
                b2.x -= unitX * overlap / 2;
                b2.y -= unitY * overlap / 2;

                const u1 = b1.velocity();
                const u2 = b2.velocity();

                const m1 = b1.mass;
                const m2 = b1.mass;

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
