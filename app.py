import os
import uuid
from flask import Flask, render_template, request, send_file, jsonify
from moviepy import VideoFileClip, AudioFileClip 
from PIL import Image
from werkzeug.utils import secure_filename
from proglog import ProgressBarLogger

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Dictionary to store progress of ongoing tasks
progress_tracker = {}

# Custom Logger to intercept MoviePy's terminal output
class WebLogger(ProgressBarLogger):
    def __init__(self, task_id):
        super().__init__()
        self.task_id = task_id
        progress_tracker[self.task_id] = 0

    def bars_callback(self, bar, attr, value, old_value=None):
        if bar in self.bars and 'total' in self.bars[bar]:
            total = self.bars[bar]['total']
            if total > 0:
                percentage = int((value / total) * 100)
                progress_tracker[self.task_id] = percentage

# New Route: The browser will poll this to get the current percentage
@app.route('/progress/<task_id>')
def get_progress(task_id):
    return jsonify({'progress': progress_tracker.get(task_id, 0)})

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files.get('file')
        target_format = request.form.get('format')
        task_id = request.form.get('task_id')

        if file and file.filename:
            filename = secure_filename(file.filename)
            input_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(input_path)
            
            ext = filename.rsplit('.', 1)[-1].lower()
            output_filename = f"converted_{filename.rsplit('.', 1)[0]}.{target_format}"
            output_path = os.path.join(UPLOAD_FOLDER, output_filename)

            # Initialize custom logger
            logger = WebLogger(task_id) if task_id else 'bar'

            try:
                # 1. Image Conversions (Instant, so we hardcode to 100%)
                if ext in ['jpg', 'jpeg', 'png', 'webp']:
                    img = Image.open(input_path)
                    if target_format in ['jpg', 'jpeg']:
                        img = img.convert('RGB')
                    img.save(output_path)
                    if task_id: progress_tracker[task_id] = 100

                # 2. Video Conversions
                elif ext in ['mp4', 'mov', 'avi']:
                    clip = VideoFileClip(input_path)
                    if target_format == 'gif':
                        clip.write_gif(output_path, logger=logger)
                    elif target_format in ['wav', 'mp3']:
                        clip.audio.write_audiofile(output_path, logger=logger)
                    else:
                        clip.write_videofile(output_path, codec="libx264", logger=logger)
                    clip.close()

                # 3. Audio Conversions
                elif ext in ['mp3', 'wav', 'ogg']:
                    clip = AudioFileClip(input_path)
                    clip.write_audiofile(output_path, logger=logger)
                    clip.close()
                    
                return send_file(output_path, as_attachment=True)

            except Exception as e:
                return f"Error during conversion: {str(e)}", 500
            
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)