let w = 0, h = 0;
const ballImage = new Image();

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
    momentum() {
        return this.velocity() * this.mass;
    }
    static seperation(b1, b2) {
        return Math.sqrt(Math.pow(b1.x - b2.x, 2) + Math.pow(b1.y - b2.y, 2));
    }
}

let balls = [];
let restitution = 0.75;

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

    for (let i = 0; i < 100; i++) {
        let x = Math.random() * w;
        let y = Math.random() * h;
        let dx = Math.random() * 100 - 50;
        let dy = Math.random() * 100 - 50;
        let r = Math.random() * 30 + 10;
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
        attraction = 10;
    } else if (rightMouseDown) {
        attraction = -10;
    } else {
        attraction = 0;
    }

    for (let b of balls) {

        const dSquared = Math.sqrt(Math.pow(b.x - mousePosition.x, 2) + Math.pow(b.y - mousePosition.y, 2));

        b.dx += attraction * (b.x - mousePosition.x) / dSquared;
        b.dy += attraction * (b.y - mousePosition.y) / dSquared;

        b.x += b.dx * frameLength;
        b.y += b.dy * frameLength;

        if (b.x < b.r && b.dx < 0) {
            b.x = b.r;
            b.dx = -b.dx*restitution;
        }
        if (b.y < b.r && b.dy < 0) {
            b.y = b.r;
            b.dy = -b.dy*restitution;
        }
        if (b.x > w-b.r && b.dx > 0) {
            b.x = w-b.r;
            b.dx = -b.dx*restitution;
        }
        if (b.y > h-b.r && b.dy > 0) {
            b.y = h-b.r;
            b.dy = -b.dy*restitution;
        }

    }

    for (let i = 1; i < balls.length; i++) {
        for (let j = 0; j < i; j++) {

            const b1 = balls[i];
            const b2 = balls[j];

            const seperation = Ball.seperation(b1, b2);
            const overlap = b1.r + b2.r - seperation;

            if (overlap > 0) {

                const totalMass = b1.mass + b2.mass;

                const unitX = (b1.x - b2.x) / seperation;
                const unitY = (b1.y - b2.y) / seperation;

                const totalMomentum = b1.momentum() + b2.momentum();

                b1.x += unitX * overlap * b2.mass / totalMass;
                b1.y += unitY * overlap * b2.mass / totalMass;

                b2.x -= unitX * overlap * b1.mass / totalMass;
                b2.y -= unitY * overlap * b1.mass / totalMass;

                b1.dx = restitution * unitX * totalMomentum / b1.mass;
                b1.dy = restitution * unitY * totalMomentum / b1.mass;

                b2.dx = restitution * -unitX * totalMomentum / b2.mass;
                b2.dy = restitution * -unitY * totalMomentum / b2.mass;

            }
        }
    }


    for (let ball of balls) {
        context.drawImage(ballImage, 0,0, ballImage.width, ballImage.height, ball.x-ball.r, ball.y-ball.r, ball.r*2, ball.r*2);
    }

    window.requestAnimationFrame(redraw);

}
