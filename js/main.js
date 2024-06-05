// инициализация интерфейса
function init()
{
  // проверяем поддержку браузером
  if (!MediaStreamTrack){ 
    document.body.innerHTML = '<h1>Этот браузер не подходит.</h1>';
    return false;
  }
  
  // рисуем скелет
  if(document.getElementById('mainContainer')){
    var mainContainer = document.getElementById('mainContainer');
    var height = window.getComputedStyle(mainContainer).height;
     height = parseInt(height);
     var width = Math.round((height/3)*4);
    mainContainer.style.width = width+'px';

    var mainContent = '<div id="buttonBarContainer">'+
      '<div class="defButtonBar" id="buttonBar">'+
        '<div class="defButtonBar" id="selectMicButtonBar">'+
          '<select class="defBS defSource" id="micSource"><option value="disabled" disabled selected>Микрофон</option></select>'+
        '</div>'+
        '<div class="defButtonBar" id="selectCamButtonBar">'+
          '<select class="defBS defSource" id="videoSource"><option value="disabled" disabled selected>Видеокамера</option></select>'+
        '</div>'+
        '<div class="defButtonBar" id="runMicButtonBar">'+
        '</div>'+
        '<div class="defButtonBar" id="runCamButtonBar">'+
        '</div>'+
        '<div class="defButtonBar" id="takeSnapshotButtonBar">'+
        '</div>'+
        '<div class="defButtonBar" id="camRotateButtonBar">'+
        '</div>'+
        '<div class="defButtonBar" id="toggleScreenButtonBar">'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<audio id="audioMicContainer"></audio>'+
    '<video id="videoContainer"></video>';
    mainContainer.insertAdjacentHTML("afterBegin", mainContent);
  } else {
    return;
  }

  // рисуем кнопки
  drawSelectMicButton(); // выбор микрофона
  drawSelectCamButton(); // выбор камеры
  drawRunMicButton(0); // запуск микрофона
  drawRunStreamButton(0); // запуск камеры
  drawTakeSnapshotButton(1); // снимок видео
  drawCamRotateButton(); // разворот картинки
  drawToggleScreenButton(0); // полноэкранный режим

/*
  // временное отображение блока кнопок при движении мыши в области видео
  bodyContainer.onmousemove = showButtons;
  function showButtons()
  {
    if(!bodyContainer.classList.contains("showButtons")){
      bodyContainer.classList.add("showButtons");
      setTimeout(function(){   
        if(bodyContainer.classList.contains("showButtons")){
          bodyContainer.classList.remove("showButtons");
        }
      }, 10000);
    }
  }
*/

// Отслеживаем переключение полноэкранного режима и обновляем кнопку
  document.addEventListener('fullscreenchange', fullscreenChanged, false);
  function fullscreenChanged(event)
  {
    if(document.fullscreenElement){
      drawToggleScreenButton(1);
    } else {
      drawToggleScreenButton(0);
    }

  }
}

// кнопка выбора микрофона
function drawSelectMicButton()
{
  navigator.mediaDevices.enumerateDevices().then(function (devices) {
    var n = 0;
    for(var i = 0; i < devices.length; i ++){
      var device = devices[i];
      if (device.kind === 'audioinput') {
        n = n + 1;
        var option = document.createElement('option');
        option.value = device.deviceId;
        var fullText = device.label || 'audioinput#' + n;
        if (fullText.length > 100){
          option.text = fullText.substr(0,100)+'...';
        } else {
          option.text = fullText;
        }
        document.querySelector('select#micSource').appendChild(option);
      }
    };
  });
}

// кнопка выбора камеры
function drawSelectCamButton()
{
  navigator.mediaDevices.enumerateDevices().then(function (devices) {
    var n = 0;
    for(var i = 0; i < devices.length; i ++){
      var device = devices[i];
      if (device.kind === 'videoinput') {
        n = n + 1;
        var option = document.createElement('option');
        option.value = device.deviceId;
        var fullText = device.label || 'videoinput#' + n;
        if (fullText.length > 100){
          option.text = fullText.substr(0,100)+'...';
        } else {
          option.text = fullText;
        }
        document.querySelector('select#videoSource').appendChild(option);
      }
    };
  });
}

// кнопка запуска/остановки микрофона
function drawRunMicButton(m)
{
  var runMicButton = '<div id="startMicButton" class="defBS defButton bgMicOff" onClick="runMic(1);"></div>';
  if(m == 1){
    var runMicButton = '<div id="startMicButton" class="defBS defButton bgMicOn" onClick="runMic(0);"></div>';
  }
  if(document.getElementById('startMicButton')){
    document.getElementById('startMicButton').remove();
  }
  document.getElementById('runMicButtonBar').insertAdjacentHTML("afterBegin", runMicButton); 
}

// кнопка запуска/остановки камеры
function drawRunStreamButton(s)
{
  var runCamButton = '<div id="startCamButton" class="defBS defButton bgCamOff" onClick="runCam(1);"></div>';
  if(s == 1){
    var runCamButton = '<div id="startCamButton" class="defBS defButton bgCamOn" onClick="runCam(0);"></div>';
  }
  if(document.getElementById('startCamButton')){
    document.getElementById('startCamButton').remove();
  }
  document.getElementById('runCamButtonBar').insertAdjacentHTML("afterBegin", runCamButton); 
}

