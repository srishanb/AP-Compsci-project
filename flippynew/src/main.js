import './style.css'
import * as THREE from 'three'

const flipChorusSounds = Array.from({ length: 10 }, (_, i) => {
  const sound = new Audio('SingleFlipNoise.wav');
  sound.playbackRate = 0.8 + i * 0.05; // Range: 0.8 to 1.25 (harmonious intervals)
  return sound;
});

function playFlipSound() {
  const sound = new Audio('SingleFlipNoise.wav');
  sound.playbackRate = 0.95 + Math.random() * 0.1; // Range: 0.95 to 1.05
  sound.play();
}

const container = document.getElementById('flipGridContainer');

if (container) {
  container.style.border = "5px solid white";
}

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#3C3C3C")

// Camera
const aspect = container.clientWidth / container.clientHeight;
const camera = new THREE.OrthographicCamera(-aspect * 50, aspect * 50, 50, -50, 0.1, 1000);
camera.position.z = 210;
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


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredDot = null;
let hoverTimer = null;
const HOVER_DELAY = 10; 
let hoverFlipEnabled = true;
const flippedDots = new Set();
const FLIP_COOLDOWN = 500;

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

let needsRender = true;

const slider = document.getElementById('dot-size-slider');



const button = document.getElementById('flip-button');
const resetButton = document.getElementById('reset-button');
const hoverToggleButton = document.getElementById('hover-toggle-button');


function resetGrid() {
 
  if (hoverTimer) {
    clearTimeout(hoverTimer);
    hoverTimer = null;
  }
  hoveredDot = null;
  

  flippedDots.clear();

  for (const dot of flipDots) {

    dot.group.rotation.set(0, 0, 0);
    dot.currentRotation = 0;
    dot.isFlipping = false;
  }
  
  needsRender = true;
}

function toggleHoverFlip() {
  hoverFlipEnabled = !hoverFlipEnabled;
  

  if (!hoverFlipEnabled) {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }
    hoveredDot = null;
    flippedDots.clear();
  }
  

  if (hoverFlipEnabled) {
    hoverToggleButton.textContent = 'Hover Flip: ON (Press H)';
    hoverToggleButton.className = 'control-button hover-toggle-button hover-toggle-on';
  } else {
    hoverToggleButton.textContent = 'Hover Flip: OFF (Press H)';
    hoverToggleButton.className = 'control-button hover-toggle-button hover-toggle-off';
  }
}

function onMouseMove(event) {
  if (!hoverFlipEnabled) return;

  const rect = container.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  
  const dotGroups = flipDots.map(dot => dot.group);
  const intersects = raycaster.intersectObjects(dotGroups, true);

  if (intersects.length > 0) {
    const intersectedGroup = intersects[0].object.parent;
    const dotIndex = flipDots.findIndex(dot => dot.group === intersectedGroup);
    
    if (dotIndex !== -1 && hoveredDot !== dotIndex) {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }
      
      if (!flippedDots.has(dotIndex) && !flipDots[dotIndex].isFlipping) {
        hoveredDot = dotIndex;
        
        hoverTimer = setTimeout(() => {
          if (hoveredDot === dotIndex && !flipDots[dotIndex].isFlipping && 
              hoverFlipEnabled && !flippedDots.has(dotIndex)) {
            
            flipDots[dotIndex].isFlipping = true;
            flipDots[dotIndex].currentRotation = 0;
            needsRender = true;
            
            flippedDots.add(dotIndex);
            
            setTimeout(() => {
              flippedDots.delete(dotIndex);
            }, FLIP_COOLDOWN);
            
            hoveredDot = null;
            hoverTimer = null;
          }
        }, HOVER_DELAY);
      }
    }
  } else {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }
    hoveredDot = null;
  }
}

function onMouseLeave() {
  if (hoverTimer) {
    clearTimeout(hoverTimer);
    hoverTimer = null;
  }
  hoveredDot = null;
}

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
  flippedDots.clear();

 
  const gridWidth = (gridCols - 1) * scaledSpacing;
  const gridHeight = (gridRows - 1) * scaledSpacing;

  for (let i = 0; i < gridRows; i++) {
    for (let j = 0; j < gridCols; j++) {
      const front = frontCircle.clone();
      const back = backCircle.clone();

      front.scale.set(scale, scale, scale);
      back.scale.set(scale, scale, scale);

      const group = new THREE.Group();
      group.add(front);
      group.add(back);


      group.position.x = j * scaledSpacing - gridWidth / 2;
      group.position.y = i * scaledSpacing - gridHeight / 2;
      group.position.z = 0;
      
      scene.add(group);

      flipDots.push({ group, currentRotation: 0, isFlipping: false, triggeredByButton: false });
    }
  }

  needsRender = true; 
}

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
        if (!dot.triggeredByButton) {
          playFlipSound();
        }
        dot.triggeredByButton = false;
      }
      flipping = true;
    }
  }

  if (flipping || needsRender) {
    Renderer.render(scene, camera);
    needsRender = false;
  }
}


createGrid();


slider.addEventListener('input', () => {
  createGrid();
});

container.addEventListener('mousemove', onMouseMove);
container.addEventListener('mouseleave', onMouseLeave);

document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'h') {
    toggleHoverFlip();
  }
  if (event.key.toLowerCase() === 'r') {
    resetGrid();
  }
  if (event.key.toLowerCase() === 'f') {
    flipChorusSounds.forEach((sound, i) => {
      setTimeout(() => {
        const clone = sound.cloneNode();
        clone.play();
      }, i * 30);
    });
    for (const dot of flipDots) {
      if (!dot.isFlipping) {
        dot.isFlipping = true;
        dot.currentRotation = 0;
        dot.triggeredByButton = true;
      }
    }
    needsRender = true;
  }
});

button.addEventListener('click', () => {
  flipChorusSounds.forEach((sound, i) => {
    setTimeout(() => {
      const clone = sound.cloneNode();
      clone.play();
    }, i * 30);
  });
  for (const dot of flipDots) {
    if (!dot.isFlipping) {
      dot.isFlipping = true;
      dot.currentRotation = 0;
      dot.triggeredByButton = true;
    }
  }
  needsRender = true;
});

resetButton.addEventListener('click', resetGrid);
hoverToggleButton.addEventListener('click', toggleHoverFlip);

window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  Renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  createGrid();
  needsRender = true;
});


animate();