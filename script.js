import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import { GLTFLoader } from
"https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js";

// ===============================
// SAHNE
// ===============================

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x87ceeb);

scene.fog = new THREE.Fog(
    0x87ceeb,
    100,
    450
);


// ===============================
// KAMERA
// ===============================

const camera =
    new THREE.PerspectiveCamera(
        65,
        innerWidth / innerHeight,
        0.1,
        700
    );


// ===============================
// RENDER
// ===============================

const renderer =
    new THREE.WebGLRenderer({
        antialias: false,
        powerPreference:
            "high-performance"
    });

renderer.setSize(
    innerWidth,
    innerHeight
);

renderer.setPixelRatio(
    Math.min(devicePixelRatio, 1.5)
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

document.body.appendChild(
    renderer.domElement
);


// ===============================
// IŞIK
// ===============================

scene.add(
    new THREE.HemisphereLight(
        0xffffff,
        0x557755,
        2
    )
);

const sun =
    new THREE.DirectionalLight(
        0xffffff,
        2.2
    );

sun.position.set(
    100,
    180,
    80
);

sun.castShadow = true;

scene.add(sun);


// ===============================
// ZEMİN
// ===============================

const ground =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            700,
            700
        ),
        new THREE.MeshLambertMaterial({
            color: 0x39833c
        })
    );

ground.rotation.x =
    -Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);


// ===============================
// YOL
// ===============================

function createRoad(
    width,
    length,
    x,
    z,
    rotation = 0
) {

    const road =
        new THREE.Mesh(
            new THREE.PlaneGeometry(
                width,
                length
            ),
            new THREE.MeshLambertMaterial({
                color: 0x292929
            })
        );

    road.rotation.x =
        -Math.PI / 2;

    road.rotation.z =
        rotation;

    road.position.set(
        x,
        0.025,
        z
    );

    road.receiveShadow = true;

    scene.add(road);
}


// Ana yollar

createRoad(
    20,
    650,
    0,
    0
);

createRoad(
    20,
    650,
    80,
    0
);

createRoad(
    20,
    650,
    -80,
    0
);

createRoad(
    650,
    20,
    0,
    80,
    Math.PI / 2
);

createRoad(
    650,
    20,
    0,
    -80,
    Math.PI / 2
);


// ===============================
// YOL ÇİZGİLERİ
// ===============================

function createLine(
    x,
    z,
    horizontal
) {

    const line =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                horizontal ? 5 : 0.18,
                0.04,
                horizontal ? 0.18 : 5
            ),
            new THREE.MeshBasicMaterial({
                color: 0xffffff
            })
        );

    line.position.set(
        x,
        0.06,
        z
    );

    scene.add(line);
}


for (
    let z = -320;
    z < 320;
    z += 12
) {

    createLine(
        0,
        z,
        false
    );

    createLine(
        80,
        z,
        false
    );

    createLine(
        -80,
        z,
        false
    );
}


for (
    let x = -320;
    x < 320;
    x += 12
) {

    createLine(
        x,
        80,
        true
    );

    createLine(
        x,
        -80,
        true
    );
}


// ===============================
// BİNA
// ===============================

function createBuilding(
    x,
    z,
    width,
    depth,
    height
) {

    const building =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                height,
                depth
            ),
            new THREE.MeshLambertMaterial({
                color:
                    0x666666 +
                    Math.floor(
                        Math.random() *
                        0x222222
                    )
            })
        );

    building.position.set(
        x,
        height / 2,
        z
    );

    building.castShadow = true;
    building.receiveShadow = true;

    scene.add(building);


    // Çatı

    const roof =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width + 0.15,
                0.15,
                depth + 0.15
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


// ===============================
// ŞEHİR
// ===============================

const buildings = [

    [-42, -42],
    [-15, -42],
    [35, -42],
    [55, -42],

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


for (
    const [x, z]
    of buildings
) {

    createBuilding(
        x,
        z,
        9 + Math.random() * 7,
        9 + Math.random() * 7,
        10 + Math.random() * 25
    );
}


// ===============================
// AĞAÇ
// ===============================

function createTree(x, z) {

    const tree =
        new THREE.Group();


    const trunk =
        new THREE.Mesh(
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


    const leaves =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                1.5,
                8,
                8
            ),
            new THREE.MeshLambertMaterial({
                color: 0x26752d
            })
        );

    leaves.position.y = 2.7;

    tree.add(leaves);


    tree.position.set(
        x,
        0,
        z
    );

    scene.add(tree);
}


