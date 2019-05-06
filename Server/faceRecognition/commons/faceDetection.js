// import * as faceapi from 'face-api.js';
var faceapi = require('face-api.js');

const faceDetectionNet = faceapi.nets.ssdMobilenetv1


// SsdMobilenetv1Options
const minConfidence = 0.5

// TinyFaceDetectorOptions
const inputSize = 408
const scoreThreshold = 0.5

// MtcnnOptions
const minFaceSize = 50
const scaleFactor = 0.8

// function getFaceDetectorOptions(net: faceapi.NeuralNetwork<any>) {
function getFaceDetectorOptions(net) {
  return net === faceapi.nets.ssdMobilenetv1
    ? new faceapi.SsdMobilenetv1Options({ minConfidence })
    : (net === faceapi.nets.tinyFaceDetector
      ? new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
      : new faceapi.MtcnnOptions({ minFaceSize, scaleFactor })
    )
}

// export const faceDetectionOptions = getFaceDetectorOptions(faceDetectionNet)
module.exports = {
  faceDetectionNet:faceapi.nets.ssdMobilenetv1,
  faceDetectionOptions: getFaceDetectorOptions(faceDetectionNet)
}