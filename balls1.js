let w = 0, h = 0;
const ballImage = new Image();

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
        let dx = Math.random() * 1000 - 500;
        let dy = Math.random() * 1000 - 500;
        let r = Math.random() * 30 + 10;
        balls.push({x, y, dx, dy, r});
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

    for (let ball of balls) {

        let dSquared = Math.sqrt(Math.pow(ball.x - mousePosition.x, 2) + Math.pow(ball.y - mousePosition.y, 2));

        ball.dx += attraction * (ball.x - mousePosition.x) / dSquared;
        ball.dy += attraction * (ball.y - mousePosition.y) / dSquared;

        ball.x += ball.dx * frameLength;
        ball.y += ball.dy * frameLength;

        if (ball.x < ball.r && ball.dx < 0) {
            ball.x = ball.r;
            ball.dx = -ball.dx*restitution;
        }
        if (ball.y < ball.r && ball.dy < 0) {
            ball.y = ball.r;
            ball.dy = -ball.dy*restitution;
        }
        if (ball.x > w-ball.r && ball.dx > 0) {
            ball.x = w-ball.r;
            ball.dx = -ball.dx*restitution;
        }
        if (ball.y > h-ball.r && ball.dy > 0) {
            ball.y = h-ball.r;
            ball.dy = -ball.dy*restitution;
        }

    }

    for (let i = 1; i < balls.length; i++) {
        for (let j = 0; j < i; j++) {

            let seperation = Math.sqrt(Math.pow(balls[i].x - balls[j].x, 2) + Math.pow(balls[i].y - balls[j].y, 2));
            let overlap = balls[i].r + balls[j].r - seperation;

            if (overlap > 0) {

                let mass1 = Math.pow(balls[i].r, 2);
                let mass2 = Math.pow(balls[j].r, 2);

                let v1 = Math.sqrt(Math.pow(balls[i].dx, 2) + Math.pow(balls[i].dy, 2));
                let v2 = Math.sqrt(Math.pow(balls[j].dx, 2) + Math.pow(balls[j].dy, 2));

                let unitX = (balls[i].x - balls[j].x) / seperation;
                let unitY = (balls[i].y - balls[j].y) / seperation;

                let momentum = v1 * mass1 + v2 + mass2;

                balls[i].x += unitX * overlap * mass2 / (mass1 + mass2);
                balls[i].y += unitY * overlap * mass2 / (mass1 + mass2);
                balls[j].x -= unitX * overlap * mass1 / (mass1 + mass2);
                balls[j].y -= unitY * overlap * mass1 / (mass1 + mass2);
                balls[i].dx = restitution * unitX * momentum / mass1;
                balls[i].dy = restitution * unitY * momentum / mass1;
                balls[j].dx = restitution * -unitX * momentum / mass2;
                balls[j].dy = restitution * -unitY * momentum / mass2;

            }
        }
    }


    for (let ball of balls) {
        context.drawImage(ballImage, 0,0, ballImage.width, ballImage.height, ball.x-ball.r, ball.y-ball.r, ball.r*2, ball.r*2);
    }

    window.requestAnimationFrame(redraw);

}
