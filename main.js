import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import firebaseConfig from "./firebaseConfig.json"

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let currentFloor = 3;

let floors = [];
floors[3] = 'siwb3.svg'
floors[4] = 'siwb4.svg'

let urls = []
urls[3] = 'https://firebasestorage.googleapis.com/v0/b/rgu-map.appspot.com/o/siwb3.svg?alt=media&token=f3e349b1-5d03-4aa9-bf9f-f8781b9e9872';
urls[4] = 'https://firebasestorage.googleapis.com/v0/b/rgu-map.appspot.com/o/siwb4.svg?alt=media&token=55ea5d55-9be5-4fe3-88dd-b5388571ea20';

let initialX = 0;
let initialY = 0;
let xOffset = 0;
let yOffset = 0;
let isDragging = false;

// View floor, save current floor, load new floor
const viewFloor = floor => {
    saveFile(currentFloor).then(url => {
        currentFloor = floor;
        loadFile(urls[floor])
    });
}

// Save file to firebase storage and return url
const saveFile = async floor => {
    return new Promise((resolve, reject) => {
        const svg = document.getElementById("svg");
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const svgUrl = URL.createObjectURL(svgBlob);
        const storage = getStorage();
        const storageRef = ref(storage, floors[floor]);
        uploadBytes(storageRef, svgBlob).then((snapshot) => {
        getDownloadURL(storageRef).then(url => {
            urls[floor] = url;
            resolve(url)
        }).catch(error => reject(error))
        }).catch(error => reject(error))
    });
}

// Load file from firebase storage and display, additionally add event listeners for dragging and adding points
const loadFile = file => fetch(file)
.then(response => response.text())
.then(svgContent => {
    document.getElementById("container").innerHTML = svgContent;
    document.getElementById("container").firstChild.id = "svg";
    const svg = document.getElementById('svg');
    registerListeners(svg);
});

// On dragging start, save initial position
const startDrag = e => {
    if (e.type === 'touchstart') {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }
    isDragging = true;
}

// On dragging, calculate new position and move svg
const drag = (e, svg) => {
    if (isDragging) {
        if (e.type === 'touchmove') {
            xOffset = e.touches[0].clientX - initialX;
            yOffset = e.touches[0].clientY - initialY;
        } else {
            xOffset = e.clientX - initialX;
            yOffset = e.clientY - initialY;
        }
        svg.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    }
}

// On dragging end, set dragging to false
const endDrag = () => {
    isDragging = false
}

// On click, add point to svg
const addPoint = (e, svg) => {

    // Check if click is within svg and not dragging
    if (!e.target.closest('#svg') || isDragging) {
        return
    }

    // Calculate relative position of click within svg
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

    // Add point to svg
    const circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    circle.setAttribute('cx', svgP.x);
    circle.setAttribute('cy', svgP.y);
    circle.setAttribute('r', 10);
    circle.setAttribute('fill', 'red');
    svg.appendChild(circle);
}

// Add event listeners for dragging and adding points
const registerListeners = svg => {
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('touchstart', startDrag);
    svg.addEventListener('mousemove', e => drag(e, svg));
    svg.addEventListener('touchmove', e => drag(e, svg));
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);
    svg.addEventListener('touchend', endDrag);
    svg.addEventListener('click', e => addPoint(e, svg));
    svg.addEventListener('touchend', e => addPoint(e, svg));

    document.getElementById("floor3").onclick = () => viewFloor(3);
    document.getElementById("floor4").onclick = () => viewFloor(4);
}

// Load initial floor
loadFile(urls[currentFloor])
