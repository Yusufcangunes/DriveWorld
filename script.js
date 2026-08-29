import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 80, 350);

const camera = new THREE.PerspectiveCamera(
    65,
    innerWidth / innerHeight,
    0.1,
    500
);

const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: "high-performance"
});

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
document.body.appendChild(renderer.domElement);


// =======================
// IŞIK
// =======================

scene.add(new THREE.HemisphereLight(
    0xffffff,
    0x557755,
    2
));

const sun = new THREE.DirectionalLight(
    0xffffff,
    2
);

sun.position.set(80, 120, 60);
scene.add(sun);


// =======================
// ZEMİN
// =======================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.MeshLambertMaterial({
        color: 0x3f9142
    })
);

ground.rotation.x = -Math.PI / 2;
scene.add(ground);


// =======================
// YOL
// =======================

const road = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 500),
    new THREE.MeshLambertMaterial({
        color: 0x292929
    })
);

road.rotation.x = -Math.PI / 2;
road.position.y = 0.01;
scene.add(road);

for (let z = -240; z < 240; z += 12) {

    const line = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.03, 6),
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        })
    );

    line.position.set(0, 0.04, z);
    scene.add(line);
}


// =======================
// CIVIC TARZI SEDAN
// =======================

const car = new THREE.Group();


// Ana gövde

const body = new THREE.Mesh(
    new THREE.BoxGeometry(2.25, 0.65, 4.5),
    new THREE.MeshLambertMaterial({
        color: 0xffffff
    })
);

body.position.y = 0.72;
car.add(body);


// Ön kaput

const hood = new THREE.Mesh(
    new THREE.BoxGeometry(2.05, 0.25, 1.25),
    new THREE.MeshLambertMaterial({
        color: 0xffffff
    })
);

hood.position.set(0, 1.05, -1.55);
car.add(hood);


// Tavan

const roof = new THREE.Mesh(
    new THREE.BoxGeometry(1.72, 0.62, 2.15),
    new THREE.MeshLambertMaterial({
        color: 0xffffff
    })
);

roof.position.set(0, 1.34, 0);
car.add(roof);


// Ön cam

const windshield = new THREE.Mesh(
    new THREE.BoxGeometry(1.55, 0.42, 0.06),
    new THREE.MeshBasicMaterial({
        color: 0x182b3b
    })
);

windshield.position.set(0, 1.38, -1.02);
windshield.rotation.x = -0.2;
car.add(windshield);


// Arka cam

const rearWindow = new THREE.Mesh(
    new THREE.BoxGeometry(1.55, 0.42, 0.06),
    new THREE.MeshBasicMaterial({
        color: 0x182b3b
    })
);

rearWindow.position.set(0, 1.38, 1.04);
rearWindow.rotation.x = 0.2;
car.add(rearWindow);


// Yan camlar

function sideWindow(x) {

    const window = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.43, 1.45),
        new THREE.MeshBasicMaterial({
            color: 0x182b3b
        })
    );

    window.position.set(x, 1.38, 0);
    car.add(window);
}

sideWindow(-0.87);
sideWindow(0.87);


// =======================
// AYNA
// =======================

function mirror(x) {

    const m = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.18, 0.35),
        new THREE.MeshLambertMaterial({
            color: 0x111111
        })
    );

    m.position.set(x, 1.25, -0.75);
    car.add(m);
}

mirror(-1.15);
mirror(1.15);


// =======================
// FARLAR
// =======================

function lamp(x, z, color) {

    const l = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.18, 0.08),
        new THREE.MeshBasicMaterial({
            color: color
        })
    );

    l.position.set(x, 0.88, z);
    car.add(l);
}

lamp(-0.72, -2.27, 0xffffff);
lamp(0.72, -2.27, 0xffffff);

lamp(-0.72, 2.27, 0xff1111);
lamp(0.72, 2.27, 0xff1111);


// =======================
// TEKERLEK + JANT
// =======================

const wheels = [];

