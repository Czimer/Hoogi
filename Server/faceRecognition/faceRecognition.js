  var faceapi = require('face-api.js')
  var path = require('path');
  var canvas = require('./commons/env')
  var faceDetection = require('./commons/faceDetection')
  var faceDetectionNet = faceDetection.faceDetectionNet
  var faceDetectionOptions = faceDetection.faceDetectionOptions
  var saveFileModule = require('./commons/saveFile')
  var referenceImage;
 
  const directory = path.join(__dirname, 'weights')
  var detectionResultsRefImg;
 
  async function loadAllNets(){
    try{
          await faceDetectionNet.loadFromDisk(directory)
          await faceapi.nets.faceLandmark68Net.loadFromDisk(directory)
          await faceapi.nets.faceRecognitionNet.loadFromDisk(directory)
          await faceapi.nets.ssdMobilenetv1.loadFromDisk(directory)
    }
    catch(netsLoadingError){
      console.log(netsLoadingError);
    }
  }

  async function loadReferencePicture(p_referenceImage){
    try{
      referenceImage = await canvas.loadImage(p_referenceImage)
      detectionResultsRefImg = await faceapi.detectAllFaces(referenceImage, faceDetectionOptions)
      .withFaceLandmarks().withFaceDescriptors();
    }
    catch(refImageLoadingError){
      console.log(refImageLoadingError);
    }

  }

  async function recognizeFaces(_ImageToRecognize) {

    try{         
   
          const queryImage = await canvas.loadImage(_ImageToRecognize)               

          const detectionResultsQueryImg = await faceapi.detectAllFaces(queryImage, faceDetectionOptions)
            .withFaceLandmarks()
            .withFaceDescriptors()
            if(detectionResultsRefImg.length > 0 && detectionResultsQueryImg.length > 0){
              const faceMatcher = new faceapi.FaceMatcher(detectionResultsRefImg)
              // Map the matches in the picture according to the face in the first picture which labeled as 'person 1'
              const bestMatchingFacesInQueryImagebla = detectionResultsQueryImg.map(currImgRes => {
                return faceMatcher.findBestMatch(currImgRes.descriptor).label === 'person 1'       
              })
            
              if(bestMatchingFacesInQueryImagebla.indexOf(true) > -1){
                return true;
              }

            }          
          return false;
    }    
    catch(err2){
      console.log(err2)
    }    
  }

  module.exports = {
    recognizeFaces: recognizeFaces,
    runLoaders:runLoaders,
    loadAllNets:loadAllNets,
    loadReferencePicture:loadReferencePicture
  };

  async function runLoaders(p_referenceImage){
    await loadAllNets();
    await loadReferencePicture(p_referenceImage);
  }

//   async function dana(){
//     await runLoaders();    
//     var bla = await recognizeFaces(QUERY_IMAGE);
//     console.log(bla);
//     var bla2 = await recognizeFaces(QUERY_IMAGE2);
//     console.log(bla2);
//   }
// dana();

