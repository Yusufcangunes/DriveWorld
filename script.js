import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// IŞIK
const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.position.set(50, 100, 50);
scene.add(sun);

scene.add(new THREE.AmbientLight(0xffffff, 0.7));

// ZEMİN
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.MeshStandardMaterial({
        color: 0x3b8d3b
    })
);

ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// YOL
const road = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 500),
    new THREE.MeshStandardMaterial({
        color: 0x333333
    })
);

road.rotation.x = -Math.PI / 2;
road.position.y = 0.01;
scene.add(road);

// ARABA
const car = new THREE.Group();

const body = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.7, 4),
    new THREE.MeshStandardMaterial({
        color: 0xff2020
    })
);

body.position.y = 0.8;
car.add(body);

const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.7, 0.65, 2),
    new THREE.MeshStandardMaterial({
        color: 0x222222
    })
);

cabin.position.y = 1.35;
cabin.position.z = -0.2;
car.add(cabin);

// TEKERLEKLER
function wheel(x, z) {
    const w = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.42, 0.3, 16),
        new THREE.MeshStandardMaterial({
            color: 0x111111
        })
    );

    w.rotation.z = Math.PI / 2;
    w.position.set(x, 0.45, z);
    car.add(w);
}

wheel(-1.15, 1.3);
wheel(1.15, 1.3);
wheel(-1.15, -1.3);
wheel(1.15, -1.3);

scene.add(car);

camera.position.set(0, 5, 8);
camera.lookAt(car.position);

// MOBİL KONTROLLER
let gas = false;
let brake = false;
let left = false;
let right = false;

const buttons = {
    gas: document.getElementById("gas"),
    brake: document.getElementById("brake"),
    left: document.getElementById("left"),
    right: document.getElementById("right")
};

function hold(button, start, end) {
    if (!button) return;

    button.addEventListener("touchstart", e => {
        e.preventDefault();
        start();
    });

    button.addEventListener("touchend", e => {
        e.preventDefault();
        end();
    });

    button.addEventListener("touchcancel", end);
}

hold(buttons.gas, () => gas = true, () => gas = false);
hold(buttons.brake, () => brake = true, () => brake = false);
hold(buttons.left, () => left = true, () => left = false);
hold(buttons.right, () => right = true, () => right = false);

let speed = 0;

function update() {

    if (gas) {
        speed += 0.015;
    }

    if (brake) {
        speed -= 0.03;
    }

    speed *= 0.98;

    speed = Math.max(-0.5, Math.min(speed, 1.2));

    if (left) {
        car.rotation.y += 0.025 * Math.abs(speed);
    }

    if (right) {
        car.rotation.y -= 0.025 * Math.abs(speed);
    }

    car.translateZ(-speed);

    const kmh = Math.round(Math.abs(speed) * 80);

    const speedText = document.getElementById("speed");

    if (speedText) {
        speedText.textContent = kmh;
    }

    // KAMERA
    const target = new THREE.Vector3(0, 3.5, 7);
    target.applyMatrix4(car.matrixWorld);

    camera.position.lerp(target, 0.1);
    camera.lookAt(car.position.x, car.position.y + 0.7, car.position.z);
}

function animate() {
    requestAnimationFrame(animate);

    update();

    renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.getElementById("loading").style.display = "none";

animate();
