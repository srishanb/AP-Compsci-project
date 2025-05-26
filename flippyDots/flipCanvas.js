const canvas = document.getElementById('flipDotCanvas');
const ctx = canvas.getContext('2d');
const slider = document.getElementById('dotSizeSlider');

let dotSize = parseInt(slider.value);
let spacing = 4;
let dotGrid = [];

function resizeCanvas() {
  const container = document.getElementById('flipDotContainer');
  const rect = container.getBoundingClientRect();

  canvas.width = rect.width;
  canvas.height = rect.height;
  
  drawDots();
}

function drawDots() {
    const cellSize = dotSize + spacing;
  const cols = Math.floor(canvas.width / cellSize);
  const rows = Math.floor(canvas.height / cellSize);

  const totalWidth = cols * cellSize - spacing;
  const totalHeight = rows * cellSize - spacing;
  const offsetX = (canvas.width - totalWidth) / 2 + dotSize / 2;
  const offsetY = (canvas.height - totalHeight) / 2 + dotSize / 2;
  dotGrid = Array.from({ length: rows }, () => Array(cols).fill(false));

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const pixx = offsetX + x * cellSize;
      const pixy = offsetY + y * cellSize;
      ctx.beginPath();
      ctx.arc(pixx, pixy, dotSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = dotGrid[y][x] ? '#FFD700' : '#000';
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.stroke();
    }
  }
}

slider.addEventListener('input', () => {
  dotSize = parseInt(slider.value);
  drawDots();
});

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);