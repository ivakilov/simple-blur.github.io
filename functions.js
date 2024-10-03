async function Conversation() {
  stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: {
      autoGainControl: false,
      echoCancellation: false,
      googAutoGainControl: false,
      noiseSuppression: false,
      channelCount: { max: 1 },
    },
  });
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  const microphone = audioContext.createMediaStreamSource(stream);
  const scriptProcessor = audioContext.createScriptProcessor(256, 1, 1);
  const volumeMeterBar = document.getElementById("volumeMeterBar");

  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.3;

  microphone.connect(analyser);
  analyser.connect(scriptProcessor);
  scriptProcessor.connect(audioContext.destination);

  scriptProcessor.onaudioprocess = () => {
    const array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    let values = 0;

    array.forEach((value) => {
      values += value;
    });

    const average = values / array.length;
    const percentage = (average / 256) * 100;
    volumeMeterBar.style.height = `${percentage}%`;
  };

  video.srcObject = stream;
  video.onloadedmetadata = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    drawFrame();
  };
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


// Примерная логика для записи аудио и его обработки
function handleAudioData(audioData) {
  // Здесь обрабатываем audioData (например, отправляем на сервер)
  sendAudioToServer(audioData);
}

function addBlur(X, Y) {
  // Применение размытия ко всему холсту

  ctx.filter = "blur(10px)";
  ctx.drawImage(canvas, 0, 0);


  // Задаем размеры центральной области
  // const centerX = canvas.width / 2;
  // const centerY = canvas.height / 2;
  const width = 300; // Ширина центральной области
  const height = 300; // Высота центральной области

  for (let i = 9; i > 1; i--) {
    //////
    ctx.filter = "blur(" + i + "px)";

    // Сохранение текущего состояния холста
    ctx.save();

    // Обрезаем область центрального прямоугольника
    ctx.beginPath();
    radius = canvas.height / 4 * (1 + 0.05 * i);
    // ctx.arc(centerX, centerY - height / 8, radius, 0, 2 * Math.PI, true);
    ctx.arc(X, Y, radius, 0, 2 * Math.PI, true);

    ctx.clip();

    // Отрисовка блюра
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Восстановление состояния холста
    ctx.restore();
  }

  // Восстановление фильтра и отрисовка центральной области без размытия
  ctx.filter = "none";

  // Сохранение текущего состояния холста
  ctx.save();

  // Обрезаем область центрального круга
  ctx.beginPath();
  radius = canvas.height / 4;
  ctx.arc(X, Y, radius, 0, 2 * Math.PI, false);
  ctx.clip();

  // Отрисовка видео без размытия
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  // Восстановление состояния холста
  ctx.restore();
}
