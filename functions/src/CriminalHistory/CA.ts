// const faceapi = require('face-api.js');
// // const fs = require('fs');
// import '@tensorflow/tfjs-node';
// import fetch from 'node-fetch';
// // const admin = require('firebase-admin');
// // const DBUtil = require('../util/db_util');
// const path = require('path');
// import * as canvas from 'canvas';

// // exports.handler = async (data, context) => {
// const { Canvas, Image, ImageData } = canvas
// faceapi.env.monkeyPatch({ Canvas, Image, ImageData,fetch: fetch  })
// const MODELS_URL = path.join(__dirname, 'models');

// async function loadModels(){
//   await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_URL)
//   await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_URL)
//   await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_URL)
//   start()
// }
// loadModels()

// // async function start() {
// //   const labeledFaceDescriptors = await loadLabeledImages()
// //   const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)

// //     const image = await canvas.loadImage('1.jpg')
// //     const displaySize = { width: image.width, height: image.height }
// //     const detections = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor()
// //     const resizedDetections = faceapi.resizeResults(detections, displaySize)
// //     // const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
// //     const results = faceMatcher.findBestMatch(resizedDetections.descriptor)
// //     console.log(results)
// // }

// // function loadLabeledImages() {
// //   const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark']
// //   return Promise.all(
// //     labels.map(async label => {
// //       const descriptions = []
// //       for (let i = 1; i <= 2; i++) {
// //         const img = await canvas.loadImage(`https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`)
// //         const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
// //         descriptions.push(detections.descriptor)
// //       }

// //       return new faceapi.LabeledFaceDescriptors(label, descriptions)
// //     })
// //   )
// // }
// // }
// async function start(){

// var result = await loadLabeledImages()
// var descriptionone = `${result[0]['description'][0]}`.split(',')
// var qwertyu = []

// descriptionone.map(async label => {
//     qwertyu.push(parseFloat(label))
// })

// const qwesd = new Float32Array(qwertyu)
// console.log(qwesd)
// //var descriptiontwo = JSON.stringify(result[0]['description'][1])

// // var descriptionarraytwo = JSON.parse(descriptiontwo)



// // for (let index = 0; index < array.length; index++) {
// //     const element = array[index];
    
// // }

// function loadLabeledImages() {
//     const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark']
//     return Promise.all(
//       labels.map(async label => {
//         const descriptions = []
//         const descriptors = {}
//         for (let i = 1; i <= 2; i++) {
//           const img = await canvas.loadImage(`https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`)
//           const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
//           descriptions.push(detections.descriptor)
//         }
//         descriptors['label'] = label
//         descriptors['description'] = descriptions
//         return descriptors
//       })
//     )
//   }

// }

// // start()