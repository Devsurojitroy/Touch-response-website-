const touchArea = document.getElementById('touch-area');
const output = document.getElementById('output');
const visualFeedback = document.createElement('div');
visualFeedback.id = 'visual-feedback';
touchArea.appendChild(visualFeedback);

let touchStart = {};
let touchStartTime;
let lastTouchDistance = 0;
let lastTouchAngle = 0;

function logOutput(message) {
    output.innerHTML += `<br>${message}`;
}

function updateVisualFeedback(x, y, color) {
    visualFeedback.style.backgroundColor = color;
    visualFeedback.style.transform = `translate(${x}px, ${y}px)`;
}

function calculateDistance(touch1, touch2) {
    return Math.sqrt(Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2));
}

function calculateAngle(touch1, touch2) {
    return Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX) * (180 / Math.PI);
}

touchArea.addEventListener('touchstart', function(e) {
    touchStartTime = new Date().getTime();
    touchStart = {};
    for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        touchStart[touch.identifier] = {
            x: touch.clientX,
            y: touch.clientY,
            time: touchStartTime
        };
    }
    logOutput("Touch start detected");
    updateVisualFeedback(e.touches[0].clientX, e.touches[0].clientY, '#ff0');
});

touchArea.addEventListener('touchmove', function(e) {
    e.preventDefault();
    let swipeInfo = "";
    for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const startTouch = touchStart[touch.identifier];
        if (startTouch) {
            const deltaX = touch.clientX - startTouch.x;
            const deltaY = touch.clientY - startTouch.y;
            swipeInfo += `<br>Touch ID ${touch.identifier}: Moved (${deltaX}px, ${deltaY}px)`;
        }
    }

    if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = calculateDistance(touch1, touch2);
        const angle = calculateAngle(touch1, touch2);

        if (lastTouchDistance > 0) {
            const zoomChange = distance - lastTouchDistance;
            logOutput(`<br>Pinch Zoom: ${zoomChange.toFixed(2)} px`);
        }

        if (lastTouchAngle !== 0) {
            const rotationChange = angle - lastTouchAngle;
            logOutput(`<br>Rotation: ${rotationChange.toFixed(2)} degrees`);
        }

        lastTouchDistance = distance;
        lastTouchAngle = angle;
    }

    logOutput(swipeInfo || "Touch move detected");
});

touchArea.addEventListener('touchend', function(e) {
    const endTime = new Date().getTime();
    let touchDetails = "";
    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const startTouch = touchStart[touch.identifier];
        if (startTouch) {
            const touchDuration = endTime - startTouch.time;
            const deltaX = touch.clientX - startTouch.x;
            const deltaY = touch.clientY - startTouch.y;
            touchDetails += `<br>Touch ID ${touch.identifier}: Ended (${deltaX}px, ${deltaY}px), Duration: ${touchDuration} ms`;
        }
    }
    logOutput(touchDetails || "Touch end detected");
    updateVisualFeedback(e.changedTouches[0].clientX, e.changedTouches[0].clientY, '#0f0');
    lastTouchDistance = 0;
    lastTouchAngle = 0;
});

touchArea.addEventListener('touchcancel', function(e) {
    logOutput("Touch canceled");
    updateVisualFeedback(0, 0, '#f00');
});

touchArea.addEventListener('pointerdown', function(e) {
    logOutput("Pointer down detected at (" + e.clientX + ", " + e.clientY + ")");
    updateVisualFeedback(e.clientX, e.clientY, '#0f0');
});

touchArea.addEventListener('pointermove', function(e) {
    logOutput(`Pointer move detected at (${e.clientX}, ${e.clientY})`);
});

touchArea.addEventListener('pointerup', function(e) {
    logOutput("Pointer up detected");
    updateVisualFeedback(e.clientX, e.clientY, '#00f');
});

touchArea.addEventListener('pointercancel', function(e) {
    logOutput("Pointer canceled");
    updateVisualFeedback(0, 0, '#f00');
});