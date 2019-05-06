//#region try face-recognition library - it wouldnt download
// const fr = require('face-recognition')

// function face(){
//     const image1 = fr.loadImage('C:\Users\Dana\Documents\Users\Dana\Galaxy S 5\Camera\IMG_20161030_145042.jpg')
//     const image2 = fr.loadImage('C:\Users\Dana\Documents\Users\Dana\Galaxy S 5\Camera\20160815_125314.jpg')
//     const image3 = fr.loadImage('C:\Users\Dana\Documents\Users\Dana\Galaxy S 5\Camera\20160213_163451.jpg')
//     const image4 = fr.loadImage('C:\Users\Dana\Documents\Users\Dana\Galaxy S 5\Camera\1387581104850.jpg')
//     const image5 = fr.loadImage('C:\Users\Dana\Documents\Users\Dana\Galaxy S 5\Camera\20150508_162453.jpg')
//     const image6 = fr.loadImage('C:\Users\Dana\Documents\Users\Dana\Galaxy S 5\Camera\IMG_20170623_224656.jpg')
//     const image7 = fr.loadImage('C:\Users\Dana\Documents\Users\Dana\Galaxy S 5\Camera\IMG_20170401_121239.jpg')
//     const image8 = fr.loadImage('C:\Users\Dana\Documents\Users\Dana\Galaxy S 5\Camera\IMG_20170323_233741.jpg')
//     const image9 = fr.loadImage('C:\Users\Dana\Documents\Users\Dana\Galaxy S 5\Camera\IMG_20170311_204429.jpg')
//     const image9 = fr.loadImage('C:\Users\Dana\Documents\Users\Dana\Galaxy S 5\Camera\IMG_20161111_203720.jpg')
//     // const image2 = fr.loadImage('path/to/image2.jpg')

//     // detect and extract faces for the training
//     const detector = fr.FaceDetector()

//     // const faceRectangles = detector.locateFaces(image)
//     const faceImage1 = detector.detectFaces(image1)
//     const faceImage2 = detector.detectFaces(image2)
//     const faceImage3 = detector.detectFaces(image3)
//     const faceImage4 = detector.detectFaces(image4)
//     const faceImage5 = detector.detectFaces(image5)
//     const faceImage6 = detector.detectFaces(image6)
//     const faceImage7 = detector.detectFaces(image7)
//     const faceImage8 = detector.detectFaces(image8)
//     const faceImage9 = detector.detectFaces(image9)
//     const faceImage10 = detector.detectFaces(image10)

//     const recognizer = fr.FaceRecognizer()

//     // arrays of face images, (use FaceDetector to detect and extract faces)
//     const danaFaces = [ faceImage1, faceImage2, faceImage3, faceImage4, faceImage5, faceImage6, faceImage7, faceImage8, faceImage9, faceImage10 ]


//     recognizer.addFaces(danaFaces, 'dana')

//     const danaFaceImage = fr.loadImage('C:\Users\Dana\Documents\Users\Dana\Galaxy S 5\Camera\IMG_20161023_120648.jpg')
//     const predictions = recognizer.predict(danaFaceImage)
//     console.log(predictions)

// }

// module.exports = face;
//#endregion 

// import * as faceapi from 'face-api.js';
  var faceapi = require('face-api.js')

  // import { canvas, faceDetectionNet, faceDetectionOptions, saveFile } from './commons';

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

  async function loadReferencePicture(){
    try{
      referenceImage = await canvas.loadImage(REFERENCE_IMAGE)
    }
    catch(refImageLoadingError){
      console.log(refImageLoadingError);
    }

  }

  async function runFaceRecognition(_ImageToRecognize) {

    try{         
   
          // const referenceImage = await canvas.loadImage(REFERENCE_IMAGE)
          const queryImage = await canvas.loadImage(_ImageToRecognize)

          const detectionResultsRefImg = await faceapi.detectAllFaces(referenceImage, faceDetectionOptions)
            .withFaceLandmarks()
            .withFaceDescriptors()         

          const detectionResultsQueryImg = await faceapi.detectAllFaces(queryImage, faceDetectionOptions)
            .withFaceLandmarks()
            .withFaceDescriptors()

          const faceMatcher = new faceapi.FaceMatcher(detectionResultsRefImg)

          const labels = faceMatcher.labeledDescriptors.map(ld => ld.label)
          
          const refBoxesWithText = detectionResultsRefImg.map(res => res.detection.box).map((box, i) => new faceapi.BoxWithText(box, labels[i]))

          const outRef = faceapi.createCanvasFromMedia(referenceImage)

          //#region - drawing on ref image
          // faceapi.drawDetection(outRef, refBoxesWithText)
          // saveFile('referenceImage.jpg', outRef.toBuffer('image/jpeg'))
          //#endregion

          // Map the matches in the picture according to the face in the first picture which labeled as 'person 1'
          const bestMatchingFacesInQueryImagebla = detectionResultsQueryImg.map(currImgRes => {
            return faceMatcher.findBestMatch(currImgRes.descriptor).label === 'person 1'       
          })
        
          if(bestMatchingFacesInQueryImagebla.indexOf(true) > -1){
            return true;
          }
          return false;

          //#region - drawing on query image and saving to directory
    //       const queryBoxesWithText = detectionResultsQueryImg.map(res => {
    //         const bestMatch = faceMatcher.findBestMatch(res.descriptor)
    //         return new faceapi.BoxWithText(res.detection.box, bestMatch.toString())
    //       })
    //       const outQuery = faceapi.createCanvasFromMedia(queryImage)
    //       faceapi.drawDetection(outQuery, queryBoxesWithText)
    //       saveFile('queryImage.jpg', outQuery.toBuffer('image/jpeg'))
    //       console.log('done, saved results to out/queryImage.jpg')
      //#endregion
    }    
    catch(err2){
      console.log(err2)
    }    
  }

  module.exports = runFaceRecognition;

  async function runLoaders(){
    await loadAllNets();
    await loadReferencePicture();
  }

  async function dana(){
    await runLoaders();    
    var bla = await runFaceRecognition(QUERY_IMAGE);
    console.log(bla);
    var bla2 = await runFaceRecognition(QUERY_IMAGE2);
    console.log(bla2);
  }
dana();

