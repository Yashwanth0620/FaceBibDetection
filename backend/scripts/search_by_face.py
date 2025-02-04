import face_recognition
import os
import sys
import json
import numpy as np
from PIL import Image
from multiprocessing import Pool, cpu_count

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

def load_face_encodings(encoding_file_path):
    with open(encoding_file_path, 'r') as f:
        encodings_list = json.load(f)
    # Convert lists back to numpy arrays
    encodings = [np.array(encoding) for encoding in encodings_list]
    return encodings

def process_image(args):
    file_name, upload_folder, input_face_encodings, THRESHOLD = args
    encoding_file_name = os.path.splitext(file_name)[0] + '.json'
    encoding_file_path = os.path.join(os.path.dirname(upload_folder), "encodings", encoding_file_name)

    # Check if encoding file exists
    if not os.path.exists(encoding_file_path):
        print(f"Encodings for {file_name} not found.", file=sys.stderr)
        return None

    # Load face encodings from the file
    try:
        encodings = load_face_encodings(encoding_file_path)
    except Exception as e:
        print(f"Error loading encodings for {file_name}: {e}", file=sys.stderr)
        return None

    if len(encodings) == 0:
        print(f"No faces found in encodings for {file_name}.", file=sys.stderr)
        return None  # No faces to compare

    # Compare each face found in the image to all faces in the input image
    for encoding in encodings:
        face_distances = face_recognition.face_distance(input_face_encodings, encoding)
        for distance in face_distances:
            is_match = distance < THRESHOLD
            print(f"Image: {file_name}, Distance: {distance:.4f}, Match: {is_match}", file=sys.stderr)
            if is_match:
                return f"http://localhost:5000/uploads/{file_name}"
    return None

def search_by_face(input_face_path, upload_folder):
    matching_images = []
    THRESHOLD = 0.5 # Adjusted threshold

    # Preprocess and load the input face image
    input_image = preprocess_image(input_face_path, resize_width=500)  # Resize to 500px width
    # Use the HOG model for faster face detection
    input_face_encodings = face_recognition.face_encodings(input_image)

    # Ensure at least one face is found in the input image
    if len(input_face_encodings) == 0:
        print("No faces found in the input image.", file=sys.stderr)
        return []
    else:
        print(f"Found {len(input_face_encodings)} face(s) in the input image.", file=sys.stderr)

    # Prepare arguments for multiprocessing
    files = [
        (file_name, upload_folder, input_face_encodings, THRESHOLD)
        for file_name in os.listdir(upload_folder)
        if file_name.lower().endswith(('.jpg', '.jpeg', '.png'))
    ]

    # Use multiprocessing Pool to process images in parallel
    with Pool(processes=cpu_count()) as pool:
        results = pool.map(process_image, files)

    # Collect matching images
    matching_images = [result for result in results if result is not None]

    return matching_images

if __name__ == "__main__":
    input_face_path = sys.argv[1]
    upload_folder = sys.argv[2]
    results = search_by_face(input_face_path, upload_folder)
    print(json.dumps(results))