function createWheel(x, z) {

    const wheel = new THREE.Group();

    const tire = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.43,
            0.43,
            0.32,
            16
        ),
        new THREE.MeshLambertMaterial({
            color: 0x111111
        })
    );

    tire.rotation.z = Math.PI / 2;

    wheel.add(tire);


    const rim = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.23,
            0.23,
            0.34,
            12
        ),
        new THREE.MeshLambertMaterial({
            color: 0xbfc3c7
        })
    );

    rim.rotation.z = Math.PI / 2;

    wheel.add(rim);

    wheel.position.set(x, 0.47, z);

    car.add(wheel);

    wheels.push(wheel);
}

createWheel(-1.18, -1.43);
createWheel(1.18, -1.43);
createWheel(-1.18, 1.43);
createWheel(1.18, 1.43);

scene.add(car);


// =======================
// MOBİL KONTROLLER
// =======================

let gas = false;
let brake = false;
let steering = 0;

const gasButton = document.getElementById("gas");
const brakeButton = document.getElementById("brake");
const wheel = document.getElementById("wheel-ring");


// Gaz

gasButton.addEventListener("touchstart", e => {
    e.preventDefault();
    gas = true;
}, { passive: false });

gasButton.addEventListener("touchend", e => {
    e.preventDefault();
    gas = false;
}, { passive: false });

gasButton.addEventListener("touchcancel", () => {
    gas = false;
});


// Fren

brakeButton.addEventListener("touchstart", e => {
    e.preventDefault();
    brake = true;
}, { passive: false });

brakeButton.addEventListener("touchend", e => {
    e.preventDefault();
    brake = false;
}, { passive: false });

brakeButton.addEventListener("touchcancel", () => {
    brake = false;
});


// =======================
// DİREKSİYON
// =======================

let startX = null;
let startSteering = 0;

wheel.addEventListener("touchstart", e => {

    e.preventDefault();

    startX = e.touches[0].clientX;
    startSteering = steering;

}, { passive: false });


wheel.addEventListener("touchmove", e => {

    e.preventDefault();

    if (startX === null) return;

    const x = e.touches[0].clientX;

    const difference = x - startX;

    steering = THREE.MathUtils.clamp(
        startSteering + difference / 70,
        -1,
        1
    );

    wheel.style.transform =
        `rotate(${steering * 80}deg)`;

}, { passive: false });


function resetSteering() {

    startX = null;

    steering *= 0.7;

    if (Math.abs(steering) < 0.05) {
        steering = 0;
    }

    wheel.style.transform =
        `rotate(${steering * 80}deg)`;
}

wheel.addEventListener("touchend", resetSteering);
wheel.addEventListener("touchcancel", resetSteering);


// =======================
// ARABA FİZİĞİ
// =======================

let speed = 0;

const maxSpeed = 1.5;
const acceleration = 0.018;
const brakePower = 0.045;

function updateCar() {

    if (gas) {
        speed += acceleration;

        if (speed > maxSpeed) {
            speed = maxSpeed;
        }
    }

    if (brake) {
        speed -= brakePower;

        if (speed < 0) {
            speed = 0;
        }
    }

    speed *= 0.987;


    // Direksiyon

    if (Math.abs(speed) > 0.02) {

        car.rotation.y -=
            steering *
            0.035 *
            speed;
    }


    // Hareket

    car.translateZ(-speed);


    // Tekerlek dönüşü

    for (const wheel of wheels) {
        wheel.rotation.x -= speed * 2.5;
    }


    // Hız göstergesi

    document.getElementById("speed").textContent =
        Math.round(speed * 85);
}


// =======================
// KAMERA
// =======================

function updateCamera() {

    const offset = new THREE.Vector3(
        0,
        4.2,
        8.5
    );

    offset.applyMatrix4(car.matrixWorld);

    camera.position.lerp(
        offset,
        0.1
    );

    camera.lookAt(
        car.position.x,
        1,
        car.position.z
    );
}


// =======================
// BAŞLAT
// =======================

camera.position.set(0, 4, 8);

document.getElementById("loading").style.display = "none";


function animate() {

    requestAnimationFrame(animate);

    updateCar();
    updateCamera();

    renderer.render(scene, camera);
}

animate();


window.addEventListener("resize", () => {

    camera.aspect =
        innerWidth / innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        innerWidth,
        innerHeight
    );
});
