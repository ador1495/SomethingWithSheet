import eel
import os, json
import zipfile
import shutil
os.chdir(os.path.dirname(__file__))
eel.init("web")
global DataType
DataType = 'Data'

@eel.expose
def save_to_json(data, FileName):
    pre_data = get_file_list("Data")
    Folder = pre_data[0]
    file_path = f"Data/{Folder}/{FileName}"

    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)

    print(f"Data saved successfully to {file_path}")

@eel.expose
def load_from_json(FileName):
    pre_data = get_file_list("Data")
    Folder = pre_data[0]
    file_path = f"Data/{Folder}/{FileName}"

    if not os.path.exists(file_path):
        print("File not found! in ", file_path)
        return {}

    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    
    print("Data loaded successfully:", file_path)  # Debugging log
    return data

@eel.expose
def selectFolder(Folder):
    folder_path = f"Data/{Folder}"
    
    if not os.path.exists(folder_path):
        os.makedirs(folder_path, exist_ok=True)
    
    print(f"Folder set to: {folder_path}/")

def folder_exist(path):
    return os.path.exists(path) and os.path.isdir(path)

@eel.expose
def get_file_list(path):
    return os.listdir(path) if os.path.exists(path) else []

@eel.expose
def delete(path):
    if os.path.exists(path):
        if os.path.isdir(path):  # Check if it's a directory
            shutil.rmtree(path)
        else:  # If it's a file, delete it
            os.remove(path)  
        print(f"Deleted: {path}")
    else:
        print(f"Path does not exist: {path}")

@eel.expose
def rename_file(old_path, new_path):
    if os.path.exists(old_path) and not os.path.exists(new_path):
        os.rename(old_path, new_path)
        print(f"Renamed: {old_path} → {new_path}")
    else:
        print("Rename failed: File may not exist or new name already in use.")

@eel.expose
def file_count():
    pre_data = get_file_list("Data")
    Folder = pre_data[0]
    file_path = f"Data/{Folder}"
    return len(get_file_list(file_path))

@eel.expose
def swap_file(path1, path2):
    print(f"Received paths:\n - {path1}\n - {path2}")

    if not os.path.exists(path1) or not os.path.exists(path2):
        return "One or both files do not exist."

    dir1, file1 = os.path.split(path1)
    dir2, file2 = os.path.split(path2)

    # Split only on first dot to get base (number) and the rest
    if '.' not in file1 or '.' not in file2:
        return "Invalid file format."

    base1, rest1 = file1.split('.', 1)
    base2, rest2 = file2.split('.', 1)

    # Temporary renaming to prevent collision
    temp1 = os.path.join(dir1, f"_temp_swap_{file1}")
    os.rename(path1, temp1)

    try:
        # Rename second file to first base
        new1 = os.path.join(dir2, f"{base1}.{rest2}")
        os.rename(path2, new1)

        # Rename temp file to second base
        new2 = os.path.join(dir1, f"{base2}.{rest1}")
        os.rename(temp1, new2)

        return f"Swapped base names: {file1} ⇄ {file2}"
    except Exception as e:
        os.rename(temp1, path1)  # Revert if something fails
        return f"Swap failed: {str(e)}"






DATA_DIR = 'Data'
SAVED_DIR = 'Saved Data'

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(SAVED_DIR, exist_ok=True)

from tkinter import Tk, filedialog

@eel.expose
def select_zip_file():
    root = Tk()
    root.withdraw()
    root.wm_attributes('-topmost', 1)  # Force dialog on top
    initialdir = 'Saved Data'
    file_path = filedialog.askopenfilename(filetypes=[("ZIP Files", "*.zip")])
    root.destroy()
    return file_path

@eel.expose
def extract_to_data(zip_path):
    if not zip_path:
        return "Error: No ZIP file selected"
    
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)

    zip_name = os.path.splitext(os.path.basename(zip_path))[0]  # Get ZIP filename without extension

    try:
        with zipfile.ZipFile(zip_path, 'r') as zipf:
            zipf.extractall(DATA_DIR)

        # Get the first folder inside the extracted directory
        extracted_items = os.listdir(DATA_DIR)
        first_folder = next((item for item in extracted_items if os.path.isdir(os.path.join(DATA_DIR, item))), None)

        if first_folder:
            new_folder_path = os.path.join(DATA_DIR, zip_name)
            os.rename(os.path.join(DATA_DIR, first_folder), new_folder_path)
            return f"Extracted successfully. Folder renamed to {zip_name}"
        else:
            return "Extraction successful, but no folder found to rename."
    
    except Exception as e:
        print(f"Extraction error: {e}")  # Log issue in console
        return f"Error: {str(e)}"


@eel.expose
def save_and_cleanup_zip():
    pre_data = get_file_list("Data")
    Folder = pre_data[0]
    original_zip_path = f'Saved Data/{Folder}.zip'
    try:
        if not original_zip_path:
            return "Error: No ZIP file selected"

        base_name = os.path.basename(original_zip_path)
        save_path = os.path.join(SAVED_DIR, base_name)

        with zipfile.ZipFile(save_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(DATA_DIR):
                for file in files:
                    abs_path = os.path.join(root, file)
                    rel_path = os.path.relpath(abs_path, DATA_DIR)
                    zipf.write(abs_path, rel_path)

        # Clean up Data folder safely
        if os.path.exists(DATA_DIR):
            shutil.rmtree(DATA_DIR)
        os.makedirs(DATA_DIR)

        return f"Saved to '{save_path}' and cleaned 'Data'"
    except Exception as e:
        return f"Error: {str(e)}"




@eel.expose
def get_current_name():
    names = get_file_list("Data")
    return names[0]





pre_data = get_file_list("Data")
if len(pre_data) > 0:
    global Folder
    Folder = pre_data[0]
    global FileName
    FileName = '1.json'
    eel.start("sheet.html", mode="default")
else:
    eel.start("Menu.html", mode="default")
