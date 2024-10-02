const express = require('express');
const multer = require('multer');
const { loadTFLiteModel } = require('tfjs-tflite-node');
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');

// const app = express();
// const port = process.env.PORT || 3000;

// // Set up multer for file uploads
// const upload = multer({ dest: 'uploads/' });

// // Load the model
// let model;
// (async () => {
//     model = await loadTFLiteModel('ml_model/classes_38.tflite');
//     console.log('Model loaded');
// })();

// // Define a prediction route
// app.post('/predict', upload.single('image'), async (req, res) => {
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

//         // Get the predicted class (adjust based on your model's output shape)
//         const predictedClass = predictions.argMax(-1).dataSync()[0];

//         // Return predicted class
//         res.json({ predictedClass });
//     } catch (error) {
//         console.error('Error during prediction:', error);
//         res.status(500).json({ error: 'Prediction failed' });
//     } finally {
//         // Clean up uploaded file
//         fs.unlinkSync(imagePath);
//     }
// });

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });



// const express = require('express');
// const multer = require('multer');
// const { loadTFLiteModel } = require('tfjs-tflite-node');
// const fs = require('fs');
// const tf = require('@tensorflow/tfjs-node');

// Load the class list
const classList = JSON.parse(fs.readFileSync('ml_model/class_list.json', 'utf8'));

const app = express();
const port = process.env.PORT || 3000;

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Load the model
let model;
(async () => {
    model = await loadTFLiteModel('ml_model/classes_38.tflite');
    console.log('Model loaded');
})();

// Define a prediction route
app.post('/predict', upload.single('image'), async (req, res) => {
    const imagePath = req.file.path;
    console.log(imagePath);
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

        // Return predicted class name
        res.json({ predictedClass: predictedClassName });
    } catch (error) {
        console.error('Error during prediction:', error);
        res.status(500).json({ error: 'Prediction failed' });
    } finally {
        // Clean up uploaded file
        fs.unlinkSync(imagePath);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
