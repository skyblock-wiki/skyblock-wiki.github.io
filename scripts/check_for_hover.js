const body = document.body;
let lastTouchTime = 0;

function enableHoverByBrowserNameMatch() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) body.classList.add('hadHover');
    else disableHover();
}

function disableHover() {
    body.classList.remove('hasHover');
}

function enableHover() {
    if (new Date() - lastTouchTime < 500) return;
    body.classList.add('hasHover');
}

function updateLastTouchTime() {
    lastTouchTime = new Date();
}

document.addEventListener('touchstart', updateLastTouchTime, true);
document.addEventListener('touchstart', disableHover, true);
document.addEventListener('mousemove', enableHover, true);
document.addEventListener('DOMContentLoaded', enableHoverByBrowserNameMatch, true);
