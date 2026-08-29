import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 100, 450);

const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    700
);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

document.body.appendChild(renderer.domElement);


// =====================================
// IŞIK
// =====================================

const ambient = new THREE.HemisphereLight(
    0xffffff,
    0x557755,
    2
);

scene.add(ambient);

const sun = new THREE.DirectionalLight(
    0xffffff,
    2
);

sun.position.set(100, 150, 80);
scene.add(sun);


// =====================================
// ZEMİN
// =====================================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(700, 700),
    new THREE.MeshLambertMaterial({
        color: 0x39833c
    })
);

ground.rotation.x = -Math.PI / 2;
scene.add(ground);


// =====================================
// YOLLAR
// =====================================

function createRoad(width, length, x, z, rotation = 0) {

    const road = new THREE.Mesh(
        new THREE.PlaneGeometry(width, length),
        new THREE.MeshLambertMaterial({
            color: 0x292929
        })
    );

    road.rotation.x = -Math.PI / 2;
    road.rotation.z = rotation;

    road.position.set(x, 0.02, z);

    scene.add(road);
}

createRoad(20, 700, 0, 0);
createRoad(20, 700, 80, 0);
createRoad(20, 700, -80, 0);

createRoad(700, 20, 0, 80, Math.PI / 2);
createRoad(700, 20, 0, -80, Math.PI / 2);


// =====================================
// YOL ÇİZGİLERİ
// =====================================

function createLine(x, z, horizontal = false) {

    const line = new THREE.Mesh(
        new THREE.BoxGeometry(
            horizontal ? 5 : 0.18,
            0.04,
            horizontal ? 0.18 : 5
        ),
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        })
    );

    line.position.set(x, 0.05, z);

    scene.add(line);
}

for (let z = -340; z < 340; z += 12) {

    createLine(0, z);
    createLine(80, z);
    createLine(-80, z);
}

for (let x = -340; x < 340; x += 12) {

    createLine(x, 80, true);
    createLine(x, -80, true);
}


// =====================================
// BİNALAR
// =====================================

function createBuilding(x, z, width, depth, height) {

    const building = new THREE.Mesh(
        new THREE.BoxGeometry(
            width,
            height,
            depth
        ),
        new THREE.MeshLambertMaterial({
            color: 0x777777
        })
    );

    building.position.set(
        x,
        height / 2,
        z
    );

    scene.add(building);


    const roof = new THREE.Mesh(
        new THREE.BoxGeometry(
            width + 0.2,
            0.15,
            depth + 0.2
        ),
        new THREE.MeshLambertMaterial({
            color: 0x333333
        })
    );

    roof.position.set(
        x,
        height + 0.08,
        z
    );

    scene.add(roof);
}


const buildingPositions = [

    [-40, -40],
    [-15, -42],
    [35, -42],
    [55, -40],

    [-42, -15],
    [42, -15],

    [-42, 35],
    [-15, 42],
    [35, 42],
    [55, 35],

    [-120, -40],
    [-120, 10],
    [-120, 60],

    [120, -40],
    [120, 10],
    [120, 60],

    [-40, 125],
    [10, 125],
    [60, 125],

    [-40, -125],
    [10, -125],
    [60, -125]
];

for (const [x, z] of buildingPositions) {

    createBuilding(
        x,
        z,
        10 + Math.random() * 6,
        10 + Math.random() * 6,
        10 + Math.random() * 20
    );
}


// =====================================
// AĞAÇLAR
// =====================================

function createTree(x, z) {

    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.25,
            0.35,
            2,
            8
        ),
        new THREE.MeshLambertMaterial({
            color: 0x70452a
        })
    );

    trunk.position.y = 1;

    tree.add(trunk);


    const leaves = new THREE.Mesh(
        new THREE.SphereGeometry(
            1.5,
            8,
            8
        ),
        new THREE.MeshLambertMaterial({
            color: 0x28752f
        })
    );

    leaves.position.y = 2.7;

    tree.add(leaves);

    tree.position.set(x, 0, z);

    scene.add(tree);
}

for (let x = -300; x <= 300; x += 30) {

    createTree(x, 23);
    createTree(x, -23);
}


// =====================================
// BMW M4
// =====================================

let car = null;

const loader = new GLTFLoader();

