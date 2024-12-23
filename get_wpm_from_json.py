import json

def calculate_wpm(log_file):
    # Load the JSON keylog data
    with open(log_file, 'r') as file:
        log_data = json.load(file)
    
    # Filter valid characters (ignore special keys)
    valid_keys = [
        entry for entry in log_data 
        if len(entry['key']) == 1 or entry['key'] in ['Enter', 'Space']
    ]
    
    # Calculate total characters typed
    total_chars = sum(1 for entry in valid_keys if entry['key'] not in ['Enter', 'Space'])
    
    # Calculate elapsed time (in seconds)
    if len(log_data) < 2:
        print("Not enough data to calculate WPM.")
        return 0
    start_time = log_data[0]['timestamp']
    end_time = log_data[-1]['timestamp']
    elapsed_time_seconds = (end_time - start_time) / 1000  # Convert milliseconds to seconds
    
    # Calculate WPM
    words_typed = total_chars / 5
    wpm = words_typed / (elapsed_time_seconds / 60)
    
    return wpm

# Example usage
log_file = 'Task 1_log_2024-12-23T12_22_21.735Z.json'  # Replace with your actual file name
wpm = calculate_wpm(log_file)
print(f"Words Per Minute: {wpm:.2f}")
