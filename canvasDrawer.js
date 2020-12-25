window.addEventListener('DOMContentLoaded', () => {
    let $canvas = document.querySelector('#graph');
    if ($canvas) {
        let width = $canvas.clientWidth,
            height = $canvas.clientHeight,
            startX = width - 10,
            startY = height - 10;
        let ctx = $canvas.getContext('2d');
        ctx.fillStyle = '#000';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(width - startX - 10, startY);
        ctx.lineTo(startX, height - startY - 10);
        ctx.stroke();


    }
})