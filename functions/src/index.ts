import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const faceapi = require('face-api.js');
// const fse = require('fs-extra');
const os = require('os');
import '@tensorflow/tfjs-node';
import fetch from 'node-fetch';
// const DBUtil = require('../util/db_util');
const path = require('path');
import * as canvas from 'canvas';
admin.initializeApp();

export const CriminalHistory = functions.https.onCall(async (data, context) => {

    const imagefilePath = data['imagefilePath']
    const id = data['id'] 
    const userid = data['userid']
    const bucketCriminalDriver = admin.storage().bucket('e-fining-sep.appspot.com');
    const bucket = admin.storage().bucket('e-fining-sep-criminalassessment');

    const tempFilePathImage = path.join(os.tmpdir(), 'driverImage');
    await bucketCriminalDriver.file(imagefilePath).download({destination: tempFilePathImage});

    const faceLandmarkShard = path.join(os.tmpdir(), 'face_landmark_68_model-shard1');
    await bucket.file('Models/face_landmark_68_model-shard1').download({destination: faceLandmarkShard});
    
    const faceLandmarkmanifest = path.join(os.tmpdir(), 'face_landmark_68_model-weights_manifest.json');
    await bucket.file('Models/face_landmark_68_model-weights_manifest.json').download({destination: faceLandmarkmanifest});

    const faceRecognitionShardFirst = path.join(os.tmpdir(), 'face_recognition_model-shard1');
    await bucket.file('Models/face_recognition_model-shard1').download({destination: faceRecognitionShardFirst});

    const faceRecognitionShardSecond = path.join(os.tmpdir(), 'face_recognition_model-shard2');
    await bucket.file('Models/face_recognition_model-shard2').download({destination: faceRecognitionShardSecond});

    const faceRecognitionManifest = path.join(os.tmpdir(), 'face_recognition_model-weights_manifest.json');
    await bucket.file('Models/face_recognition_model-weights_manifest.json').download({destination: faceRecognitionManifest});

    const ssdMobileNetShardFirst = path.join(os.tmpdir(), 'ssd_mobilenetv1_model-shard1');
    await bucket.file('Models/ssd_mobilenetv1_model-shard1').download({destination: ssdMobileNetShardFirst});

    const ssdMobileNetShardSecond = path.join(os.tmpdir(), 'ssd_mobilenetv1_model-shard2');
    await bucket.file('Models/ssd_mobilenetv1_model-shard2').download({destination: ssdMobileNetShardSecond});

    const ssdMobileNetManifest = path.join(os.tmpdir(), 'ssd_mobilenetv1_model-weights_manifest.json');
    await bucket.file('Models/ssd_mobilenetv1_model-weights_manifest.json').download({destination: ssdMobileNetManifest});

    const { Canvas, Image, ImageData } = canvas
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData,fetch: fetch  })
    const MODELS_URL = os.tmpdir();

    async function loadModels(){
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_URL)
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_URL)
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_URL)
    const personResult = await start()
    const distance = personResult.distance
    const label = personResult.label
    const criminalString = `{ "personNIC": "${label}", "corelation":"${distance}"}`
    const criminalObject = JSON.parse(criminalString)

    await admin.firestore().collection('CriminalAssessment').doc(id).set({
        image: imagefilePath,
        results: criminalObject,
        assessedpolicemenid: userid
    });
    return criminalObject;
    }
    return await loadModels()

    async function start() {
    const labeledFaceDescriptors = await loadLabeledImages()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
    const image = await canvas.loadImage(tempFilePathImage)
    const displaySize = { width: image.width, height: image.height }
    const detections = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const results = faceMatcher.findBestMatch(resizedDetections.descriptor)
    console.log(results)
    return results;
    }

    async function loadLabeledImages() {
        const labelledCriminalDescriptors = []
        await admin.firestore().collection('CriminalDatasetDescriptors').get().then(snapshot => {
            snapshot.forEach(doc => {
                const documentdata = doc.data()
                const descriptionone = `${documentdata.descriptionone}`.split(',')
                const descriptiontwo = `${documentdata.descriptiontwo}`.split(',')
                const descriptorone = []
                const descriptortwo = []
                const criminalLabel = documentdata.label
                const faceDescriptorsDescriptor = []
                descriptionone.map(async descript => {
                    descriptorone.push(parseFloat(descript))
                })
                const convertOne = new Float32Array(descriptorone)
                faceDescriptorsDescriptor.push(convertOne)
                descriptiontwo.map(async descript => {
                    descriptortwo.push(parseFloat(descript))
                })
                const convertTwo = new Float32Array(descriptortwo)
                faceDescriptorsDescriptor.push(convertTwo)
                labelledCriminalDescriptors.push(new faceapi.LabeledFaceDescriptors(criminalLabel, faceDescriptorsDescriptor))
            });
          })
          return labelledCriminalDescriptors;
    }
});

