// ============================================
// DRIVEWORLD
// Mobil açık dünya araba oyunu
// BMW GLB modeli
// ============================================

let scene;
let camera;
let renderer;

let car = null;

let clock;

let speed = 0;

let steering = 0;

let gasPressed = false;
let brakePressed = false;

let leftPressed = false;
let rightPressed = false;

let wheels = [];

const MAX_SPEED = 0.85;
const REVERSE_SPEED = 0.35;

const ACCELERATION = 0.018;
const BRAKE_POWER = 0.035;

const FRICTION = 0.008;

const TURN_SPEED = 0.035;

// ============================================
// BAŞLAT
// ============================================

window.addEventListener("load", init);

function init() {

    try {

        clock = new THREE.Clock();

        // SAHNE
        scene = new THREE.Scene();

        scene.background = new THREE.Color(0x87ceeb);

        scene.fog = new THREE.Fog(
            0x87ceeb,
            80,
            500
        );

        // KAMERA
        camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        camera.position.set(
            0,
            5,
            10
        );

        // RENDERER
        const canvas =
            document.getElementById("gameCanvas");

        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            powerPreference: "high-performance"
        });

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 1.5)
        );

        renderer.shadowMap.enabled = true;

        renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;

        // IŞIKLAR
        createLights();

        // DÜNYA
        createWorld();

        // ARABA
        loadCar();

        // KONTROLLER
        setupControls();

        // RESIZE
        window.addEventListener(
            "resize",
            onResize
        );

        animate();

    } catch (error) {

        console.error(error);

        showError(
            "Oyun başlatılamadı."
        );
    }
}

// ============================================
// IŞIK
// ============================================

function createLights() {

    const ambient =
        new THREE.HemisphereLight(
            0xffffff,
            0x555555,
            2
        );

    scene.add(ambient);

    const sun =
        new THREE.DirectionalLight(
            0xffffff,
            3
        );

    sun.position.set(
        100,
        150,
        100
    );

    sun.castShadow = true;

    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;

    sun.shadow.camera.left = -200;
    sun.shadow.camera.right = 200;
    sun.shadow.camera.top = 200;
    sun.shadow.camera.bottom = -200;

    scene.add(sun);
}

// ============================================
// DÜNYA
// ============================================

function createWorld() {

    // ZEMİN
    const groundGeometry =
        new THREE.PlaneGeometry(
            1000,
            1000
        );

    const groundMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x3d813b
        });

    const ground =
        new THREE.Mesh(
            groundGeometry,
            groundMaterial
        );

    ground.rotation.x =
        -Math.PI / 2;

    ground.receiveShadow = true;

    scene.add(ground);

    // ANA YOL
    createRoad(
        0,
        0,
        1000,
        18,
        0
    );

    // YAN YOLLAR
    createRoad(
        0,
        0,
        1000,
        14,
        Math.PI / 2
    );

    createRoad(
        0,
        120,
        700,
        12,
        0
    );

    createRoad(
        120,
        0,
        700,
        12,
        Math.PI / 2
    );

    // BİNALAR
    for (let x = -180; x <= 180; x += 45) {

        for (let z = -180; z <= 180; z += 45) {

            if (
                Math.abs(x) < 25 ||
                Math.abs(z) < 25
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
    for (let i = 0; i < 80; i++) {

        const x =
            (Math.random() - 0.5) * 700;

        const z =
            (Math.random() - 0.5) * 700;

        if (
            Math.abs(x) < 40 &&
            Math.abs(z) < 40
        ) {
            continue;
        }

        createTree(x, z);
    }
}

// ============================================
// YOL
// ============================================

function createRoad(
    x,
    z,
    length,
    width,
    rotation
) {

    const geometry =
        new THREE.PlaneGeometry(
            length,
            width
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x292929
        });

    const road =
        new THREE.Mesh(
            geometry,
            material
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

    road.receiveShadow = true;

    scene.add(road);

    // ŞERİT
    const lineMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        });

    for (
        let i = -length / 2;
        i < length / 2;
        i += 12
    ) {

        const lineGeometry =
            new THREE.PlaneGeometry(
                5,
                0.25
            );

        const line =
            new THREE.Mesh(
                lineGeometry,
                lineMaterial
            );

        line.rotation.x =
            -Math.PI / 2;

        line.rotation.z =
            rotation;

        if (rotation === 0) {

            line.position.set(
                x + i,
                0.04,
                z
            );

        } else {

            line.position.set(
                x,
                0.04,
                z + i
            );
        }

        scene.add(line);
    }
}

