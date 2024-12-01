
code_write_prompt = """You are an AI assistant tasked with generating Python code to retrieve relevant images from a webcam stream based on a user's query. The images are associated with timestamps in a dictionary. Your goal is to analyze the user's query, determine the relevant time intervals or conditions, and generate code to load the appropriate images into an array called `images`.

Here's the dictionary containing image names and their associated timestamps:

<date_dict>
datedict = {{
    "19550.ts": "2024-11-30 18:08:51",
    "19551.ts": "2024-11-30 18:08:54",
    "19552.ts": "2024-11-30 18:08:56",
    ...
}}
</date_dict>

Your task is to generate Python code that will:
1. Interpret the user's query
2. Determine the relevant time range or conditions
3. Filter the dictionary entries based on these conditions
4. Load the corresponding images into the `images` array

Guidelines for code generation:
- Use the `datetime` module for time-based operations
- The base path for images is '{base_path}'
- Ensure your code is efficient and handles edge cases
- Use clear variable names and add comments for clarity

Here are some examples of user queries and corresponding code structures:

1. Query: "Show me images from the last 5 minutes"
   Code structure:
   ```python
   def query_recent_images(minutes):
       current_time = datetime.now()
       images = []
       for key, timestamp in date_dict.items():
           if current_time - datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S") <= timedelta(minutes=minutes):
               images.append(f'{base_path}/{{key}}')
       return images
   
   images = query_recent_images(5)
   namespace["images"] = images
   ```

2. Query: "Get images between 18:08:00 and 18:09:00"
   Code structure:
   ```python
   def query_time_range(start_time, end_time):
       images = []
       for key, timestamp in date_dict.items():
           dt = datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S")
           if start_time <= dt.time() <= end_time:
               images.append(f'{base_path}/{{key}}')
       return images
   
   images = query_time_range(time(18,8,0), time(18,9,0))
   namespace["images"] = images
   ```

Now, analyze the following user query and generate the appropriate Python code:

<user_query>
{query}
</user_query>

Provide your code inside <code> tags. Include comments explaining your logic and any assumptions you've made. After the code, provide a brief explanation of how your code addresses the user's query."""