loader.load(
    "./2021_bmw_m4_competition.glb",

    function(gltf) {

        car = gltf.scene;

        car.position.set(
            0,
            0,
            0
        );

        car.scale.set(
            1,
            1,
            1
        );

        car.rotation.y = Math.PI;

        car.traverse(function(object) {

            if (object.isMesh) {

                object.castShadow = true;
                object.receiveShadow = true;
            }
        });

        scene.add(car);

        console.log("BMW M4 başarıyla yüklendi!");

        // YÜKLEME EKRANINI KAPAT
        const loading =
            document.getElementById("loading");

        if (loading) {
            loading.style.display = "none";
        }
    },

    function(progress) {

        console.log(
            "BMW yükleniyor..."
        );
    },

    function(error) {

        console.error(
            "BMW yüklenemedi:",
            error
        );

        // Model hata verse bile oyun açılsın
        const loading =
            document.getElementById("loading");

        if (loading) {
            loading.style.display = "none";
        }
    }
);


// =====================================
// MOBİL KONTROLLER
// =====================================

let gas = false;
let brake = false;
let steering = 0;

const gasButton =
    document.getElementById("gas");

const brakeButton =
    document.getElementById("brake");

const wheel =
    document.getElementById("wheel-ring");


// =====================================
// GAZ
// =====================================

if (gasButton) {

    gasButton.addEventListener(
        "touchstart",
        function(e) {

            e.preventDefault();

            gas = true;
        },
        { passive: false }
    );

    gasButton.addEventListener(
        "touchend",
        function(e) {

            e.preventDefault();

            gas = false;
        },
        { passive: false }
    );

    gasButton.addEventListener(
        "touchcancel",
        function() {

            gas = false;
        }
    );
}


// =====================================
// FREN
// =====================================

if (brakeButton) {

    brakeButton.addEventListener(
        "touchstart",
        function(e) {

            e.preventDefault();

            brake = true;
        },
        { passive: false }
    );

    brakeButton.addEventListener(
        "touchend",
        function(e) {

            e.preventDefault();

            brake = false;
        },
        { passive: false }
    );

    brakeButton.addEventListener(
        "touchcancel",
        function() {

            brake = false;
        }
    );
}


// =====================================
// DİREKSİYON
// =====================================

let startX = null;
let startSteering = 0;

if (wheel) {

    wheel.addEventListener(
        "touchstart",
        function(e) {

            e.preventDefault();

            startX =
                e.touches[0].clientX;

            startSteering =
                steering;
        },
        { passive: false }
    );


    wheel.addEventListener(
        "touchmove",
        function(e) {

            e.preventDefault();

            if (startX === null) {
                return;
            }

            const currentX =
                e.touches[0].clientX;

            const difference =
                currentX - startX;

            steering =
                THREE.MathUtils.clamp(
                    startSteering +
                    difference / 100,
                    -1,
                    1
                );

            wheel.style.transform =
                `rotate(${steering * 70}deg)`;
        },
        { passive: false }
    );


    function resetWheel() {

        startX = null;

        steering *= 0.7;

        if (
            Math.abs(steering) < 0.03
        ) {

            steering = 0;
        }

        wheel.style.transform =
            `rotate(${steering * 70}deg)`;
    }

    wheel.addEventListener(
        "touchend",
        resetWheel
    );

    wheel.addEventListener(
        "touchcancel",
        resetWheel
    );
}


// =====================================
// ARABA FİZİĞİ
// =====================================

let speed = 0;

const maxSpeed = 1.7;
const acceleration = 0.018;
const brakePower = 0.055;

function updateCar() {

    if (!car) {
        return;
    }


    // Gaz

    if (gas) {

        speed += acceleration;

        if (speed > maxSpeed) {
            speed = maxSpeed;
        }
    }


    // Fren

    if (brake) {

        speed -= brakePower;

        if (speed < 0) {
            speed = 0;
        }
    }


    // Sürtünme

    speed *= 0.988;


    // Direksiyon

    if (
        Math.abs(speed) > 0.01
    ) {

        car.rotation.y -=
            steering *
            0.032 *
            speed;
    }


    // Hareket

    car.translateZ(-speed);


    // Hız göstergesi

    const speedDisplay =
        document.getElementById("speed");

    if (speedDisplay) {

        speedDisplay.textContent =
            Math.round(speed * 85);
    }
}


// =====================================
// KAMERA
// =====================================

function updateCamera() {

    if (!car) {
        return;
    }

    const offset =
        new THREE.Vector3(
            0,
            4.5,
            8.5
        );

    offset.applyQuaternion(
        car.quaternion
    );

    offset.add(
        car.position
    );

    camera.position.lerp(
        offset,
        0.1
    );


    const target =
        car.position.clone();

    target.y += 1;

    camera.lookAt(target);
}


// =====================================
// OYUN DÖNGÜSÜ
// =====================================

camera.position.set(
    0,
    4,
    8
);

function animate() {

    requestAnimationFrame(
        animate
    );

    updateCar();

    updateCamera();

    renderer.render(
        scene,
        camera
    );
}

animate();


// =====================================
// EKRAN BOYUTU
// =====================================

window.addEventListener(
    "resize",
    function() {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);

