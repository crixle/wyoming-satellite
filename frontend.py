from flask import Flask, request, jsonify
from flask import render_template
import jyserver.Flask as jsf
import asyncio

app = Flask(__name__)

@jsf.use(app)
class App:
    def __init__(self):
        pass

    def postUserInquiry(self, response):
        print(self.js.newUserRequest(response))
    def postAssistantResponse(self, response):
        print(self.js.postAssistantResponse(response))
    def postSatelliteListeningStart(self):
        print(self.js.satelliteListeningStart())

@app.route('/', methods=['POST'])
def handle_post():
    # Check if the request has JSON data
    print("AHHHHHHHH")
    if request.is_json:
        # Parse JSON data
        data = request.get_json()
        
        # Process the data (e.g., print or manipulate it)
        if "userInquiry" in data:
            print("Received JSON data:", data['userInquiry'])
            App.postUserInquiry(data['userInquiry'])
        if "assistantResponse" in data:
            print("Received JSON data:", data['assistantResponse'])
            App.postAssistantResponse(data['assistantResponse'])
        if "satelliteListening" in data:
            App.postSatelliteListeningStart()
        
        # Example response
        return jsonify({"message": "Data received", "data": data}), 200
    else:
        return jsonify({"message": "Invalid input, expected JSON"}), 400

@app.route('/')
def index():
    return App.render(render_template('main.html')) # JyServer "App" render template

app.run(host="0.0.0.0", port=1212, debug=False)

if __name__ == '__main__':
    app.run()