// ============================================
// BİNA
// ============================================

function createBuilding(
    x,
    z
) {

    const width =
        18 + Math.random() * 10;

    const depth =
        18 + Math.random() * 10;

    const height =
        15 + Math.random() * 45;

    const geometry =
        new THREE.BoxGeometry(
            width,
            height,
            depth
        );

    const material =
        new THREE.MeshStandardMaterial({
            color:
                new THREE.Color().setHSL(
                    Math.random(),
                    0.25,
                    0.5
                )
        });

    const building =
        new THREE.Mesh(
            geometry,
            material
        );

    building.position.set(
        x,
        height / 2,
        z
    );

    building.castShadow = true;

    building.receiveShadow = true;

    scene.add(building);
}

// ============================================
// AĞAÇ
// ============================================

function createTree(
    x,
    z
) {

    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.7,
                0.9,
                5
            ),
            new THREE.MeshStandardMaterial({
                color: 0x704214
            })
        );

    trunk.position.set(
        x,
        2.5,
        z
    );

    trunk.castShadow = true;

    scene.add(trunk);

    const leaves =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                3.5,
                12,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x176b2c
            })
        );

    leaves.position.set(
        x,
        7,
        z
    );

    leaves.castShadow = true;

    scene.add(leaves);
}

// ============================================
// BMW YÜKLE
// ============================================

function loadCar() {

    setLoading(
        "BMW hazırlanıyor...",
        20
    );

    if (
        typeof THREE.GLTFLoader ===
        "undefined"
    ) {

        showError(
            "GLTFLoader yüklenemedi."
        );

        return;
    }

    const loader =
        new THREE.GLTFLoader();

    loader.load(

        "./bmw.glb",

        function(gltf) {

            car = gltf.scene;

            // MODEL BOYUTU
            car.scale.set(
                1,
                1,
                1
            );

            car.position.set(
                0,
                0.2,
                0
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

                        // Tekerleri bul
                        const name =
                            object.name.toLowerCase();

                        if (
                            name.includes("wheel") ||
                            name.includes("tire") ||
                            name.includes("tyre")
                        ) {

                            wheels.push(
                                object
                            );
                        }
                    }
                }
            );

            scene.add(car);

            setLoading(
                "Dünya hazırlanıyor...",
                80
            );

            setTimeout(
                function() {

                    hideLoading();

                },
                500
            );
        },

        function(xhr) {

            if (xhr.total > 0) {

                const percent =
                    (xhr.loaded /
                        xhr.total) * 100;

                setLoading(
                    "BMW yükleniyor... " +
                    Math.round(percent) +
                    "%",
                    20 +
                    percent * 0.6
                );
            }
        },

        function(error) {

            console.error(
                "BMW yükleme hatası:",
                error
            );

            showError(
                "bmw.glb yüklenemedi. " +
                "Dosya adını kontrol et."
            );
        }
    );
}

// ============================================
// KONTROLLER
// ============================================

function setupControls() {

    const left =
        document.getElementById(
            "leftButton"
        );

    const right =
        document.getElementById(
            "rightButton"
        );

    const gas =
        document.getElementById(
            "gasButton"
        );

    const brake =
        document.getElementById(
            "brakeButton"
        );

    // SOL
    buttonHold(
        left,

        function() {
            leftPressed = true;
        },

        function() {
            leftPressed = false;
        }
    );

    // SAĞ
    buttonHold(
        right,

        function() {
            rightPressed = true;
        },

        function() {
            rightPressed = false;
        }
    );

    // GAZ
    buttonHold(
        gas,

        function() {
            gasPressed = true;
        },

        function() {
            gasPressed = false;
        }
    );

    // FREN
    buttonHold(
        brake,

        function() {
            brakePressed = true;
        },

        function() {
            brakePressed = false;
        }
    );
}

