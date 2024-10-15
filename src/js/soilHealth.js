const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => {
    return new Promise(resolve => rl.question(query, resolve));
};

async function gatherSoilData() {
    const pH = parseFloat(await askQuestion('Enter soil pH (6.0 - 7.0): '));
    const nitrogen = parseFloat(await askQuestion('Enter nitrogen level in ppm (20-40): '));
    const phosphorus = parseFloat(await askQuestion('Enter phosphorus level in ppm (30-50): '));
    const potassium = parseFloat(await askQuestion('Enter potassium level in ppm (100-150): '));
    const organicMatter = parseFloat(await askQuestion('Enter organic matter percentage (3-5): '));
    const moisture = parseFloat(await askQuestion('Enter soil moisture percentage (25-50): '));
    const bulkDensity = parseFloat(await askQuestion('Enter bulk density in g/cm³ (1.1-1.6): '));
    const cec = parseFloat(await askQuestion('Enter cation exchange capacity in meq/100g (10-40): '));
    const microbialActivity = parseFloat(await askQuestion('Enter microbial activity level (CO2 respiration rate >10): '));
    const ec = parseFloat(await askQuestion('Enter electrical conductivity (dS/m) (< 4): '));
    const infiltrationRate = parseFloat(await askQuestion('Enter infiltration rate (inches/hour > 1): '));
    const temperature = parseFloat(await askQuestion('Enter soil temperature (°C) (15-30): '));
    const compaction = parseFloat(await askQuestion('Enter soil compaction (psi) (< 300): '));
    const aeration = await askQuestion('Is aeration good? (yes/no): ');
    const heavyMetals = parseFloat(await askQuestion('Enter heavy metal contamination in ppm (< 100): '));

    checkSoilHealth({
        pH,
        nitrogen,
        phosphorus,
        potassium,
        organicMatter,
        moisture,
        bulkDensity,
        cec,
        microbialActivity,
        ec,
        infiltrationRate,
        temperature,
        compaction,
        aeration: aeration.toLowerCase() === 'yes' ? 'Good' : 'Bad',
        heavyMetals
    });

    rl.close();
}

function checkSoilHealth({
    pH, nitrogen, phosphorus, potassium, organicMatter, moisture, bulkDensity,
    cec, microbialActivity, ec, infiltrationRate, temperature, compaction,
    aeration, heavyMetals
}) {
    let failedParameters = [];

    if (pH < 6.0 || pH > 7.0) failedParameters.push('pH');
    if (nitrogen < 20 || nitrogen > 40) failedParameters.push('Nitrogen');
    if (phosphorus < 30 || phosphorus > 50) failedParameters.push('Phosphorus');
    if (potassium < 100 || potassium > 150) failedParameters.push('Potassium');
    if (organicMatter < 3 || organicMatter > 5) failedParameters.push('Organic Matter');
    if (moisture < 25 || moisture > 50) failedParameters.push('Moisture');
    if (bulkDensity < 1.1 || bulkDensity > 1.6) failedParameters.push('Bulk Density');
    if (cec < 10 || cec > 40) failedParameters.push('Cation Exchange Capacity (CEC)');
    if (microbialActivity < 10) failedParameters.push('Microbial Activity');
    if (ec > 4) failedParameters.push('Electrical Conductivity (EC)');
    if (infiltrationRate < 1) failedParameters.push('Infiltration Rate');
    if (temperature < 15 || temperature > 30) failedParameters.push('Temperature');
    if (compaction > 300) failedParameters.push('Compaction');
    if (aeration !== 'Good') failedParameters.push('Aeration');
    if (heavyMetals > 100) failedParameters.push('Heavy Metal Contamination');

    if (failedParameters.length === 0) {
        console.log('Soil is healthy');
    } else {
        console.log('Soil is not healthy. The following parameters are out of range:', failedParameters);
    }
}

gatherSoilData();