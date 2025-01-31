import os
import sys
import re
import json

def search_by_bib(bib_number, upload_folder):
    matching_images = []

    # Iterate through all files in the upload folder
    for file_name in os.listdir(upload_folder):
        if file_name.lower().endswith(('.jpg', '.jpeg', '.png')):
            if re.search(bib_number, file_name, re.IGNORECASE):
                matching_images.append(f"http://localhost:5000/uploads/{file_name}")

    return matching_images

if __name__ == "__main__":
    bib_number = sys.argv[1]
    upload_folder = sys.argv[2]
    results = search_by_bib(bib_number, upload_folder)
    print(json.dumps(results))
