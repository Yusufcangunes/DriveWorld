import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 80, 350);

const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);

const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: "high-performance"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = false;

document.body.appendChild(renderer.domElement);


// ====================
// IŞIK
// ====================

const sun = new THREE.DirectionalLight(0xffffff, 1.8);
sun.position.set(50, 100, 30);
scene.add(sun);

scene.add(new THREE.AmbientLight(0xffffff, 0.7));


// ====================
// ZEMİN
// ====================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.MeshLambertMaterial({
        color: 0x3f9142
    })
);

ground.rotation.x = -Math.PI / 2;
scene.add(ground);


// ====================
// YOL
// ====================

const road = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 500),
    new THREE.MeshLambertMaterial({
        color: 0x303030
    })
);

road.rotation.x = -Math.PI / 2;
road.position.y = 0.02;

scene.add(road);


// Yol çizgileri

for (let z = -240; z < 240; z += 12) {

    const line = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.03, 6),
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        })
    );

    line.position.set(0, 0.05, z);

    scene.add(line);
}


// ====================
// ARABA
// ====================

const car = new THREE.Group();


// Gövde

const body = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, 0.65, 4.2),
    new THREE.MeshLambertMaterial({
        color: 0xe60000
    })
);

body.position.y = 0.75;

car.add(body);


// Kabin

const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.7, 0.65, 2),
    new THREE.MeshLambertMaterial({
        color: 0x20252b
    })
);

cabin.position.set(0, 1.3, -0.25);

car.add(cabin);


// Tekerlek oluşturma

function createWheel(x, z) {

    const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.42, 0.32, 12),
        new THREE.MeshLambertMaterial({
            color: 0x111111
        })
    );

    wheel.rotation.z = Math.PI / 2;

    wheel.position.set(x, 0.45, z);

    car.add(wheel);
}

createWheel(-1.2, 1.35);
createWheel(1.2, 1.35);
createWheel(-1.2, -1.35);
createWheel(1.2, -1.35);

scene.add(car);


// ====================
// MOBİL KONTROLLER
// ====================

let gas = false;
let brake = false;
let left = false;
let right = false;

const gasButton = document.getElementById("gas");
const brakeButton = document.getElementById("brake");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");


function buttonControl(button, start, end) {

    if (!button) return;

    button.addEventListener("touchstart", function(e) {
        e.preventDefault();
        start();
    }, { passive: false });

    button.addEventListener("touchend", function(e) {
        e.preventDefault();
        end();
    }, { passive: false });

    button.addEventListener("touchcancel", end);
}


buttonControl(
    gasButton,
    () => gas = true,
    () => gas = false
);

buttonControl(
    brakeButton,
    () => brake = true,
    () => brake = false
);

buttonControl(
    leftButton,
    () => left = true,
    () => left = false
);

buttonControl(
    rightButton,
    () => right = true,
    () => right = false
);


// ====================
// ARABA FİZİĞİ
// ====================

let speed = 0;

const acceleration = 0.018;
const brakePower = 0.035;
const friction = 0.985;
const maxSpeed = 1.3;


function updateCar() {

    // Gaz

    if (gas) {
        speed += acceleration;
    }

    // Fren

    if (brake) {

        if (speed > 0) {
            speed -= brakePower;
        } else {
            speed += brakePower;
        }
    }

    // Yavaşlama

    speed *= friction;

    // Hız sınırı

    speed = THREE.MathUtils.clamp(
        speed,
        -0.5,
        maxSpeed
    );


    // Direksiyon

    if (Math.abs(speed) > 0.02) {

        const steeringPower = 0.035 * Math.min(
            Math.abs(speed),
            1
        );

        if (left) {
            car.rotation.y += steeringPower;
        }

        if (right) {
            car.rotation.y -= steeringPower;
        }
    }


    // Arabayı hareket ettir

    car.translateZ(-speed);


    // Hız göstergesi

    const speedDisplay = document.getElementById("speed");

    if (speedDisplay) {

        const kmh = Math.round(
            Math.abs(speed) * 80
        );

        speedDisplay.textContent = kmh;
    }
}


// ====================
// KAMERA
// ====================

const cameraOffset = new THREE.Vector3(
    0,
    4.5,
    8
);


function updateCamera() {

    const targetPosition = cameraOffset.clone();

    targetPosition.applyMatrix4(car.matrixWorld);

    camera.position.lerp(
        targetPosition,
        0.12
    );

    camera.lookAt(
        car.position.x,
        car.position.y + 0.7,
        car.position.z
    );
}


// ====================
// BAŞLANGIÇ
// ====================

camera.position.set(
    0,
    4.5,
    8
);

camera.lookAt(car.position);


// ====================
// OYUN DÖNGÜSÜ
// ====================

function gameLoop() {

    requestAnimationFrame(gameLoop);

    updateCar();

    updateCamera();

    renderer.render(
        scene,
        camera
    );
}


// Yükleme ekranını kapat

const loading = document.getElementById("loading");

if (loading) {
    loading.style.display = "none";
}


// Telefon ekranı değişirse

window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});


gameLoop();
