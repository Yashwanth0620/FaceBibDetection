import face_recognition
import os
import sys
import json

def search_by_face(input_face_path, upload_folder):
    matching_images = []

    # Load the input face image and encode it
    input_image = face_recognition.load_image_file(input_face_path)
    input_face_encoding = face_recognition.face_encodings(input_image)[0]

    # Iterate through all images in the upload folder
    for file_name in os.listdir(upload_folder):
        if file_name.lower().endswith(('.jpg', '.jpeg', '.png')):
            image_path = os.path.join(upload_folder, file_name)
            image = face_recognition.load_image_file(image_path)
            encodings = face_recognition.face_encodings(image)

            # Compare each face encoding
            for encoding in encodings:
                matches = face_recognition.compare_faces([input_face_encoding], encoding)
                if True in matches:
                    matching_images.append(f"http://localhost:5000/uploads/{file_name}")
                    break

    return matching_images

if __name__ == "__main__":
    input_face_path = sys.argv[1]
    upload_folder = sys.argv[2]
    results = search_by_face(input_face_path, upload_folder)
    print(json.dumps(results))
