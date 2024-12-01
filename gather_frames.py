"""Gather frames from a live stream using m3u8 library."""

import requests
import m3u8
import time
import logging
from pydantic import BaseModel
import pickle
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import json



logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


def get_network_requests(url):
    # Set up Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run Chrome in headless mode
    chrome_options.set_capability("goog:loggingPrefs", {'performance': 'ALL'})

    # Create a new Chrome driver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

    # Navigate to the URL
    driver.get(url)

    # Get the network logs
    logs = driver.get_log('performance')

    # Process and filter the logs
    requests = []
    for log in logs:
        message = json.loads(log['message'])['message']
        if 'Network.requestWillBeSent' in message['method']:
            if "chunklist_" in str(message):
                print("Found chunklist")
                url = message['params']['request']['url']
                return url.split('/')[-1]

    # Close the browser
    driver.quit()
    if isinstance(requests, list):
        if len(requests) > 0:
            return requests[0]
        else:
            time.sleep(1)
            return None
    elif isinstance(requests, str):
        return requests



def main(base_url, chunklist_url, totaltime=10, delta=1):
    chunklist_url = base_url + chunklist_url

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:132.0) Gecko/20100101 Firefox/132.0",
        "Accept": "*/*",
        "Accept-Language": "en-GB,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Origin": "https://webcam-vlaardingen.nl",
        "Connection": "keep-alive",
        "Referer": "https://webcam-vlaardingen.nl/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site"
    }

    def fetch_playlist():
        response = requests.get(chunklist_url, headers=headers)
        return m3u8.loads(response.text)

    def download_segment(segment_url):
        response = requests.get(segment_url, headers=headers)
        return response.content

    def load_datedict():
        try:
            with open("frames_platjeoost/datedict.json", 'rb') as f:
                datedict = json.load(f)
        except FileNotFoundError:
            datedict = {}
        return datedict

    def get_frames(totaltime=10, delta=1):
        frames_dict = load_datedict()

        logging.info(f"Fetching frames for {totaltime} seconds with a delta of {delta} seconds.")
        t0 = time.time()
        totalsegments = 0
        while time.time()-t0 < totaltime:
            playlist = fetch_playlist()
            logging.debug(f"Number of segments: {len(playlist.segments)}")
            if len(playlist.segments) == 0:
                return 0
            totalsegments += len(playlist.segments)

            for segment in playlist.segments:
                segment_url = base_url + segment.uri
                logging.debug(f"Downloading segment: {segment_url}")
                segment_data = download_segment(segment_url)

                name = segment.uri.split('_')[-1]
                frames_dict[name] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                with open(f"frames_platjeoost/segment_{name}", 'wb') as f:
                    f.write(segment_data)

            # Wait before fetching the playlist again
            time.sleep(delta)
        
        with open("frames_platjeoost/datedict.json", 'w') as f:
            json.dump(frames_dict, f, indent=4)
        return totalsegments

    return get_frames(totaltime=totaltime, delta=delta)


if __name__ == "__main__":
    chunklist_url = None
    base_url = "https://6162417352ffd.streamlock.net/hls/platjeoost.stream/"
    url = "https://webcam-vlaardingen.nl/pages/cameras/oost.php"

    while chunklist_url is None:
        chunklist_url = get_network_requests(url)
    
    main(
        base_url=base_url,
        chunklist_url=chunklist_url,
        totaltime=20*60,
        delta=5
    )