const { body } = document;
let lastTouchTime = 0;

/**
 * Adds the "has-hover" class to the body if the user is on a touch device
 */
function enableHoverByBrowserNameMatch() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) body.classList.add('has-hover');
    else disableHover();
}

/**
 * Removes the "has-hover" class from the body
 */
function disableHover() {
    body.classList.remove('has-hover');
}

/**
 * Adds the "has-hover" class to the body
 */
function enableHover() {
    if (new Date() - lastTouchTime < 500) return;
    body.classList.add('has-hover');
}

/**
 * Updates the lastTouchTime variable
 */
function updateLastTouchTime() {
    lastTouchTime = new Date();
}

document.addEventListener('touchstart', updateLastTouchTime, true);
document.addEventListener('touchstart', disableHover, true);
document.addEventListener('mousemove', enableHover, true);
document.addEventListener('DOMContentLoaded', enableHoverByBrowserNameMatch, true);
