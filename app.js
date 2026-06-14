// --- THREE.JS ENGINE SETUP ---
const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();

// PERBAIKAN KABUT
scene.fog = new THREE.FogExp2("#030914", 0.02);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 6;

// PERBAIKAN RENDERER
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// PENCAHAYAAN LEMBUT
const ambientLight = new THREE.AmbientLight(0xffffff, 1.8); 
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 0.5); 
sunLight.position.set(7, 4, 4);
scene.add(sunLight);


// SISTEM KOSMIK

const particleCount = 1800; 
const particleGeo = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 25;     
    particlePositions[i + 1] = (Math.random() - 0.5) * 25; 
    particlePositions[i + 2] = (Math.random() - 0.5) * 20; 
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

const particleMat = new THREE.PointsMaterial({
    color: "#d4af37",
    size: 0.03, 
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});
const partikelEmas = new THREE.Points(particleGeo, particleMat);
scene.add(partikelEmas);

const meteorCount = 8;
const meteors = [];
const meteorMat = new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.4 });

for (let i = 0; i < meteorCount; i++) {
    const meteorGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-0.5, 0.5, 0)
    ]);
    const meteorLine = new THREE.Line(meteorGeo, meteorMat);
    resetMeteor(meteorLine);
    scene.add(meteorLine);
    meteors.push(meteorLine);
}

function resetMeteor(meteor) {
    meteor.position.set(
        (Math.random() - 0.3) * 15,
        (Math.random() + 0.2) * 10,
        (Math.random() - 0.5) * 10
    );
    meteor.scale.setScalar(Math.random() * 0.8 + 0.2);
    meteor.speed = Math.random() * 0.12 + 0.04;
}


// OBJEK 3D UTAMA: MATTE SURFACE PLANET
const loadingGeo = new THREE.TorusKnotGeometry(1.3, 0.3, 120, 16);
const loadingMat = new THREE.MeshBasicMaterial({ color: "#b59410", wireframe: true, transparent: true, opacity: 0.25 });
const loadingObj = new THREE.Mesh(loadingGeo, loadingMat);
scene.add(loadingObj);

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('earth.jpg'); 

const earthGeo = new THREE.SphereGeometry(1.8, 64, 64); 
const earthMat = new THREE.MeshPhongMaterial({
    map: earthTexture,            
    specular: new THREE.Color('#000000'), 
    shininess: 0
});

const modelUtama = new THREE.Mesh(earthGeo, earthMat);
modelUtama.visible = false;    
scene.add(modelUtama);


// PROGRESS LOADING OTOMATIS
let progress = 0;
const progressBar = document.getElementById('progress-bar');
const intervalLoading = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 6;
    if (progress >= 100) {
        progress = 100;
        clearInterval(intervalLoading);
        
        gsap.to("#loader-title", { opacity: 0, y: -50, duration: 0.6 });
        gsap.to("#progress-container, .loading-text", { opacity: 0, duration: 0.3 });
        gsap.to("#loader-wrapper", { 
            scaleX: 0, duration: 1.0, delay: 0.3, ease: "power4.inOut",
            onComplete: () => {
                document.getElementById('loader-wrapper').style.display = 'none';
                document.getElementById('main-nav').classList.add('active');
                gsap.set("section", { visibility: "visible" });
                
                const homeBox = document.querySelector("#home .content-box");
                gsap.to(homeBox, { opacity: 1, duration: 0.15 });
            }
        });
    }
    progressBar.style.width = progress + '%';
}, 120);


// INTERAKSI MOUSE PARALAKS ---
let mouseX = 0; let mouseY = 0;
let targetX = 0; let targetY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
});
document.addEventListener('touchmove', (e) => {
    mouseX = (e.touches[0].clientX / window.innerWidth) - 0.5;
    mouseY = (e.touches[0].clientY / window.innerHeight) - 0.5;
});



// ENGINE ANIMATION LOOP
let clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    particleMat.opacity = 0.5 + Math.sin(elapsedTime * 2.0) * 0.15;

    meteors.forEach(meteor => {
        meteor.position.x += meteor.speed;
        meteor.position.y -= meteor.speed; 
        
        if (meteor.position.y < -10 || meteor.position.x > 10) {
            resetMeteor(meteor);
        }
    });

    partikelEmas.rotation.y = elapsedTime * 0.003;
    
    const rotSpeed = 2.0;
    loadingObj.rotation.y += (targetX * rotSpeed - loadingObj.rotation.y) * 0.05;
    loadingObj.rotation.x += (targetY * rotSpeed - loadingObj.rotation.x) * 0.05;

    if (modelUtama) {
        modelUtama.rotation.y = (elapsedTime * 0.12) + (targetX * rotSpeed); 
        modelUtama.rotation.x = (elapsedTime * 0.03) + (targetY * rotSpeed);
        
        if(document.getElementById('loader-wrapper').style.display === 'none') {
            loadingObj.visible = false;
            modelUtama.visible = true; 
        }
    }
    renderer.render(scene, camera);
}
animate();



// SCROLL ENGINE INSTAN TANPA BENTROK CSS
let targetScale = 1.5;
window.addEventListener('scroll', () => {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    targetScale = 1.5 + (scrollPercent * 0.6); 

    partikelEmas.position.z = scrollPercent * 5;

    document.querySelectorAll('section').forEach(sec => {
        const box = sec.querySelector('.content-box');
        const rect = sec.getBoundingClientRect();
        
        if (rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15) {
            gsap.to(box, { opacity: 1, duration: 0.12, overwrite: "auto" });
            
            const id = sec.id;
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            if (id.includes('porto')) document.querySelectorAll('.nav-btn')[1].classList.add('active');
            else if (id.includes('biz')) document.querySelectorAll('.nav-btn')[2].classList.add('active');
            else if (id === 'contact') document.querySelectorAll('.nav-btn')[3].classList.add('active');
            else document.querySelectorAll('.nav-btn')[0].classList.add('active');
        } else {
            gsap.to(box, { opacity: 0, duration: 0.1, overwrite: "auto" });
        }
    });

    if(loadingObj) loadingObj.scale.setScalar(targetScale);
    if(modelUtama) modelUtama.scale.setScalar(targetScale);
});

function jumpToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});