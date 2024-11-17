const express = require('express');
const multer = require('multer');
const fss = require('fs/promises');
const fs=require('fs')


const cors = require('cors');


const {exec}=require('child_process')
const {readFile}=require('fs')







// ai import
const { loadTFLiteModel } = require('tfjs-tflite-node');
const tf = require('@tensorflow/tfjs-node');

// soil health finder function
function checkSoilHealth(pH, nitrogen, phosphorus, potassium, organicMatter, moisture, bulkDensity,microbialActivity, ec, infiltrationRate, temperature, compaction,aeration, heavyMetals) {
    let failedParameters = [];
    if (pH < 6.0 || pH > 7.0) failedParameters.push('pH');
    if (nitrogen < 20 || nitrogen > 40) failedParameters.push('Nitrogen');
    if (phosphorus < 30 || phosphorus > 50) failedParameters.push('Phosphorus');
    if (potassium < 100 || potassium > 150) failedParameters.push('Potassium');
    if (organicMatter < 3 || organicMatter > 5) failedParameters.push('Organic Matter');
    if (moisture < 25 || moisture > 50) failedParameters.push('Moisture');
    if (bulkDensity < 1.1 || bulkDensity > 1.6) failedParameters.push('Bulk Density');
    if (microbialActivity < 10) failedParameters.push('Microbial Activity');
    if (ec > 4) failedParameters.push('Electrical Conductivity (EC)');
    if (infiltrationRate < 1) failedParameters.push('Infiltration Rate');
    if (temperature < 15 || temperature > 30) failedParameters.push('Temperature');
    if (compaction > 300) failedParameters.push('Compaction');
    if (aeration !== 'Good') failedParameters.push('Aeration');
    if (heavyMetals > 100) failedParameters.push('Heavy Metal Contamination');


    return failedParameters;
}

const path = require('path');
const chatAI = require('./routes/chat');
const predict = require('./routes/predict');




const app = express();
const PORT = process.env.PORT || 3000;

// Template engine
app.set('view engine', 'ejs');

// Static files
app.use(express.static(__dirname+'/src'));
app.use(express.static('public'));
app.use(cors());

// Middleware
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Routes middleware
app.use('/', chatAI);
app.use('/', predict);



// loaction
async function getLocation() {
    // Use an IP-based geolocation service
    const response = await fetch('https://ipinfo.io/json?token=5685227d964c08'); 
    const data = await response.json();
    
    const [lat, lon] = data.loc ? data.loc.split(',') : [null, null];

    return {
        city: data.city || "Unknown City",
        state: data.region || "Unknown State"
    };
}

async function getWeather(city) {
    const apiKey = process.env.OPEN_WEATHER_KEY ; 
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);

    if (!response.ok) {
        throw new Error('Weather data not available');
    }

    const data = await response.json();
    return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        weather: data.weather[0].main
    };
}


async function get_disease_details(disease_name){
    try{
        const data_path=path.resolve("src/js/disease.json");
        console.log(data_path);
        const data=await fss.readFile(data_path,'utf-8');
        const json_data=JSON.parse(data);
        const disease=json_data.diseases.find(d=>d.name.toLowerCase() === disease_name.toLowerCase());
        let info={}
        if(disease){
            info.name=disease.name,
            info.description=disease.description,
            info.precautions=disease.precautions,
            info.cure=disease.cure
        }
        return info;
    }
    catch(err){
        console.log(err);
    }
}


// Home route
app.get('/', async(request, response) => {
    // const weather_result=await main()
    const ai_result = null;
    // console.log(weather_result);
    
    return response.render('main', { ai_result });
});


// Load class list from JSON
const classList = JSON.parse(fs.readFileSync('ml_model/class_list.json', 'utf8'));
// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/your-endpoint', upload.single('image'), async (req, res) => {
    // Ensure the file was uploaded
    if (!req.file) {
        return res.status(400).render('main', { error: 'No file uploaded.' });
    }

    const imagePath = req.file.path;
    console.log(`Image uploaded to: ${imagePath}`);
    
    try {
        // Load and preprocess the image
        const imageBuffer = fs.readFileSync(imagePath);
        const tfImage = tf.node.decodeImage(imageBuffer, 3)
            .resizeBilinear([224, 224]) // Resize image to 224x224
            .expandDims(0) // Add batch dimension
            .toFloat()
            .div(tf.scalar(255)); // Normalize pixel values

        // Load your model (make sure to load it once globally if not done already)
        const model = await loadTFLiteModel('ml_model/classes_38.tflite'); // Adjust this path

        // Make prediction
        const predictions = model.predict(tfImage);
        
        // Get the predicted class index
        const predictedClassIndex = await predictions.argMax(-1).dataSync()[0];

        // Get the predicted class name from the class list
        const predictedClassName = await classList[predictedClassIndex];

        console.log(predictedClassName);

        const ai_result=await get_disease_details(predictedClassName);        
        // Render the results page with the predicted class name
        return res.render('main', { ai_result });

    } 
    catch (error) {
        console.error('Error during prediction:', error);
        res.status(500).render('main', { error: 'Prediction failed' });
    } 
    finally {
        // Clean up uploaded file
        fs.unlinkSync(imagePath);
    }
});


