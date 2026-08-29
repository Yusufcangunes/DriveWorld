import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import { GLTFLoader } from
"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";


let scene;
let camera;
let renderer;

let car = null;

let speed = 0;

let gas = false;
let brake = false;
let left = false;
let right = false;


const MAX_SPEED = 1.2;
const ACCELERATION = 0.025;
const BRAKE_POWER = 0.06;
const FRICTION = 0.012;


const loading =
    document.getElementById("loading");

const loadingText =
    document.getElementById("loadingText");

const loadingProgress =
    document.getElementById("loadingProgress");


/* =========================
   BAŞLAT
========================= */

start();


function start() {

    scene =
        new THREE.Scene();

    scene.background =
        new THREE.Color(0x87ceeb);

    scene.fog =
        new THREE.Fog(
            0x87ceeb,
            100,
            500
        );


    camera =
        new THREE.PerspectiveCamera(
            65,
            window.innerWidth /
            window.innerHeight,
            0.1,
            1000
        );


    renderer =
        new THREE.WebGLRenderer({
            canvas:
                document.getElementById(
                    "gameCanvas"
                ),
            antialias: true
        });


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            1.5
        )
    );


    createLights();

    createWorld();

    loadBMW();

    controls();

    window.addEventListener(
        "resize",
        resize
    );

    animate();
}


/* =========================
   IŞIK
========================= */

function createLights() {

    const skyLight =
        new THREE.HemisphereLight(
            0xffffff,
            0x555555,
            2
        );

    scene.add(skyLight);


    const sun =
        new THREE.DirectionalLight(
            0xffffff,
            2.5
        );

    sun.position.set(
        100,
        150,
        100
    );

    scene.add(sun);
}


/* =========================
   DÜNYA
========================= */

function createWorld() {

    loadingText.textContent =
        "Dünya hazırlanıyor...";

    loadingProgress.style.width =
        "20%";


    // ÇİM

    const ground =
        new THREE.Mesh(
            new THREE.PlaneGeometry(
                1000,
                1000
            ),
            new THREE.MeshStandardMaterial({
                color: 0x3d8b40
            })
        );

    ground.rotation.x =
        -Math.PI / 2;

    scene.add(ground);


    // ANA YOLLAR

    createRoad(
        0,
        0,
        1000,
        20,
        0
    );

    createRoad(
        0,
        0,
        1000,
        20,
        Math.PI / 2
    );


    // BİNALAR

    for (
        let x = -180;
        x <= 180;
        x += 45
    ) {

        for (
            let z = -180;
            z <= 180;
            z += 45
        ) {

            if (
                Math.abs(x) < 35 ||
                Math.abs(z) < 35
            ) {

                continue;
            }

            createBuilding(
                x,
                z
            );
        }
    }


    // AĞAÇLAR

    for (
        let i = 0;
        i < 50;
        i++
    ) {

        const x =
            (Math.random() - 0.5) *
            700;

        const z =
            (Math.random() - 0.5) *
            700;

        createTree(
            x,
            z
        );
    }


    loadingProgress.style.width =
        "55%";
}


/* =========================
   YOL
========================= */

function createRoad(
    x,
    z,
    length,
    width,
    rotation
) {

    const road =
        new THREE.Mesh(
            new THREE.PlaneGeometry(
                length,
                width
            ),
            new THREE.MeshStandardMaterial({
                color: 0x292929
            })
        );

    road.rotation.x =
        -Math.PI / 2;

    road.rotation.z =
        rotation;

    road.position.set(
        x,
        0.02,
        z
    );

    scene.add(road);
}


/* =========================
   BİNA
========================= */

function createBuilding(
    x,
    z
) {

    const height =
        15 +
        Math.random() * 35;

    const building =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                18,
                height,
                18
            ),
            new THREE.MeshStandardMaterial({
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


/* =========================
   AĞAÇ
========================= */

function createTree(
    x,
    z
) {

    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.6,
                0.8,
                4
            ),
            new THREE.MeshStandardMaterial({
                color: 0x704214
            })
        );

    trunk.position.set(
        x,
        2,
        z
    );

    scene.add(trunk);


    const leaves =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                3,
                12,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x176b2c
            })
        );

    leaves.position.set(
        x,
        6,
        z
    );

    scene.add(leaves);
}


