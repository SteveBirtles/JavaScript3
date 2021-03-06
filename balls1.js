let w = 0, h = 0;
const ballImage = new Image();

function fixSize() {
    w = window.innerWidth;
    h = window.innerHeight;
    const canvas = document.getElementById('ballCanvas');
    canvas.width = w;
    canvas.height = h;
}

function pageLoad() {

    window.addEventListener("resize", fixSize);
    fixSize();

    ballImage.src = "ball.png";
    ballImage.onload = () => window.requestAnimationFrame(redraw);

}

let lastTimestamp = 0;

function redraw(timestamp) {

    const canvas = document.getElementById('ballCanvas');
    const context = canvas.getContext('2d');

    context.fillStyle = '#000088';
    context.fillRect(0, 0, w, h);

    const frameLength = processFrameRate(timestamp);


    window.requestAnimationFrame(redraw);

}
