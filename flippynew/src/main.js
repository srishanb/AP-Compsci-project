import './style.css'
import * as THREE from 'three'

//Options
const Options = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("grey")


// Camera
const camera = new THREE.PerspectiveCamera(80, Options.width / Options.height, 0.1, 1000);
camera.position.z=10;
camera.position.y= 0;
camera.position.x= 0;
camera.lookAt(0, 0, 0);


// Objects
// Front side (yellow)
const frontMaterial = new THREE.MeshStandardMaterial({
  color: 'yellow',
  side: THREE.FrontSide
});
const frontCircle = new THREE.Mesh(new THREE.CircleGeometry(2), frontMaterial);
scene.add(frontCircle);

// Back side (black)
const backMaterial = new THREE.MeshStandardMaterial({
  color: 'black',
  side: THREE.BackSide
});
const backCircle = new THREE.Mesh(new THREE.CircleGeometry(2), backMaterial);
scene.add(backCircle);

// Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(0,0,10);
scene.add(directionalLight);

// Renderer
const Renderer = new THREE.WebGLRenderer();
Renderer.setSize(Options.width, Options.height);
Renderer.setPixelRatio(2);
document.body.appendChild(Renderer.domElement);

Renderer.render(scene, camera);

//Flip on button Click
let isFlipping = false;
let currentRotation = 0;
const targetRotation = Math.PI;
const axis = new THREE.Vector3(1, 1, 0).normalize();

function animate() {
  requestAnimationFrame(animate);

  if (isFlipping && currentRotation < targetRotation) {
    const step = 0.05;
    frontCircle.rotateOnAxis(axis, step);
    backCircle.rotateOnAxis(axis, step);
    currentRotation += step;

    if (currentRotation >= targetRotation) {
      isFlipping = false;
      currentRotation = 0; //reset flip
    }
  }

  Renderer.render(scene, camera);
}
animate();


const button = document.createElement('button');
button.textContent = 'Flip Circle';
button.style.position = 'absolute';
button.style.top = '20px';
button.style.left = '20px';
button.style.padding = '10px 20px';
button.style.fontSize = '16px';
document.body.appendChild(button);


button.addEventListener('click', () => {
  if (!isFlipping) {
    isFlipping = true;
    currentRotation = 0;
  }
});


/*
const button = document.createElement('button');
button.textContent = 'Flip Circle';
button.style.position = 'absolute';
button.style.top = '20px';
button.style.left = '20px';
button.style.padding = '10px 20px';
button.style.fontSize = '16px';
document.body.appendChild(button);

button.addEventListener('click', () => {
  const axis = new THREE.Vector3(1, 1, 0).normalize();
  frontCircle.rotateOnAxis(axis, Math.PI);
  backCircle.rotateOnAxis(axis, Math.PI);
  Renderer.render(scene, camera);
}); */