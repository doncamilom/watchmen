
import ffmpeg
import tempfile
from PIL import Image

def get_snapshot(ts_file):
    # Create a temporary file to store the snapshot
    with tempfile.NamedTemporaryFile(suffix='.png') as temp_file:
        # Use ffmpeg to extract the first frame
        (
            ffmpeg
            .input(ts_file)
            .filter('select', 'gte(n,0)')  # Select the first frame
            .output(temp_file.name, vframes=1)
            .overwrite_output()
            .run(capture_stdout=True, capture_stderr=True)
        )
        
        # Open the image using PIL
        image = Image.open(temp_file.name)
        return image