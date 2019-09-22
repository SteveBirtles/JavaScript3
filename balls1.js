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

let lastTimestamp = 0, fps = 0, fpsTimestamp = -1, frames = 0;

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
        let r = Math.random() * 20 + 20;
        balls.push({x, y, dx, dy, r});
    }

    window.requestAnimationFrame(redraw);

}

function redraw(timestamp) {

    const canvas = document.getElementById('ballCanvas');
    const context = canvas.getContext('2d');

    context.fillStyle = '#000088';
    context.fillRect(0, 0, w, h);

    const frameLength = processFrameRate(timestamp)

    //console.log(frameLength);

    for (let ball of balls) {

        ball.x += ball.dx * frameLength;
        ball.y += ball.dy * frameLength;

        if (ball.x < ball.r && ball.dx < 0) ball.dx = -ball.dx;
        if (ball.y < ball.r && ball.dy < 0) ball.dy = -ball.dy;
        if (ball.x > w-ball.r && ball.dx > 0) ball.dx = -ball.dx;
        if (ball.y > h-ball.r && ball.dy > 0) ball.dy = -ball.dy;

    }

    for (let i = 1; i < balls.length; i++) {
        for (let j = 0; j < i; j++) {

            let nextSeperation = Math.sqrt(Math.pow(balls[i].x + balls[i].dx * frameLength - balls[j].x - balls[j].dx * frameLength, 2)
                                     + Math.pow(balls[i].y + balls[i].dy * frameLength - balls[j].y - balls[j].dy * frameLength, 2));

            let seperation = Math.sqrt(Math.pow(balls[i].x - balls[j].x, 2)
                                     + Math.pow(balls[i].y - balls[j].y, 2));

            if (seperation < balls[i].r + balls[j].r) {

                let unitX = (balls[i].x - balls[j].x) / seperation;
                let unitY = (balls[i].y - balls[j].y) / seperation;

                balls[i].x += unitX;
                balls[i].y += unitY;
                balls[j].x -= unitX;
                balls[j].y -= unitY;

            } else if (nextSeperation < balls[i].r + balls[j].r) {

                let collisionPointX = ((balls[i].x * balls[j].r) + (balls[j].x * balls[i].r)) / (balls[i].r + balls[j].r);
                let collisionPointY = ((balls[i].y * balls[j].r) + (balls[j].y * balls[i].r)) / (balls[i].r + balls[j].r);

                let mass1 = Math.pow(balls[i].r, 2);
                let mass2 = Math.pow(balls[j].r, 2);

                let newVelX1 = (balls[i].dx * (mass1 - mass2) + (2 * mass2 * balls[j].dx)) / (mass1 + mass2);
                let newVelY1 = (balls[i].dy * (mass1 - mass2) + (2 * mass2 * balls[j].dy)) / (mass1 + mass2);
                let newVelX2 = (balls[j].dx * (mass2 - mass1) + (2 * mass1 * balls[i].dx)) / (mass1 + mass2);
                let newVelY2 = (balls[j].dy * (mass2 - mass1) + (2 * mass1 * balls[i].dy)) / (mass1 + mass2);

                balls[i].dx = newVelX1;
                balls[i].dy = newVelY1;
                balls[j].dx = newVelX2;
                balls[j].dy = newVelY2;

            }
        }
    }

    for (let ball of balls) {
        context.drawImage(ballImage, 0,0, ballImage.width, ballImage.height, ball.x-ball.r, ball.y-ball.r, ball.r*2, ball.r*2);
        //context.font = "12px Arial";
        //context.fillStyle = 'white';
        //context.fillText(`(${ball.dx}, ${ball.dy})`, ball.x+ball.r, ball.y+ball.r);
    }

    window.requestAnimationFrame(redraw);

}
