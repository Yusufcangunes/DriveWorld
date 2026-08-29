import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js";


// ==============================
// SAHNE
// ==============================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

scene.fog = new THREE.Fog(
    0x87ceeb,
    80,
    500
);


// ==============================
// KAMERA
// ==============================

const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 5, 10);


// ==============================
// RENDERER
// ==============================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.5)
);

document.body.appendChild(renderer.domElement);


// ==============================
// IŞIK
// ==============================

const light = new THREE.HemisphereLight(
    0xffffff,
    0x555555,
    2
);

scene.add(light);

const sun = new THREE.DirectionalLight(
    0xffffff,
    2
);

sun.position.set(100, 150, 100);

scene.add(sun);


// ==============================
// ÇİM
// ==============================

const grass = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshLambertMaterial({
        color: 0x3f8f3f
    })
);

grass.rotation.x = -Math.PI / 2;

scene.add(grass);


// ==============================
// YOL
// ==============================

function createRoad(
    width,
    length,
    x,
    z,
    rotation = 0
) {

    const road = new THREE.Mesh(
        new THREE.PlaneGeometry(
            width,
            length
        ),
        new THREE.MeshLambertMaterial({
            color: 0x292929
        })
    );

    road.rotation.x = -Math.PI / 2;

    road.rotation.z = rotation;

    road.position.set(
        x,
        0.03,
        z
    );

    scene.add(road);
}


// Ana yollar

createRoad(20, 1000, 0, 0);

createRoad(20, 1000, 80, 0);

createRoad(20, 1000, -80, 0);

createRoad(
    1000,
    20,
    0,
    80,
    Math.PI / 2
);

createRoad(
    1000,
    20,
    0,
    -80,
    Math.PI / 2
);


// ==============================
// BİNALAR
// ==============================

function createBuilding(
    x,
    z,
    width,
    depth,
    height
) {

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
}


// Şehir

const buildings = [
    [-45, -45],
    [-20, -45],
    [25, -45],
    [50, -45],

    [-45, 40],
    [-20, 40],
    [25, 40],
    [50, 40],

    [-130, -50],
    [-130, 0],
    [-130, 50],

    [130, -50],
    [130, 0],
    [130, 50],

    [-40, 130],
    [10, 130],
    [60, 130],

    [-40, -130],
    [10, -130],
    [60, -130]
];

for (const pos of buildings) {

    createBuilding(
        pos[0],
        pos[1],
        12,
        12,
        15 + Math.random() * 20
    );
}


// ==============================
// BMW
// ==============================

let car = null;

const loader = new GLTFLoader();

const loading =
    document.getElementById("loading");

const loadingText =
    document.getElementById("loadingText");


loadingText.textContent =
    "BMW yükleniyor...";


loader.load(

    "./2021_bmw_m4_competition.glb",

    function(gltf) {

        car = gltf.scene;

        car.position.set(
            0,
            0,
            0
        );

        car.rotation.y =
            Math.PI;


        // Model boyutu

        car.scale.set(
            1,
            1,
            1
        );


        scene.add(car);


        console.log(
            "BMW başarıyla yüklendi!"
        );


        // Yükleme ekranını kapat

        loading.style.display =
            "none";
    },


    function(xhr) {

        if (xhr.total > 0) {

            const percent =
                Math.round(
                    xhr.loaded /
                    xhr.total *
                    100
                );

            loadingText.textContent =
                "BMW yükleniyor %"
                + percent;
        }
    },


    function(error) {

        console.error(
            "BMW yüklenemedi:",
            error
        );

        loadingText.textContent =
            "BMW dosyası bulunamadı!";

        setTimeout(() => {

            loading.style.display =
                "none";

        }, 2000);
    }
);


// ==============================
// MOBİL KONTROLLER
// ==============================

let gas = false;
let brake = false;

let left = false;
let right = false;


// GAZ

const gasButton =
    document.getElementById("gas");

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


// FREN

const brakeButton =
    document.getElementById("brake");

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


// SOL

const leftButton =
    document.getElementById("left");

leftButton.addEventListener(
    "touchstart",
    function(e) {

        e.preventDefault();

        left = true;
    },
    { passive: false }
);

leftButton.addEventListener(
    "touchend",
    function(e) {

        e.preventDefault();

        left = false;
    },
    { passive: false }
);


// SAĞ

const rightButton =
    document.getElementById("right");

rightButton.addEventListener(
    "touchstart",
    function(e) {

        e.preventDefault();

        right = true;
    },
    { passive: false }
);

rightButton.addEventListener(
    "touchend",
    function(e) {

        e.preventDefault();

        right = false;
    },
    { passive: false }
);


// ==============================
// ARABA FİZİĞİ
// ==============================

let speed = 0;

const maxSpeed = 1.8;

const acceleration = 0.025;

const braking = 0.08;


function updateCar() {

    if (!car) return;


    // Gaz

    if (gas) {

        speed += acceleration;

        if (speed > maxSpeed) {

            speed = maxSpeed;
        }
    }


    // Fren

    if (brake) {

        speed -= braking;

        if (speed < 0) {

            speed = 0;
        }
    }


    // Sürtünme

    if (!gas && !brake) {

        speed *= 0.98;
    }


    // Direksiyon

    if (left) {

        car.rotation.y +=
            speed * 0.035;
    }

    if (right) {

        car.rotation.y -=
            speed * 0.035;
    }


    // Hareket

    car.translateZ(
        -speed
    );


    // Hız

    const speedElement =
        document.getElementById("speed");

    speedElement.textContent =
        Math.round(
            speed * 80
        );
}


// ==============================
// KAMERA
// ==============================

function updateCamera() {

    if (!car) return;


    const cameraOffset =
        new THREE.Vector3(
            0,
            4.5,
            8
        );


    cameraOffset.applyQuaternion(
        car.quaternion
    );


    cameraOffset.add(
        car.position
    );


    camera.position.lerp(
        cameraOffset,
        0.1
    );


    const target =
        car.position.clone();

    target.y += 1;


    camera.lookAt(
        target
    );
}


// ==============================
// OYUN DÖNGÜSÜ
// ==============================

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


// ==============================
// EKRAN BOYUTU
// ==============================

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
