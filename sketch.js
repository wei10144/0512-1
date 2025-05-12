let faceapi;
let video;
let predictions = [];
const pointsToDraw = [
  409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
  76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184
];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // 初始化 faceApi 模型
  const options = { withLandmarks: true, withDescriptors: false };
  faceapi = ml5.faceApi(video, options, modelReady);
}

function modelReady() {
  console.log("FaceApi model ready!");
  faceapi.detect(gotResults);
}

function gotResults(err, result) {
  if (err) {
    console.error(err);
    return;
  }
  predictions = result;
  faceapi.detect(gotResults); // 持續偵測
}

function draw() {
  image(video, 0, 0, width, height);

  // 繪製指定的點並串接
  drawConnectedPoints();
}

function drawConnectedPoints() {
  for (let i = 0; i < predictions.length; i++) {
    const keypoints = predictions[i].landmarks.positions;

    // 設定線條樣式
    stroke(255, 0, 0); // 紅色線條
    strokeWeight(5); // 線條粗細為 5
    noFill();

    // 串接所有指定的點
    for (let j = 0; j < pointsToDraw.length - 1; j++) {
      const indexA = pointsToDraw[j];
      const indexB = pointsToDraw[j + 1];
      const { x: x1, y: y1 } = keypoints[indexA];
      const { x: x2, y: y2 } = keypoints[indexB];
      line(x1, y1, x2, y2); // 繪製連接線
    }
  }
}