for (
    let x = -300;
    x <= 300;
    x += 30
) {

    createTree(x, 22);
    createTree(x, -22);
}


// ===============================
// BMW M4
// ===============================

let car = null;

const loader =
    new GLTFLoader();

loader.load(

    "./2021_bmw_m4_competition.glb",

    function(gltf) {

        car = gltf.scene;

        car.scale.set(
            1,
            1,
            1
        );

        car.position.set(
            0,
            0,
            0
        );

        car.rotation.y =
            Math.PI;

        car.traverse(
            function(object) {

                if (
                    object.isMesh
                ) {

                    object.castShadow = true;
                    object.receiveShadow = true;

                    if (
                        object.material
                    ) {

                        object.material
                            .roughness = 0.4;

                        object.material
                            .metalness = 0.15;
                    }
                }
            }
        );

        scene.add(car);

        console.log(
            "BMW M4 yüklendi!"
        );
    },

    undefined,

    function(error) {

        console.error(
            "BMW modeli yüklenemedi:",
            error
        );
    }
);


// ===============================
// KONTROLLER
// ===============================

let gas = false;
let brake = false;

let steering = 0;

let startX = null;
let startSteering = 0;


const gasButton =
    document.getElementById("gas");

const brakeButton =
    document.getElementById("brake");

const wheel =
    document.getElementById(
        "wheel-ring"
    );


// ===============================
// GAZ
// ===============================

if (gasButton) {

    gasButton.addEventListener(
        "touchstart",
        function(e) {

            e.preventDefault();

            gas = true;
        },
        {
            passive: false
        }
    );


    gasButton.addEventListener(
        "touchend",
        function(e) {

            e.preventDefault();

            gas = false;
        },
        {
            passive: false
        }
    );
}


// ===============================
// FREN
// ===============================

if (brakeButton) {

    brakeButton.addEventListener(
        "touchstart",
        function(e) {

            e.preventDefault();

            brake = true;
        },
        {
            passive: false
        }
    );


    brakeButton.addEventListener(
        "touchend",
        function(e) {

            e.preventDefault();

            brake = false;
        },
        {
            passive: false
        }
    );
}


// ===============================
// DİREKSİYON
// ===============================

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
        {
            passive: false
        }
    );


    wheel.addEventListener(
        "touchmove",
        function(e) {

            e.preventDefault();

            if (
                startX === null
            ) return;

            const currentX =
                e.touches[0].clientX;

            steering =
                THREE.MathUtils.clamp(
                    startSteering +
                    (
                        currentX -
                        startX
                    ) / 100,
                    -1,
                    1
                );

            wheel.style.transform =
                `rotate(${steering * 70}deg)`;
        },
        {
            passive: false
        }
    );


    function releaseWheel() {

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
        releaseWheel
    );

    wheel.addEventListener(
        "touchcancel",
        releaseWheel
    );
}


// ===============================
// ARABA FİZİĞİ
// ===============================

let speed = 0;

const maxSpeed = 1.7;

const acceleration = 0.018;

const brakePower = 0.055;


function updateCar() {

    if (!car)
        return;


    // Gaz

    if (gas) {

        speed += acceleration;

        if (
            speed > maxSpeed
        ) {

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


    // Doğal yavaşlama

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

    car.translateZ(
        -speed
    );


    // Hız göstergesi

    const speedDisplay =
        document.getElementById(
            "speed"
        );

    if (speedDisplay) {

        speedDisplay.textContent =
            Math.round(
                speed * 85
            );
    }
}


// ===============================
// KAMERA
// ===============================

const cameraOffset =
    new THREE.Vector3(
        0,
        4.2,
        8
    );


function updateCamera() {

    if (!car)
        return;


    const target =
        cameraOffset.clone();

    target.applyQuaternion(
        car.quaternion
    );

    target.add(
        car.position
    );


    camera.position.lerp(
        target,
        0.09
    );


    const lookAt =
        car.position.clone();

    lookAt.y += 1;


    camera.lookAt(
        lookAt
    );
}


// ===============================
// OYUN DÖNGÜSÜ
// ===============================

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


camera.position.set(
    0,
    4,
    8
);


animate();


// ===============================
// EKRAN BOYUTU
// ===============================

window.addEventListener(
    "resize",
    function() {

        camera.aspect =
            innerWidth /
            innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            innerWidth,
            innerHeight
        );
    }
);
