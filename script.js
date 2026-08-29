import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 100, 420);

const camera = new THREE.PerspectiveCamera(
    65,
    innerWidth / innerHeight,
    0.1,
    700
);

const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: "high-performance"
});

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));

document.body.appendChild(renderer.domElement);


// =====================================
// IŞIK
// =====================================

scene.add(
    new THREE.HemisphereLight(
        0xffffff,
        0x667766,
        2
    )
);

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
    new THREE.PlaneGeometry(600, 600),
    new THREE.MeshLambertMaterial({
        color: 0x39833c
    })
);

ground.rotation.x = -Math.PI / 2;

scene.add(ground);


// =====================================
// YOL SİSTEMİ
// =====================================

function createRoad(
    width,
    length,
    x,
    z,
    rotation = 0
) {

    const road = new THREE.Mesh(
        new THREE.PlaneGeometry(width, length),
        new THREE.MeshLambertMaterial({
            color: 0x292929
        })
    );

    road.rotation.x = -Math.PI / 2;
    road.rotation.z = rotation;

    road.position.set(
        x,
        0.02,
        z
    );

    scene.add(road);
}


// Ana yollar

createRoad(
    18,
    600,
    0,
    0
);

createRoad(
    18,
    600,
    70,
    0
);

createRoad(
    18,
    600,
    -70,
    0
);

createRoad(
    600,
    18,
    0,
    70,
    Math.PI / 2
);

createRoad(
    600,
    18,
    0,
    -70,
    Math.PI / 2
);


// =====================================
// YOL ÇİZGİLERİ
// =====================================

function roadLine(
    x,
    z,
    horizontal = false
) {

    const line = new THREE.Mesh(
        new THREE.BoxGeometry(
            horizontal ? 6 : 0.18,
            0.035,
            horizontal ? 0.18 : 6
        ),
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        })
    );

    line.position.set(
        x,
        0.05,
        z
    );

    scene.add(line);
}


for (let z = -290; z < 290; z += 12) {

    roadLine(0, z);
    roadLine(70, z);
    roadLine(-70, z);
}


for (let x = -290; x < 290; x += 12) {

    roadLine(x, 70, true);
    roadLine(x, -70, true);
}


// =====================================
// BİNA OLUŞTURMA
// =====================================

function createBuilding(
    x,
    z,
    width,
    depth,
    height
) {

    const building = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(
            width,
            height,
            depth
        ),
        new THREE.MeshLambertMaterial({
            color:
                0x777777 +
                Math.floor(
                    Math.random() * 0x333333
                )
        })
    );

    body.position.y =
        height / 2;

    building.add(body);


    // Çatı

    const roof = new THREE.Mesh(
        new THREE.BoxGeometry(
            width + 0.15,
            0.15,
            depth + 0.15
        ),
        new THREE.MeshLambertMaterial({
            color: 0x444444
        })
    );

    roof.position.y =
        height + 0.08;

    building.add(roof);


    // Pencereler

    const windowMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x9bd7e8
        });


    const floors =
        Math.floor(height / 3);

    const windowsPerFloor =
        Math.max(
            2,
            Math.floor(width / 2)
        );


    for (
        let floor = 0;
        floor < floors;
        floor++
    ) {

        for (
            let w = 0;
            w < windowsPerFloor;
            w++
        ) {

            const window = new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.5,
                    0.7,
                    0.04
                ),
                windowMaterial
            );

            const wx =
                -width / 2 +
                0.8 +
                w * 1.4;

            const wy =
                1.5 +
                floor * 3;

            window.position.set(
                wx,
                wy,
                -depth / 2 - 0.03
            );

            building.add(window);
        }
    }


    building.position.set(
        x,
        0,
        z
    );

    scene.add(building);
}


// =====================================
// ŞEHİR BLOKLARI
// =====================================

const buildingPositions = [
    [-38, -38],
    [-12, -40],
    [35, -40],
    [58, -38],

    [-40, -12],
    [38, -12],

    [-40, 35],
    [-12, 38],
    [35, 38],
    [58, 35],

    [-105, -35],
    [-105, 10],
    [-105, 65],

    [105, -35],
    [105, 10],
    [105, 65],

    [-35, 105],
    [10, 105],
    [60, 105],

    [-35, -105],
    [10, -105],
    [60, -105]
];


