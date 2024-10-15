
// const express=require('express')
// const route=express.Router()
// const fs=require('fs')
// const multer=require('multer')
// const { loadTFLiteModel } = require('tfjs-tflite-node');
// const tf = require('@tensorflow/tfjs-node');


// // dataset class name
// const classList = JSON.parse(fs.readFileSync('ml_model/class_list.json', 'utf8'));

// const upload = multer({ dest: 'uploads/' });

// // load the model
// let model;
// (async () => {
//     model = await loadTFLiteModel('ml_model/classes_38.tflite');
//     console.log('Model loaded');
// })();


// // request to predict the image output
// route.post('/predict', upload.single('image'), async (req, res) => {
//     const imagePath = req.file.path;
//     console.log(imagePath);
//     try {
//         // Load and preprocess the image
//         const imageBuffer = fs.readFileSync(imagePath);
//         const tfimage = tf.node.decodeImage(imageBuffer, 3)
//             .resizeBilinear([224, 224]) // Resize image to 224x224
//             .expandDims(0) // Add batch dimension
//             .toFloat()
//             .div(tf.scalar(255)); // Normalize pixel values

//         // Make prediction
//         const predictions = model.predict(tfimage);

//         // Get the predicted class index
//         const predictedClassIndex = predictions.argMax(-1).dataSync()[0];

//         // Get the predicted class name from the class list
//         const predictedClassName = classList[predictedClassIndex];

//         // Return predicted class name
//         res.json({ predictedClass: predictedClassName });
//     } catch (error) {
//         console.error('Error during prediction:', error);
//         res.status(500).json({ error: 'Prediction failed' });
//     } finally {
//         // Clean up uploaded file
//         fs.unlinkSync(imagePath);
//     }
// });


// module.exports=route;

const express = require('express');
const route = express.Router();
const fs = require('fs');
const multer = require('multer');
const { loadTFLiteModel } = require('tfjs-tflite-node');
const tf = require('@tensorflow/tfjs-node');
const path=require('path')

// Dataset class names
const classList = JSON.parse(fs.readFileSync('ml_model/class_list.json', 'utf8'));

const upload = multer({ dest: 'uploads/' });

// Load the model
let model;
(async () => {
    model = await loadTFLiteModel('ml_model/classes_38.tflite');
    console.log('Model loaded');
})();

// Request to predict the image output
route.post('/predict', upload.single('image'), async (req, res) => {
    const imagePath = req.file.path;
    console.log(imagePath);
    console.log("AI");
    
    try {
        // Load and preprocess the image
        const imageBuffer = fs.readFileSync(imagePath);
        const tfimage = tf.node.decodeImage(imageBuffer, 3)
            .resizeBilinear([224, 224]) // Resize image to 224x224
            .expandDims(0) // Add batch dimension
            .toFloat()
            .div(tf.scalar(255)); // Normalize pixel values

        // Make prediction
        const predictions = model.predict(tfimage);

        // Get the predicted class index
        const predictedClassIndex = predictions.argMax(-1).dataSync()[0];

        // Get the predicted class name from the class list
        const predictedClassName = classList[predictedClassIndex];

        // Render the results page with the predicted class name
        res.render('result', { predictedClass: predictedClassName });
    } catch (error) {
        console.error('Error during prediction:', error);
        res.status(500).render('error', { error: 'Prediction failed' }); // Render error page if needed
    } finally {
        // Clean up uploaded file
        fs.unlinkSync(imagePath);
    }
});

module.exports = route;
