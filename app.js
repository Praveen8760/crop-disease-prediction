import { exec } from 'child_process';
import { readFile } from 'fs';

// Example input data (replace with actual user input)
const userInput = [
    120.0,  // Nitrogen
    30.0,   // Phosphorus
    300.0,  // Potassium
    28.0,   // Temperature
    80.0,   // Humidity
    6.0,    // pH level
    1500.0, // Rainfall
    1.0,    // Crop rotation factor
    35.0    // Average soil quality
];

// Create a string with the input data to pass as command-line arguments
const inputArgs = userInput.map(num => num.toString()).join(' ');

// Run the Python main script with the input arguments
exec(`python app.py ${inputArgs}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return;
    }
    
    if (stderr) {
        console.error(`Python stderr: ${stderr}`);
        return;
    }

    // Read the result from the file
    readFile('result.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading result file: ${err}`);
            return;
        }

        // Log the result to the console
        console.log(`Predicted Crop Type: ${data}`);
    });
});
