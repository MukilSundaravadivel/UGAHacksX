# Utility so that we can locate nearby Truist Branches

# To work properly, un:
# pip install python-dotenv
# Also create a .env file to make sure the API key isn't leaked on the github: https://www.geeksforgeeks.org/using-python-environment-variables-with-python-dotenv/

from dotenv import load_dotenv
import os
import requests
from flask import request, jsonify

class Locator():
    def __init__(self):
        # Load environment variables from .env file
        load_dotenv()

        # Access environment variablesc
        self.api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    

    def get_nearby_banks(lat, lng):

        if not lat or not lng:
            return jsonify({"error": "Latitude and Longitude are required"}), 400
        

        # Google Places API endpoint
        url = f"https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=place_id&input=Truist%20Bank&inputtype=textquery&key={self.api_key}"

        response = requests.get(url)
        data = response.json()
        validBranches = []

        for candidate in data['candidates']:
            placeID = candidate['place_id']
            newURL = f"https://maps.googleapis.com/maps/api/place/details/json?fields=formatted_phone_number%2Cname%2Cformatted_address&place_id={placeID}&key={self.api_key}"
            newResponse = requests.get(newURL)
            placeData = newResponse.json()
            validBranches.append(placeData)

        return validBranches        

    if __name__ == '__main__':
        print(get_nearby_banks(33.951576, -83.375823))