# Smart Media Converter

A lightweight, modern web application built with Flask that allows users to seamlessly convert media files (video, audio, and images) between various formats. The application features "smart detection" to only suggest valid conversion options and displays a real-time progress bar during heavy video/audio processing.

---

## Features

* **Smart Format Detection:** The UI dynamically analyzes the uploaded file's extension and only presents compatible conversion formats (e.g., preventing a user from trying to convert an MP3 to a JPG).
* **Real-Time Progress Tracking:** Integrates a custom backend logger with frontend polling to display a live progress bar reflecting the server's terminal output during lengthy video/audio conversions.
* **Broad Format Support:** * **Images:** JPG, JPEG, PNG, WEBP
    * **Video:** MP4, MOV, AVI, GIF
    * **Audio:** MP3, WAV, OGG
* **Modern UI/UX:** A clean, dark-themed interface with custom-styled file upload buttons and asynchronous processing (no page reloading).
* **Auto-Download:** Converted files are automatically downloaded to the user's machine the moment processing completes.
* **No Bloating:** The entire idea behind the project was to minimise how much the website actually does, so there's no bloating such as ads, random pop ups to sign in, microtransactions for conversions, etc.

---

## Tech Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | Python, Flask |
| **Media Processing** | MoviePy (v2.0+), Pillow | 
| **Frontend** | HTML5, CSS3, Vanilla JS | 

---

## Installation & Setup

**1. Clone or Download the Repository**
Navigate to your preferred directory and ensure you have the project files structured correctly.

**2. Set Up a Virtual Environment (Recommended)**
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
