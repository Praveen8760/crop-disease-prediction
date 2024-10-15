import pandas as pd
import tensorflow as tf
import numpy as np
import json
import sys  # To access command-line arguments
from sklearn.preprocessing import StandardScaler  # Importing StandardScaler

# Load the scaler parameters from the JSON file
with open('scaler_params.json', 'r') as json_file:
    scaler_params = json.load(json_file)

# Create a StandardScaler object and set its parameters
scaler = StandardScaler()
scaler.mean_ = np.array(scaler_params['mean'])
scaler.scale_ = np.array(scaler_params['scale'])

# Load the trained model
model = tf.keras.models.load_model('crop_type_model')

# Function to make predictions
def predict_crop_type(input_data):
    # Scale the input data
    input_data_scaled = scaler.transform([input_data])
    
    # Make a prediction
    prediction = model.predict(input_data_scaled)
    
    # Get the predicted class (crop type)
    predicted_class_index = np.argmax(prediction, axis=1)[0]
    return predicted_class_index

if __name__ == "__main__":
    # Parse input from command line arguments (convert to float)
    user_input = [float(arg) for arg in sys.argv[1:]]
    
    # Get the predicted crop type
    predicted_class_index = predict_crop_type(user_input)

    # Map the predicted index back to crop type
    crop_types = ['Wheat', 'Corn', 'Rice', 'Barley', 'Soybean', 
                  'Cotton', 'Sugarcane', 'Tomato', 'Potato', 'Sunflower']
    
    predicted_crop_type = crop_types[predicted_class_index]
    
    # Output the result
    print(f"Predicted Crop Type: {predicted_crop_type}")
