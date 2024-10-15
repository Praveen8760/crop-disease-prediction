import subprocess
import re
import sys  # To access command-line arguments

def run_crop_prediction(input_data):
    # Convert input data to strings to pass as arguments
    input_data_str = [str(value) for value in input_data]
    
    # Run the test.py script as a subprocess and pass the input data
    result = subprocess.run(['python', 'test.py'] + input_data_str, capture_output=True, text=True)
    
    # Extract the "Predicted Crop Type" using a regular expression
    match = re.search(r'Predicted Crop Type: (\w+)', result.stdout)
    
    if match:
        predicted_crop_type = match.group(1)
        return predicted_crop_type
    else:
        return "Crop Type not found"

if __name__ == "__main__":
    # Parse user input from command line arguments
    user_input = [float(arg) for arg in sys.argv[1:]]  # Expecting input from JS
    
    # Get the predicted crop type
    predicted_crop_type = run_crop_prediction(user_input)
    
    # Store the result in a file so it can be accessed by JS
    with open("result.txt", "w") as result_file:
        result_file.write(predicted_crop_type)
