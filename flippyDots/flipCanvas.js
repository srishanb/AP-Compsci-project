const canvas = document.getElementById('flipDotCanvas');
const ctx = canvas.getContext('2d');
const slider = document.getElementById('dotSizeSlider');

let dotSize = parseInt(slider.value);
let spacing = 4;
let dotGrid = [];

function resizeCanvas() {
  const container = document.getElementById('flipDotContainer');
  const rect = container.getBoundingClientRect();

  // Set actual pixel dimensions for canvas drawing
  canvas.width = rect.width;
  canvas.height = rect.height;

}