/* =========================
   BMW
========================= */

function loadBMW() {

    loadingText.textContent =
        "BMW yükleniyor...";

    loadingProgress.style.width =
        "60%";


    const loader =
        new GLTFLoader();


    loader.load(

        "./bmw.glb",


        function(gltf) {

            car =
                gltf.scene;


            car.position.set(
                0,
                0.2,
                0
            );


            car.rotation.y =
                Math.PI;


            car.scale.set(
                1,
                1,
                1
            );


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


            loadingProgress.style.width =
                "100%";

            loadingText.textContent =
                "Oyun hazır!";


            setTimeout(
                function() {

                    loading.style.display =
                        "none";

                },
                500
            );
        },


        function(xhr) {

            if (
                xhr.total > 0
            ) {

                const percent =
                    Math.round(
                        xhr.loaded /
                        xhr.total *
                        100
                    );

                loadingText.textContent =
                    "BMW yükleniyor %" +
                    percent;

                loadingProgress.style.width =
                    (60 +
                    percent * 0.4) +
                    "%";
            }
        },


        function(error) {

            console.error(
                error
            );

            loadingText.textContent =
                "BMW yüklenemedi!";

            loadingProgress.style.width =
                "100%";
        }
    );
}


/* =========================
   MOBİL KONTROLLER
========================= */

function controls() {

    hold(
        "gasButton",
        function() {
            gas = true;
        },
        function() {
            gas = false;
        }
    );


    hold(
        "brakeButton",
        function() {
            brake = true;
        },
        function() {
            brake = false;
        }
    );


    hold(
        "leftButton",
        function() {
            left = true;
        },
        function() {
            left = false;
        }
    );


    hold(
        "rightButton",
        function() {
            right = true;
        },
        function() {
            right = false;
        }
    );
}


/* =========================
   BUTON
========================= */

function hold(
    id,
    down,
    up
) {

    const button =
        document.getElementById(id);


    button.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            down();

            button.setPointerCapture(
                event.pointerId
            );
        }
    );


    button.addEventListener(
        "pointerup",
        function(event) {

            event.preventDefault();

            up();
        }
    );


    button.addEventListener(
        "pointercancel",
        function() {

            up();
        }
    );
}


/* =========================
   ARABA
========================= */

function updateCar() {

    if (!car) {
        return;
    }


    // GAZ

    if (gas) {

        speed +=
            ACCELERATION;

        if (
            speed >
            MAX_SPEED
        ) {

            speed =
                MAX_SPEED;
        }
    }


    // FREN

    if (brake) {

        speed -=
            BRAKE_POWER;

        if (
            speed < 0
        ) {

            speed = 0;
        }
    }


    // SÜRTÜNME

    if (
        !gas &&
        !brake
    ) {

        speed -=
            FRICTION;

        if (
            speed < 0
        ) {

            speed = 0;
        }
    }


    // DİREKSİYON

    if (
        speed > 0.02
    ) {

        if (left) {

            car.rotation.y +=
                0.035 * speed;
        }

        if (right) {

            car.rotation.y -=
                0.035 * speed;
        }
    }


    // İLERİ

    const direction =
        new THREE.Vector3(
            0,
            0,
            -1
        );


    direction.applyQuaternion(
        car.quaternion
    );


    car.position.add(
        direction.multiplyScalar(
            speed
        )
    );


    // HIZ

    document.getElementById(
        "speed"
    ).textContent =
        Math.round(
            speed * 120
        );


    updateCamera();
}


/* =========================
   KAMERA
========================= */

function updateCamera() {

    if (!car) {
        return;
    }


    const offset =
        new THREE.Vector3(
            0,
            4.5,
            8
        );


    offset.applyQuaternion(
        car.quaternion
    );


    const target =
        car.position.clone()
            .add(offset);


    camera.position.lerp(
        target,
        0.08
    );


    const look =
        car.position.clone();


    look.y += 1;


    camera.lookAt(
        look
    );
}


/* =========================
   OYUN
========================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    updateCar();


    renderer.render(
        scene,
        camera
    );
}


/* =========================
   RESIZE
========================= */

function resize() {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}
