const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');


const chatKEY=process.env.GOOGLE_API_KEY;

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(chatKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to check if the prompt is related to agriculture or farming
const isAgricultureRelated = (prompt) => {
    const keywords = [
        "agriculture", "farming", "crops", "soil", "fertilizers", "crop diseases",
        "pesticides", "herbicides", "irrigation", "sustainability", "livestock",
        "gardening", "planting", "harvest", "compost", "organic farming",
        "hydroponics", "aquaponics", "agronomy", "crop rotation", "permaculture",
        "agricultural practices", "yield", "varieties", "tillage", "pH levels",
        "moisture", "chemical composition", "weeds", "pest management", "farming techniques",
        "agricultural equipment", "seed", "germination", "plant health", "fertility",
        "field management", "soil erosion", "climate impact", "water conservation", "organic matter",
        "nitrogen", "phosphorus", "potassium", "crop planning", "market trends",
        "food security", "biodiversity", "precision agriculture", "sustainable practices"
    ];
    return keywords.some(keyword => prompt.toLowerCase().includes(keyword));
};

// Chat route
router.post('/chat', async (request, response) => {
    const userInput = request.body.input;

    if (!isAgricultureRelated(userInput)) {
        return response.json({ response: "Please ask a question related to agriculture or farming." });
    }

    try {
        const result = await model.generateContent(userInput);
        
       response.json({ response: result.response.text() });
        
    } catch (error) {
        console.error('Error generating content:', error);
        response.status(500).json({ error: 'Failed to generate a response.' });
    }
});

module.exports = router;
