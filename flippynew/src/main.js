import './style.css'
import * as THREE from 'three'

const container = document.getElementById('flipGridContainer');
// Update the container border style to be thicker and white
if (container) {
  container.style.border = "4px solid white";
}

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#3C3C3C")

// Camera
const camera = new THREE.PerspectiveCamera(80, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 110;
camera.position.y = 0;
camera.position.x = 0;
camera.lookAt(0, 0, 0);

// Objects
// Front side (yellow)
const frontMaterial = new THREE.MeshStandardMaterial({
  color: 'yellow',
  side: THREE.FrontSide
});
const frontCircle = new THREE.Mesh(new THREE.CircleGeometry(2), frontMaterial);

// Back side (black)
const backMaterial = new THREE.MeshStandardMaterial({
  color: '#3C3C3C',
  side: THREE.BackSide
});
const backCircle = new THREE.Mesh(new THREE.CircleGeometry(2), backMaterial);

const dotSpacing = 5;
const flipDots = [];

// Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(0, 0, 10);
scene.add(directionalLight);

// Renderer
const Renderer = new THREE.WebGLRenderer();
Renderer.setSize(container.clientWidth, container.clientHeight);
camera.aspect = container.clientWidth / container.clientHeight;
camera.updateProjectionMatrix();
Renderer.setPixelRatio(2);
container.appendChild(Renderer.domElement);

Renderer.render(scene, camera);

const targetRotation = Math.PI;
const axis = new THREE.Vector3(1, 1, 0).normalize();

let needsRender = true; // Flag to control rendering

// Slider
const slider = document.createElement('input');
slider.type = 'range';
slider.min = '6';
slider.max = '15';
slider.step = '0.1';
slider.value = '5';
slider.style.position = 'absolute';
slider.style.right = '40px';
slider.style.top = '50%';
slider.style.transform = 'translateY(-50%) rotate(270deg)';
slider.style.transformOrigin = 'center';
slider.style.width = '150px';
document.body.appendChild(slider);

const button = document.createElement('button');
button.textContent = 'Flip Circle';
button.style.position = 'absolute';
button.style.top = '20px';
button.style.left = '20px';
button.style.padding = '10px 20px';
button.style.fontSize = '16px';
document.body.appendChild(button);

function createGrid() {
  const width = container.clientWidth;
  const height = container.clientHeight;

  const scale = parseFloat(slider.value) / 5;

  const pixelRatio = scale < 0.5 ? 1 : scale < 0.8 ? 1.5 : 2;
  Renderer.setPixelRatio(pixelRatio);

  const scaledSpacing = dotSpacing * scale;
  const gridCols = Math.floor(width / scaledSpacing);
  const gridRows = Math.floor(height / scaledSpacing);

  for (const dot of flipDots) {
    scene.remove(dot.group);
  }
  flipDots.length = 0;

  for (let i = 0; i < gridRows; i++) {
    for (let j = 0; j < gridCols; j++) {
      const front = frontCircle.clone();
      const back = backCircle.clone();

      front.scale.set(scale, scale, scale);
      back.scale.set(scale, scale, scale);

      const group = new THREE.Group();
      group.add(front);
      group.add(back);

      group.position.x = (j - (gridCols - 1) / 2) * scaledSpacing;
      group.position.y = (i - (gridRows - 1) / 2) * scaledSpacing;
      scene.add(group);

      flipDots.push({ group, currentRotation: 0, isFlipping: false });
    }
  }

  needsRender = true; // Trigger render after grid update
}
createGrid();

slider.addEventListener('input', () => {
  createGrid();
});

function animate() {
  requestAnimationFrame(animate);

  let flipping = false;

  for (const dot of flipDots) {
    if (dot.isFlipping && dot.currentRotation < targetRotation) {
      const step = 0.4;
      const remaining = targetRotation - dot.currentRotation;
      const actualStep = Math.min(step, remaining);

      dot.group.rotateOnAxis(axis, actualStep);
      dot.currentRotation += actualStep;

      if (dot.currentRotation >= targetRotation) {
        dot.isFlipping = false;
        dot.currentRotation = 0;
      }
      flipping = true;
    }
  }

  if (flipping || needsRender) {
    Renderer.render(scene, camera);
    needsRender = false;
  }
}
animate();

button.addEventListener('click', () => {
  for (const dot of flipDots) {
    if (!dot.isFlipping) {
      dot.isFlipping = true;
      dot.currentRotation = 0;
    }
  }
  needsRender = true; // Render while flipping
});

window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  Renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  createGrid();
  needsRender = true;
});