// ============================================
// BUTON BASILI TUTMA
// ============================================

function buttonHold(
    button,
    down,
    up
) {

    button.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            down();
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
        up
    );

    button.addEventListener(
        "pointerleave",
        function() {

            if (!button.hasPointerCapture) {
                up();
            }
        }
    );
}

// ============================================
// ARABA FİZİĞİ
// ============================================

function updateCar() {

    if (!car) {
        return;
    }

    // GAZ
    if (gasPressed) {

        speed += ACCELERATION;

        if (
            speed >
            MAX_SPEED
        ) {

            speed =
                MAX_SPEED;
        }
    }

    // FREN
    else if (brakePressed) {

        if (speed > 0) {

            speed -= BRAKE_POWER;

            if (speed < 0) {
                speed = 0;
            }

        } else {

            // Geri git
            speed -=
                ACCELERATION * 0.45;

            if (
                speed <
                -REVERSE_SPEED
            ) {

                speed =
                    -REVERSE_SPEED;
            }
        }
    }

    // SÜRTÜNME
    else {

        if (speed > 0) {

            speed -= FRICTION;

            if (speed < 0) {
                speed = 0;
            }

        } else if (speed < 0) {

            speed += FRICTION;

            if (speed > 0) {
                speed = 0;
            }
        }
    }

    // DİREKSİYON
    steering = 0;

    if (leftPressed) {
        steering = 1;
    }

    if (rightPressed) {
        steering = -1;
    }

    // DÖNÜŞ
    if (
        Math.abs(speed) >
        0.02
    ) {

        car.rotation.y +=
            steering *
            TURN_SPEED *
            (speed / MAX_SPEED);
    }

    // HAREKET
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

    // HAFİF SÜSPANSİYON
    car.position.y =
        0.2;

    // HIZ GÖSTERGESİ
    const kmh =
        Math.round(
            Math.abs(speed) *
            100
        );

    document.getElementById(
        "speed"
    ).textContent = kmh;

    // KAMERA
    updateCamera();
}

// ============================================
// TAKİP KAMERASI
// ============================================

function updateCamera() {

    if (!car) {
        return;
    }

    const cameraOffset =
        new THREE.Vector3(
            0,
            4.2,
            8
        );

    cameraOffset.applyQuaternion(
        car.quaternion
    );

    const targetPosition =
        car.position.clone()
            .add(cameraOffset);

    camera.position.lerp(
        targetPosition,
        0.08
    );

    const lookAt =
        car.position.clone();

    lookAt.y += 1.2;

    camera.lookAt(
        lookAt
    );
}

// ============================================
// ANİMASYON
// ============================================

function animate() {

    requestAnimationFrame(
        animate
    );

    if (!clock) {
        return;
    }

    updateCar();

    renderer.render(
        scene,
        camera
    );
}

// ============================================
// YÜKLEME EKRANI
// ============================================

function setLoading(
    text,
    progress
) {

    const textElement =
        document.getElementById(
            "loadingText"
        );

    const progressElement =
        document.getElementById(
            "loadingProgress"
        );

    if (textElement) {

        textElement.textContent =
            text;
    }

    if (progressElement) {

        progressElement.style.width =
            progress + "%";
    }
}

function hideLoading() {

    const loading =
        document.getElementById(
            "loading"
        );

    loading.style.opacity =
        "0";

    loading.style.transition =
        "opacity 0.5s ease";

    setTimeout(
        function() {

            loading.style.display =
                "none";

        },
        500
    );
}

function showError(
    message
) {

    const text =
        document.getElementById(
            "loadingText"
        );

    if (text) {

        text.textContent =
            message;

        text.style.color =
            "#ff5555";
    }

    const progress =
        document.getElementById(
            "loadingProgress"
        );

    if (progress) {

        progress.style.width =
            "100%";
    }
}

// ============================================
// EKRAN BOYUTU
// ============================================

function onResize() {

    if (!camera || !renderer) {
        return;
    }

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}
