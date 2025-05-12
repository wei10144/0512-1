let faceapi;
let video;
let predictions = [];
const pointsToDraw = [
  409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
  76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184
];

// 嘴唇的點索引
const lipsPoints = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 61, // 外嘴唇
  78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 78  // 內嘴唇
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

  // 繪製嘴唇線條
  drawLips();

  // 繪製指定的點
  drawKeypoints();
}

function drawKeypoints() {
  for (let i = 0; i < predictions.length; i++) {
    const keypoints = predictions[i].landmarks.positions;

    for (let j = 0; j < pointsToDraw.length; j++) {
      const index = pointsToDraw[j];
      const { x, y } = keypoints[index];
      fill(255, 0, 0);
      noStroke();
      ellipse(x, y, 5, 5); // 繪製紅色的點
    }
  }
}

function drawLips() {
  for (let i = 0; i < predictions.length; i++) {
    const keypoints = predictions[i].landmarks.positions;

    // 繪製外嘴唇
    stroke(0, 255, 0); // 綠色線條
    strokeWeight(3); // 線條粗細為 3
    noFill();
    beginShape();
    for (let j = 0; j < lipsPoints.length; j++) {
      const index = lipsPoints[j];
      const { x, y } = keypoints[index];
      vertex(x, y);
    }
    endShape(CLOSE); // 將線條閉合
  }
}