for (
    const [x, z]
    of buildingPositions
) {

    const width =
        8 +
        Math.random() * 6;

    const depth =
        8 +
        Math.random() * 6;

    const height =
        8 +
        Math.random() * 18;

    createBuilding(
        x,
        z,
        width,
        depth,
        height
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
            1.4,
            8,
            8
        ),
        new THREE.MeshLambertMaterial({
            color: 0x23752c
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
    let x = -280;
    x <= 280;
    x += 25
) {

    createTree(
        x,
        18
    );

    createTree(
        x,
        -18
    );
}


// =====================================
// CIVIC TARZI ARABA
// =====================================

const car = new THREE.Group();


// Gövde

const body = new THREE.Mesh(
    new THREE.BoxGeometry(
        2.25,
        0.65,
        4.5
    ),
    new THREE.MeshLambertMaterial({
        color: 0xffffff
    })
);

body.position.y = 0.72;

car.add(body);


// Kaput

const hood = new THREE.Mesh(
    new THREE.BoxGeometry(
        2.05,
        0.25,
        1.25
    ),
    new THREE.MeshLambertMaterial({
        color: 0xffffff
    })
);

hood.position.set(
    0,
    1.05,
    -1.55
);

car.add(hood);


// Tavan

const roof = new THREE.Mesh(
    new THREE.BoxGeometry(
        1.72,
        0.62,
        2.15
    ),
    new THREE.MeshLambertMaterial({
        color: 0xffffff
    })
);

roof.position.set(
    0,
    1.34,
    0
);

car.add(roof);


// Camlar

function createWindow(
    x,
    y,
    z,
    sx,
    sy,
    sz
) {

    const window = new THREE.Mesh(
        new THREE.BoxGeometry(
            sx,
            sy,
            sz
        ),
        new THREE.MeshBasicMaterial({
            color: 0x172a38
        })
    );

    window.position.set(
        x,
        y,
        z
    );

    car.add(window);
}


createWindow(
    0,
    1.38,
    -1.03,
    1.55,
    0.42,
    0.06
);

createWindow(
    0,
    1.38,
    1.05,
    1.55,
    0.42,
    0.06
);

createWindow(
    -0.87,
    1.38,
    0,
    0.04,
    0.42,
    1.4
);

createWindow(
    0.87,
    1.38,
    0,
    0.04,
    0.42,
    1.4
);


// Aynalar

function createMirror(x) {

    const mirror = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.18,
            0.18,
            0.35
        ),
        new THREE.MeshLambertMaterial({
            color: 0x111111
        })
    );

    mirror.position.set(
        x,
        1.25,
        -0.75
    );

    car.add(mirror);
}

createMirror(-1.15);
createMirror(1.15);


// Farlar

function createLamp(
    x,
    z,
    color
) {

    const lamp = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.4,
            0.18,
            0.08
        ),
        new THREE.MeshBasicMaterial({
            color
        })
    );

    lamp.position.set(
        x,
        0.88,
        z
    );

    car.add(lamp);
}

createLamp(
    -0.72,
    -2.27,
    0xffffff
);

createLamp(
    0.72,
    -2.27,
    0xffffff
);

createLamp(
    -0.72,
    2.27,
    0xff1111
);

createLamp(
    0.72,
    2.27,
    0xff1111
);


// =====================================
// TEKERLEKLER
// =====================================

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
            color: 0x101010
        })
    );

    tire.rotation.z =
        Math.PI / 2;

    wheel.add(tire);


    const rim = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.23,
            0.23,
            0.34,
            12
        ),
        new THREE.MeshLambertMaterial({
            color: 0xc5c5c5
        })
    );

    rim.rotation.z =
        Math.PI / 2;

    wheel.add(rim);


    wheel.position.set(
        x,
        0.47,
        z
    );

    car.add(wheel);

    wheels.push(wheel);
}


createWheel(-1.18, -1.43);
createWheel(1.18, -1.43);
createWheel(-1.18, 1.43);
createWheel(1.18, 1.43);


scene.add(car);


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
    document.getElementById(
        "wheel-ring"
    );


// Gaz

gasButton.addEventListener(
    "touchstart",
    e => {
        e.preventDefault();
        gas = true;
    },
    { passive: false }
);

gasButton.addEventListener(
    "touchend",
    e => {
        e.preventDefault();
        gas = false;
    },
    { passive: false }
);


// Fren

brakeButton.addEventListener(
    "touchstart",
    e => {
        e.preventDefault();
        brake = true;
    },
    { passive: false }
);

brakeButton.addEventListener(
    "touchend",
    e => {
        e.preventDefault();
        brake = false;
    },
    { passive: false }
);


// =====================================
// DİREKSİYON
// =====================================

let startX = null;
let startSteering = 0;


wheel.addEventListener(
    "touchstart",
    e => {

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
    e => {

        e.preventDefault();

        if (startX === null)
            return;

        const x =
            e.touches[0].clientX;

        steering =
            THREE.MathUtils.clamp(
                startSteering +
                (x - startX) / 70,
                -1,
                1
            );

        wheel.style.transform =
            `rotate(${steering * 80}deg)`;

    },
    { passive: false }
);


function resetSteering() {

    startX = null;

    steering *= 0.65;

    if (
        Math.abs(steering) < 0.05
    ) {
        steering = 0;
    }

    wheel.style.transform =
        `rotate(${steering * 80}deg)`;
}


wheel.addEventListener(
    "touchend",
    resetSteering
);

wheel.addEventListener(
    "touchcancel",
    resetSteering
);


// =====================================
// ARABA FİZİĞİ
// =====================================

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


    if (
        Math.abs(speed) > 0.02
    ) {

        car.rotation.y -=
            steering *
            0.035 *
            speed;
    }


    car.translateZ(-speed);


    for (
        const wheel of wheels
    ) {

        wheel.rotation.x -=
            speed * 2.5;
    }


    document.getElementById(
        "speed"
    ).textContent =
        Math.round(speed * 85);
}


// =====================================
// KAMERA
// =====================================

function updateCamera() {

    const offset =
        new THREE.Vector3(
            0,
            4.5,
            8.5
        );

    offset.applyMatrix4(
        car.matrixWorld
    );

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


// =====================================
// BAŞLAT
// =====================================

camera.position.set(
    0,
    4,
    8
);

document.getElementById(
    "loading"
).style.display = "none";


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


window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            innerWidth / innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            innerWidth,
            innerHeight
        );
    }
);