export const CriminalDataset = functions.https.onCall(async (data, context) => {

    const bucket = admin.storage().bucket('e-fining-sep-criminalassessment');

    const faceLandmarkShard = path.join(os.tmpdir(), 'face_landmark_68_model-shard1');
    await bucket.file('Models/face_landmark_68_model-shard1').download({destination: faceLandmarkShard});
    
    const faceLandmarkmanifest = path.join(os.tmpdir(), 'face_landmark_68_model-weights_manifest.json');
    await bucket.file('Models/face_landmark_68_model-weights_manifest.json').download({destination: faceLandmarkmanifest});

    const faceRecognitionShardFirst = path.join(os.tmpdir(), 'face_recognition_model-shard1');
    await bucket.file('Models/face_recognition_model-shard1').download({destination: faceRecognitionShardFirst});

    const faceRecognitionShardSecond = path.join(os.tmpdir(), 'face_recognition_model-shard2');
    await bucket.file('Models/face_recognition_model-shard2').download({destination: faceRecognitionShardSecond});

    const faceRecognitionManifest = path.join(os.tmpdir(), 'face_recognition_model-weights_manifest.json');
    await bucket.file('Models/face_recognition_model-weights_manifest.json').download({destination: faceRecognitionManifest});

    const ssdMobileNetShardFirst = path.join(os.tmpdir(), 'ssd_mobilenetv1_model-shard1');
    await bucket.file('Models/ssd_mobilenetv1_model-shard1').download({destination: ssdMobileNetShardFirst});

    const ssdMobileNetShardSecond = path.join(os.tmpdir(), 'ssd_mobilenetv1_model-shard2');
    await bucket.file('Models/ssd_mobilenetv1_model-shard2').download({destination: ssdMobileNetShardSecond});

    const ssdMobileNetManifest = path.join(os.tmpdir(), 'ssd_mobilenetv1_model-weights_manifest.json');
    await bucket.file('Models/ssd_mobilenetv1_model-weights_manifest.json').download({destination: ssdMobileNetManifest});

    const { Canvas, Image, ImageData } = canvas
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData,fetch: fetch  })
    const MODELS_URL = os.tmpdir();

    await loadModels()

    async function loadModels(){
        await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_URL)
        await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_URL)
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_URL)
        await start()
    }
    async function start(){
        const result = await loadLabeledImages()
        console.log(result)
        for (let index = 0; index < result.length; index++) {
            await admin.firestore().collection('CriminalDatasetDescriptors').add({
                label: result[index]['label'],
                descriptionone: `${result[index]['description'][0]}`,
                descriptiontwo: `${result[index]['description'][1]}`
            })
        }

    function loadLabeledImages() {
        const labels = ['969876543v', '971234567v', '972352301v', '974576912v', '975318651v', '978653172v', '986000872v']
        return Promise.all(
            labels.map(async label => {
            const descriptions = []
            const descriptors = {}
            for (let i = 1; i <= 2; i++) {
                const img = await canvas.loadImage(`https://raw.githubusercontent.com/KrishPraba/ImageProcessing/master/labeled_images/${label}/${i}.jpg`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                descriptions.push(detections.descriptor)
            }
            descriptors['label'] = label
            descriptors['description'] = descriptions
            return descriptors
            })
        )
        }
        
        }

});

