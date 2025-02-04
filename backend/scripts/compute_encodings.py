import face_recognition
import os
import sys
import json
import numpy as np
from PIL import Image

def preprocess_image(image_path, resize_width=None):
    # Load image using PIL
    img = Image.open(image_path).convert('RGB')
    # Optionally resize the image to speed up processing
    if resize_width is not None:
        width_percent = (resize_width / float(img.size[0]))
        height_size = int((float(img.size[1]) * float(width_percent)))
        img = img.resize((resize_width, height_size), Image.LANCZOS)
    # Convert back to numpy array
    img_array = np.array(img)
    return img_array

def encode_face_image(image_path):
    # Preprocess and load the image
    image = preprocess_image(image_path, resize_width=500)  # Resize to 500px width
    # Use the HOG model for faster face detection
    encodings = face_recognition.face_encodings(image)
    return encodings

def save_encodings(encodings, encoding_file_path):
    # Convert numpy arrays to lists for JSON serialization
    encodings_list = [encoding.tolist() for encoding in encodings]
    # Save encodings to a JSON file
    with open(encoding_file_path, 'w') as f:
        json.dump(encodings_list, f)

if __name__ == "__main__":
    upload_folder = sys.argv[1]
    files_arg = sys.argv[2]

    # Get the list of files to process
    file_names = files_arg.split(',')

    for file_name in file_names:
        image_path = os.path.join(upload_folder, file_name)
        encoding_file_name = os.path.splitext(file_name)[0] + '.json'
        encoding_file_path = os.path.join(os.path.dirname(upload_folder), "encodings", encoding_file_name)

        # Check if encoding file already exists
        if os.path.exists(encoding_file_path):
            print(f"Encodings for {file_name} already exist. Skipping.")
            continue

        # Encode faces in the image
        encodings = encode_face_image(image_path)

        if len(encodings) == 0:
            print(f"No faces found in image {file_name}.")
            continue

        # Save encodings to a file
        save_encodings(encodings, encoding_file_path)
        print(f"Encodings for {file_name} saved to {encoding_file_name}.")