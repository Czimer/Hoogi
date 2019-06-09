  var faceapi = require('face-api.js')

  var canvas = require('./commons/env')
  var faceDetection = require('./commons/faceDetection')
  var faceDetectionNet = faceDetection.faceDetectionNet
  var faceDetectionOptions = faceDetection.faceDetectionOptions
  var saveFileModule = require('./commons/saveFile')
  var saveFile = saveFileModule.saveFile;
  var referenceImage;

  const imagesDirectory = 'C:\\Users\\Dana\\Documents\\Users\\Dana\\ColmanCS\\FinalProject\\Hoogi\\Hoogi\\Server\\faceRecognition\\images\\'

  const REFERENCE_IMAGE = imagesDirectory +  'onlydana.jpg'
  const QUERY_IMAGE = imagesDirectory + 'danaandfriends.jpg'
  const QUERY_IMAGE2 = imagesDirectory + 'imaShilhav.jpg'
  const directory = 'C:\\Users\\Dana\\Documents\\Users\\Dana\\ColmanCS\\FinalProject\\Hoogi\\Hoogi\\Server\\faceRecognition\\weights'
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

              const labels = faceMatcher.labeledDescriptors.map(ld => ld.label)
              
              const refBoxesWithText = detectionResultsRefImg.map(res => res.detection.box).map((box, i) => new faceapi.BoxWithText(box, labels[i]))

              const outRef = faceapi.createCanvasFromMedia(referenceImage)
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

