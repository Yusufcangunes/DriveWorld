import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import { GLTFLoader } from
"https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js";


/* =====================================
   SAHNE
===================================== */

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x87ceeb);

scene.fog =
    new THREE.Fog(
        0x87ceeb,
        120,
        500
    );


/* =====================================
   KAMERA
===================================== */

const camera =
    new THREE.PerspectiveCamera(
        65,
        innerWidth / innerHeight,
        0.1,
        1000
    );


/* =====================================
   RENDERER
===================================== */

const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        powerPreference:
            "high-performance"
    });

renderer.setSize(
    innerWidth,
    innerHeight
);

renderer.setPixelRatio(
    Math.min(
        devicePixelRatio,
        1.5
    )
);

document.body.appendChild(
    renderer.domElement
);


/* =====================================
   IŞIK
===================================== */

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
        2
    );

sun.position.set(
    100,
    150,
    100
);

scene.add(sun);


/* =====================================
   ZEMİN
===================================== */

const ground =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            1000,
            1000
        ),
        new THREE.MeshLambertMaterial({
            color: 0x3d8b40
        })
    );

ground.rotation.x =
    -Math.PI / 2;

scene.add(ground);


/* =====================================
   YOL
===================================== */

function road(
    width,
    length,
    x,
    z,
    rotation = 0
) {

    const object =
        new THREE.Mesh(
            new THREE.PlaneGeometry(
                width,
                length
            ),
            new THREE.MeshLambertMaterial({
                color: 0x292929
            })
        );

    object.rotation.x =
        -Math.PI / 2;

    object.rotation.z =
        rotation;

    object.position.set(
        x,
        0.02,
        z
    );

    scene.add(object);
}

road(22, 1000, 0, 0);
road(22, 1000, 80, 0);
road(22, 1000, -80, 0);

road(
    1000,
    22,
    0,
    80,
    Math.PI / 2
);

road(
    1000,
    22,
    0,
    -80,
    Math.PI / 2
);


/* =====================================
   BİNA
===================================== */

function building(
    x,
    z,
    width,
    depth,
    height
) {

    const object =
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

    object.position.set(
        x,
        height / 2,
        z
    );

    scene.add(object);
}


const buildings = [
    [-40,-40],
    [-15,-40],
    [35,-40],
    [55,-40],

    [-40,-15],
    [40,-15],

    [-40,35],
    [-15,40],
    [35,40],
    [55,35],

    [-120,-40],
    [-120,10],
    [-120,60],

    [120,-40],
    [120,10],
    [120,60],

    [-40,120],
    [10,120],
    [60,120],

    [-40,-120],
    [10,-120],
    [60,-120]
];


for (
    const position
    of buildings
) {

    building(
        position[0],
        position[1],

        10 +
        Math.random() * 7,

        10 +
        Math.random() * 7,

        10 +
        Math.random() * 25
    );
}


/* =====================================
   BMW
===================================== */

let car = null;

const loader =
    new GLTFLoader();

const loading =
    document.getElementById(
        "loading"
    );

const loadingText =
    document.getElementById(
        "loadingText"
    );


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

        car.rotation.y =
            Math.PI;


        car.traverse(
            function(object) {

                if (
                    object.isMesh
                ) {

                    object.castShadow =
                        true;

                    object.receiveShadow =
                        true;
                }
            }
        );


        scene.add(car);


        loading.style.display =
            "none";


        console.log(
            "BMW M4 yüklendi."
        );
    },


    function() {

        if (loadingText) {

            loadingText.textContent =
                "BMW yükleniyor...";
        }
    },


    function(error) {

        console.error(
            error
        );

        if (loadingText) {

            loadingText.textContent =
                "BMW dosyası yüklenemedi.";
        }


        setTimeout(
            function() {

                loading.style.display =
                    "none";

            },
            1500
        );
    }
);


/* =====================================
   KONTROLLER
===================================== */

let gas = false;
let brake = false;

let steering = 0;


const gasButton =
    document.getElementById(
        "gas"
    );

const brakeButton =
    document.getElementById(
        "brake"
    );

const leftButton =
    document.getElementById(
        "left"
    );

const rightButton =
    document.getElementById(
        "right"
    );


function pressGas(e) {

    e.preventDefault();

    gas = true;
}

function releaseGas(e) {

    e.preventDefault();

    gas = false;
}


function pressBrake(e) {

    e.preventDefault();

    brake = true;
}

function releaseBrake(e) {

    e.preventDefault();

    brake = false;
}


gasButton.addEventListener(
    "touchstart",
    pressGas,
    { passive:false }
);

gasButton.addEventListener(
    "touchend",
    releaseGas,
    { passive:false }
);


brakeButton.addEventListener(
    "touchstart",
    pressBrake,
    { passive:false }
);

brakeButton.addEventListener(
    "touchend",
    releaseBrake,
    { passive:false }
);


/* Sol */

leftButton.addEventListener(
    "touchstart",
    function(e) {

        e.preventDefault();

        steering = -1;
    },
    { passive:false }
);

leftButton.addEventListener(
    "touchend",
    function(e) {

        e.preventDefault();

        steering = 0;
    },
    { passive:false }
);


/* Sağ */

rightButton.addEventListener(
    "touchstart",
    function(e) {

        e.preventDefault();

        steering = 1;
    },
    { passive:false }
);

rightButton.addEventListener(
    "touchend",
    function(e) {

        e.preventDefault();

        steering = 0;
    },
    { passive:false }
);


/* =====================================
   ARABA FİZİĞİ
===================================== */

let speed = 0;

const maxSpeed = 1.8;
const acceleration = 0.02;
const braking = 0.06;


function updateCar() {

    if (!car) {
        return;
    }


    if (gas) {

        speed +=
            acceleration;

        if (
            speed > maxSpeed
        ) {

            speed =
                maxSpeed;
        }
    }


    if (brake) {

        speed -=
            braking;

        if (
            speed < 0
        ) {

            speed = 0;
        }
    }


    speed *= 0.988;


    if (
        Math.abs(speed) > 0.01
    ) {

        car.rotation.y -=
            steering *
            speed *
            0.035;
    }


    car.translateZ(
        -speed
    );


    const speedElement =
        document.getElementById(
            "speed"
        );

    speedElement.textContent =
        Math.round(
            speed * 85
        );
}


/* =====================================
   KAMERA
===================================== */

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


    camera.lookAt(
        target
    );
}


/* =====================================
   OYUN DÖNGÜSÜ
===================================== */

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


/* =====================================
   EKRAN
===================================== */

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
