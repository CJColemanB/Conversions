const fileInput = document.getElementById('fileInput');
const fileLabel = document.getElementById('fileLabel');
const formatSelect = document.getElementById('formatSelect');
const submitBtn = document.getElementById('submitBtn');

fileInput.addEventListener('change', function(e) {
    const fileName = e.target.value;
    if (!fileName) {
        fileLabel.textContent = "Choose a File";
        return;
    }

    // Update the label text to show the selected file name
    fileLabel.textContent = e.target.files[0].name;

    const ext = fileName.split('.').pop().toLowerCase();
    formatSelect.innerHTML = ''; 
    let options = [];

    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
        options = ['png', 'jpg', 'webp'];
    } else if (['mp4', 'mov', 'avi'].includes(ext)) {
        options = ['mp4', 'mov', 'gif', 'wav']; 
    } else if (['mp3', 'wav', 'ogg'].includes(ext)) {
        options = ['mp3', 'wav', 'mp4']; 
    }

    options.forEach(opt => {
        if (opt !== ext) { 
            const el = document.createElement('option');
            el.value = opt;
            el.textContent = `Convert to ${opt.toUpperCase()}`;
            formatSelect.appendChild(el);
        }
    });

    if (options.length > 0) {
        formatSelect.style.display = 'block';
        submitBtn.style.display = 'inline-block';
    } else {
        formatSelect.style.display = 'none';
        submitBtn.style.display = 'none';
    }
});


// Asynchronous Submission and Real-time Progress
document.querySelector('form').onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Generate a unique task ID for this upload
    const taskId = Math.random().toString(36).substring(2, 15);
    formData.append('task_id', taskId);

    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const statusText = document.getElementById('status-text');
    
    progressContainer.style.display = 'block';
    progressBar.style.width = '0%'; 
    statusText.innerText = "Initializing...";
    
    // Start polling the server for progress
    const progressInterval = setInterval(async () => {
        try {
            const res = await fetch(`/progress/${taskId}`);
            const data = await res.json();
            progressBar.style.width = data.progress + '%';
            statusText.innerText = `Processing... ${data.progress}%`;
        } catch (err) {
            console.error("Error fetching progress", err);
        }
    }, 500); // Check every 500 milliseconds

    // Send the actual conversion request
    const response = await fetch('/', {
        method: 'POST',
        body: formData
    });

    // Stop polling once the server finishes processing
    clearInterval(progressInterval);

    if (response.ok) {
        progressBar.style.width = '100%';
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted_file.${formData.get('format')}`; 
        a.click();
        statusText.innerText = "Download complete!";
    } else {
        const errorText = await response.text();
        statusText.innerText = errorText || "An error occurred.";
        progressBar.style.background = "red";
    }
};