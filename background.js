// Three.js Background Animation
let scene, camera, renderer;
let particles, geometry, materials = [], parameters;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
    // Create scene
    scene = new THREE.Scene();
    
    // Set up camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 1000;
    
    // Create geometry for particles
    geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    // Create particles
    const textureLoader = new THREE.TextureLoader();
    const sprite = textureLoader.load('https://threejs.org/examples/textures/sprites/disc.png');
    
    // Create different particle groups with different colors and sizes
    for (let i = 0; i < 1000; i++) {
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;
        
        vertices.push(x, y, z);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    // Create materials with different colors
    parameters = [
        [[0.6, 0.2, 0.8], 4],
        [[0.4, 0.2, 0.9], 3],
        [[0.3, 0.2, 0.7], 2],
        [[0.5, 0.3, 0.8], 1]
    ];
    
    for (let i = 0; i < parameters.length; i++) {
        const color = parameters[i][0];
        const size = parameters[i][1];
        
        materials[i] = new THREE.PointsMaterial({
            size: size,
            map: sprite,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            opacity: 0.6,
            color: new THREE.Color(color[0], color[1], color[2])
        });
        
        const particles = new THREE.Points(geometry, materials[i]);
        particles.rotation.x = Math.random() * 6;
        particles.rotation.y = Math.random() * 6;
        particles.rotation.z = Math.random() * 6;
        
        scene.add(particles);
    }
    
    // Set up renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0f172a, 1);
    
    // Add renderer to DOM
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Add event listeners
    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    // Rotate camera based on mouse position
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Rotate particle systems
    const time = Date.now() * 0.00005;
    
    for (let i = 0; i < scene.children.length; i++) {
        const object = scene.children[i];
        
        if (object instanceof THREE.Points) {
            object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
        }
    }
    
    // Update materials
    for (let i = 0; i < materials.length; i++) {
        const color = parameters[i][0];
        const h = (360 * (color[0] + time) % 360) / 360;
        materials[i].color.setHSL(h, color[1], color[2]);
    }
    
    renderer.render(scene, camera);
}