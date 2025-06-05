const videoInput = document.getElementById('videoInput');
const videoPreview = document.getElementById('videoPreview');
const effectSelect = document.getElementById('effectSelect');
const exportBtn = document.getElementById('exportBtn');
const audioInput = document.getElementById('audioInput');
const muteVideo = document.getElementById('muteVideo');

const cropX = document.getElementById('cropX');
const cropY = document.getElementById('cropY');
const cropWidth = document.getElementById('cropWidth');
const cropHeight = document.getElementById('cropHeight');

let originalVideoFile = null;
let originalAudioFile = null;

videoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    originalVideoFile = file;
    videoPreview.src = URL.createObjectURL(file);
    videoPreview.load();
  }
});

audioInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    originalAudioFile = file;
  }
});

exportBtn.addEventListener('click', async () => {
  if (!originalVideoFile) return alert("Please upload a video.");
  exportBtn.innerText = "⏳ Processing...";
  exportBtn.disabled = true;

  const { createFFmpeg, fetchFile } = FFmpeg;
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();

  const videoName = "input.mp4";
  const audioName = "audio.mp3";
  const outputName = "output.mp4";

  ffmpeg.FS('writeFile', videoName, await fetchFile(originalVideoFile));
  if (originalAudioFile) {
    ffmpeg.FS('writeFile', audioName, await fetchFile(originalAudioFile));
  }

  let filters = [];

  const effect = effectSelect.value;
  switch (effect) {
    case "grayscale": filters.push("format=gray"); break;
    case "invert": filters.push("lutrgb='r=negval:g=negval:b=negval'"); break;
    case "brightness": filters.push("eq=brightness=0.3"); break;
    case "contrast": filters.push("eq=contrast=2"); break;
    case "sepia": filters.push("colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131"); break;
    case "blur": filters.push("boxblur=2:1"); break;
    case "saturate": filters.push("eq=saturation=2"); break;
    case "flip": filters.push("hflip"); break;
  }

  const x = cropX.value, y = cropY.value, w = cropWidth.value, h = cropHeight.value;
  if (x && y && w && h) {
    filters.push(`crop=${w}:${h}:${x}:${y}`);
  }

  const filterString = filters.length ? ['-vf', filters.join(",")] : [];

  let ffmpegArgs = ['-i', videoName];

  if (originalAudioFile) {
    ffmpegArgs.push('-i', audioName, '-map', '0:v', '-map', '1:a');
  }

  if (muteVideo.checked && !originalAudioFile) {
    ffmpegArgs.push('-an');
  }

  ffmpegArgs.push(...filterString);
  ffmpegArgs.push('-shortest', outputName);

  await ffmpeg.run(...ffmpegArgs);

  const data = ffmpeg.FS('readFile', outputName);
  const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

  const a = document.createElement('a');
  a.href = url;
  a.download = "edited_video.mp4";
  a.click();

  exportBtn.innerText = "🎥 Export Edited Video";
  exportBtn.disabled = false;
});
