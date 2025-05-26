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
  const cols = Math.floor(canvas.width / (dotSize + spacing));
  const rows = Math.floor(canvas.height / (dotSize + spacing));

  const totalWidth = cols * (dotSize + spacing);
  const totalHeight = rows * (dotSize + spacing);
  const offsetX = (canvas.width - totalWidth) / 2;
  const offsetY = (canvas.height - totalHeight) / 2;

  dotGrid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false)
  );

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const pixx = offsetX + x * (dotSize + spacing);
      const pixy = offsetY + y * (dotSize + spacing);
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