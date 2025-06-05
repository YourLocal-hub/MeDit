const videoInput = document.getElementById('videoInput');
const videoPreview = document.getElementById('videoPreview');
const effectSelect = document.getElementById('effectSelect');
const exportBtn = document.getElementById('exportBtn');

let originalFile;
let currentEffect = 'none';

videoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    originalFile = file;
    const url = URL.createObjectURL(file);
    videoPreview.src = url;
    videoPreview.load();
  }
});

effectSelect.addEventListener('change', () => {
  currentEffect = effectSelect.value;
  applyEffect(currentEffect);
});

function applyEffect(effect) {
  videoPreview.style.filter = 'none';
  switch (effect) {
    case 'grayscale': videoPreview.style.filter = 'grayscale(100%)'; break;
    case 'invert': videoPreview.style.filter = 'invert(100%)'; break;
    case 'brightness': videoPreview.style.filter = 'brightness(150%)'; break;
    case 'contrast': videoPreview.style.filter = 'contrast(200%)'; break;
  }
}

exportBtn.addEventListener('click', async () => {
  if (!originalFile) return alert("Upload a video first.");
  exportBtn.innerText = "⏳ Processing...";
  exportBtn.disabled = true;

  const { createFFmpeg, fetchFile } = FFmpeg;
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();

  const inputName = 'input.mp4';
  const outputName = 'output.mp4';

  ffmpeg.FS('writeFile', inputName, await fetchFile(originalFile));

  let filter = '';
  switch (currentEffect) {
    case 'grayscale': filter = 'format=gray'; break;
    case 'invert': filter = 'lutrgb="r=negval:g=negval:b=negval"'; break;
    case 'brightness': filter = 'eq=brightness=0.3'; break;
    case 'contrast': filter = 'eq=contrast=2'; break;
  }

  const args = filter
    ? ['-i', inputName, '-vf', filter, outputName]
    : ['-i', inputName, outputName];

  await ffmpeg.run(...args);
  const data = ffmpeg.FS('readFile', outputName);
  const videoURL = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

  const a = document.createElement('a');
  a.href = videoURL;
  a.download = 'edited_video.mp4';
  a.click();

  exportBtn.innerText = "🎥 Export Edited Video";
  exportBtn.disabled = false;
});
