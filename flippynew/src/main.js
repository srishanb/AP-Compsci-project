import './style.css'
import * as THREE from 'three'

const container = document.getElementById('flipGridContainer');

//Options
const width = container.clientWidth;
const height = container.clientHeight;

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("grey")


// Camera
const camera = new THREE.PerspectiveCamera(80, width / height, 0.1, 1000);
camera.position.z=110;
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
//scene.add(frontCircle);

// Back side (black)
const backMaterial = new THREE.MeshStandardMaterial({
  color: 'black',
  side: THREE.BackSide
});
const backCircle = new THREE.Mesh(new THREE.CircleGeometry(2), backMaterial);
//scene.add(backCircle);

const gridCols =16*3;
const gridRows =9*3;

const dotSpacing =5;
const flipDots = [];

for (let i=0; i< gridRows; i++){
  for (let j = 0; j < gridCols; j++){
    const front = frontCircle.clone();
    const back = backCircle.clone();

    const group = new THREE.Group();
    group.add(front);
    group.add(back);

    group.position.x = (j - gridCols / 2) * dotSpacing;
    group.position.y = (i - gridRows /2) * dotSpacing;
    scene.add(group);

    flipDots.push({group, currentRotation : 0, isFlipping: false });
  }
}

// Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(0,0,10);
scene.add(directionalLight);

// Renderer
const Renderer = new THREE.WebGLRenderer();
Renderer.setSize(width, height);
camera.aspect = width / height;
camera.updateProjectionMatrix();
Renderer.setPixelRatio(2);
container.appendChild(Renderer.domElement);



Renderer.render(scene, camera);

//Flip on button Click
//let isFlipping = false;
//let currentRotation = 0;
const targetRotation = Math.PI;
const axis = new THREE.Vector3(1, 1, 0).normalize();

function animate() {
  requestAnimationFrame(animate);

  /* if (isFlipping && currentRotation < targetRotation) {

    const step = 0.5;
    const remaining = targetRotation - currentRotation;
    const actualStep = Math.min(step, remaining);
    frontCircle.rotateOnAxis(axis, actualStep);
    backCircle.rotateOnAxis(axis, actualStep);
    currentRotation += actualStep;

    if (currentRotation >= targetRotation) {
      isFlipping = false;
      currentRotation = 0; //reset flip
    }
  }
*/

for (const dot of flipDots){
  if (dot.isFlipping && dot.currentRotation < targetRotation){
    const step = 0.4;
    const remaining = targetRotation-dot.currentRotation;
    const actualStep = Math.min(step,remaining);

    dot.group.rotateOnAxis(axis, actualStep);
    dot.currentRotation += actualStep;

    if (dot.currentRotation >= targetRotation) {
      dot.isFlipping = false;
      dot.currentRotation = 0;
    }
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
  for(const dot of flipDots){
    if(!dot.isFlipping){
      dot.isFlipping = true;
      dot.currentRotation = 0;
    }
  }
});

window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  Renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
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