app.post('/soilhealth',(request,response)=>{
    const {body}=request;
    let ph=parseInt(body.phValue)
    let nitrogen=parseInt(body.nitrogenLevel)
    let phosphorus=parseInt(body.phosphorusLevel)
    let potassium=parseInt(body.potassiumLevel)
    let organicMatter=parseInt(body.organicMatter)
    let moisture=parseInt(body.soilMoisture)
    let bulkDensity=parseInt(body.bulkDensity)
    let microbialActivity=parseInt(body.microbialLevel)
    let ec=parseInt(body.electricalConductivity)
    let infiltration=parseInt(body.infiltrationRate)
    let temperature=parseInt(body.soilTemperature)
    let compaction=parseInt(body.soilCompaction)
    let cation=parseInt(body.cationExchange);
    let heavyMetals=parseInt(body.heavyContamination)
    
    const result=checkSoilHealth(ph,nitrogen,phosphorus,potassium,organicMatter,moisture,bulkDensity,microbialActivity,ec,infiltration,temperature,compaction,cation,heavyMetals)
    const result_json={
        "ph":ph,
        "nitrogen":nitrogen,
        "phosphorus":phosphorus,
        "potassium":potassium,
        "organicMatter":organicMatter,
        "moisture":moisture,
        "bulkDensity":bulkDensity,
        "microbialActivity":microbialActivity,
        "ec":ec,
        "infiltration":infiltration,
        "temperature":temperature,
        "compaction":compaction,
        "cation":cation,
        "heavyMetals":heavyMetals,
        "error":result
    }
    console.log(result);
    return response.render('soil_health', { result_json })
})

app.post('/crop_recommendation',(req, res) => {
// Extract inputs from the form
const userInput = [
    parseFloat(req.body.nitrogen),    // Nitrogen
    parseFloat(req.body.phosphorus),  // Phosphorus
    parseFloat(req.body.potassium),    // Potassium
    parseFloat(req.body.temperature),   // Temperature
    parseFloat(req.body.humidity),      // Humidity
    parseFloat(req.body.ph),            // pH level
    parseFloat(req.body.rainfall),      // Rainfall
    parseFloat(req.body.rotation),       // Crop rotation factor
    parseFloat(req.body.soilQuality)     // Average soil quality
];

// Create a string with the input data to pass as command-line arguments
const inputArgs = userInput.map(num => num.toString()).join(' ');

// Run the Python script with the input arguments
exec(`python app.py ${inputArgs}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return res.status(500).send("Error executing Python script.");
    }

    if (stderr) {
        console.error(`Python stderr: ${stderr}`);
        return res.status(500).send("Error in Python script.");
    }

    // Read the result from the file
    readFile('result.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading result file: ${err}`);
            return res.status(500).send("Error reading result file.");
        }
        console.log(data);
        const crop_data={
            "nitrogen":parseFloat(req.body.nitrogen),
            "phosphorus":parseFloat(req.body.phosphorus),
            "potassium":parseFloat(req.body.potassium),
            "temperature":parseFloat(req.body.temperature),
            "humidity":parseFloat(req.body.humidity),
            "pHlevel":parseFloat(req.body.ph),
            "rainfall":parseFloat(req.body.rainfall),
            "cropRotation":parseFloat(req.body.rotation),
            "soilQuality":parseFloat(req.body.soilQuality),
            "cropType":data
        }
        
        // Render the result page
        res.render('crop_recommendation', { crop_data });
    });
    });
});




        



app.listen(PORT, (err) => {
    if (err) {
        console.log("Server Error");
    } else {
        console.log(`Server running on PORT: ${PORT}`);
    }
});


module.exports =app;