// кнопка зеркального отображения картинки
function drawCamRotateButton()
{
  var camRotateButton = '<div id="camRotateButton" class="defBS defButton bgCamRotate" onClick="camRotate();"></div>';
  if(videoContainer.classList.contains("videoMirror")){
    var camRotateButton = '<div id="camRotateButton" class="defBS defButton bgCamRotateOn" onClick="camRotate();"></div>';
  }

  if(document.getElementById('camRotateButton')){
    document.getElementById('camRotateButton').remove();
  }
  document.getElementById('camRotateButtonBar').insertAdjacentHTML("afterBegin", camRotateButton); 
}

// кнопка снимка с камеры
function drawTakeSnapshotButton(t)
{
  var takeSnapshotButton = '<div id="takeSnapshotButton" class="defBS defButton bgTakeSnapshot" onClick="takeSnapshot();"></div>';
  if(t == 1){
    if(document.getElementById('takeSnapshotButton')){
      document.getElementById('takeSnapshotButton').remove();
    }
    document.getElementById('takeSnapshotButtonBar').insertAdjacentHTML("afterBegin", takeSnapshotButton); 
  } else {
    if(document.getElementById('takeSnapshotButton')){
      document.getElementById('takeSnapshotButton').remove();
    }
  }
}

// зеркальное отображение картинки
function camRotate()
{
  if(videoContainer.classList.contains("videoMirror")){
      videoContainer.classList.remove("videoMirror");
    } else {
      videoContainer.classList.add("videoMirror");
    }
    drawCamRotateButton();
}

// кнопка переключения в полноэкранный режим
function drawToggleScreenButton(t)
{
  var toggleScreenButton = '<div id="toggleScreenButton" class="defBS defButton bgToggleScreenOff" onClick="toggleScreen(1);"></div>';
  if(t == 1){
    var toggleScreenButton = '<div id="toggleScreenButton" class="defBS defButton bgToggleScreenOn" onClick="toggleScreen(0);"></div>';
  }
  if(document.getElementById('toggleScreenButton')){
    document.getElementById('toggleScreenButton').remove();
  }
  document.getElementById('toggleScreenButtonBar').insertAdjacentHTML("afterBegin", toggleScreenButton); 
}

// переключение в полноэкранный режим и обратно
function toggleScreen(t)
{
  var mainContainer = document.getElementById("mainContainer");
  if(t == 1){
    if (mainContainer.requestFullscreen) {
      mainContainer.requestFullscreen();
    } else if (mainContainer.mozRequestFullScreen) {
      mainContainer.mozRequestFullScreen();
    } else if (mainContainer.webkitRequestFullscreen) {
      mainContainer.webkitRequestFullscreen();
    } else if (mainContainer.msRequestFullscreen) { 
      mainContainer.msRequestFullscreen();
    }
  } else {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
  }
}

// запуск/остановка камеры
function runCam(s)
{
  if(videoSource.value == 'disabled'){
    return false;
  }
  if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
    const constraints = {
      audio: false,
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        deviceId: {
          exact: videoSource.value
        }
      }
    };
    if(s == 1){
      // запуск
      navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
        //const video = document.querySelector('video');
        const video = document.getElementById('videoContainer');
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
          video.play();
        };
      })
      .catch(function(err) { 
        alert(err.name + ": " + err.message); 
        drawRunStreamButton(0);
      }); 
    } else {
      // остановка
      const video = document.getElementById('videoContainer');
      const stream = video.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(function (track) {
          track.stop();
        });
        video.srcObject = null;
      }
    }
    drawRunStreamButton(s);
  }
}

// запуск/остановка микрофона
function runMic(m)
{
  if(micSource.value == 'disabled'){
    return false;
  }
  if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
    const constraints = {
      video: false,
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        deviceId: {
          exact: micSource.value
        }
      }
    };
    if(m == 1){
      // запуск
      navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
        const audio = document.getElementById('audioMicContainer');
        audio.srcObject = stream;
        audio.volume = 0.7;
        audio.onloadedmetadata = function(e) {
          audio.play();
        };
      })
      .catch(function(err) { 
        alert(err.name + ": " + err.message); 
        drawRunMicButton(0);
      }); 
    } else {
      // остановка
      const audio = document.getElementById('audioMicContainer');
      const stream = audio.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(function (track) {
          track.stop();
        });
        audio.srcObject = null;
      }
    }
    drawRunMicButton(m);
  }
}

// Снимок видео
function takeSnapshot(){
    var hidden_canvas = document.querySelector('canvas');
    var video = document.getElementById('videoContainer');
    var curDate = Date.now();
    var width = video.videoWidth;
    var height = video.videoHeight;

    // Объект для работы с canvas.
    context = hidden_canvas.getContext('2d');

    // Установка размеров canvas идентичных с video.
    hidden_canvas.width = width;
    hidden_canvas.height = height;

    // если есть видео, сохраняем
    if(hidden_canvas.width != 0){
      // Отрисовка текущего кадра с video в canvas.
      context.drawImage(video, 0, 0, width, height);

      // Преобразование кадра в изображение dataURL.
      var imageDataURL = hidden_canvas.toDataURL('image/png');
      
      // Создание ссылки и сохранение
      let link = document.createElement('a');
      link.setAttribute('href', imageDataURL);
      link.setAttribute('download', 'webcam_snapshot_'+curDate+'.png');
      link.click();
    }
}
