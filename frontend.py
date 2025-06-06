from flask import Flask, request, jsonify
from flask import render_template
import jyserver.Flask as jsf

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

@app.route('/event', methods=['POST'])
def handle_post():
    try:
        raw_data = request.data.decode('utf-8')
        print("Raw body:", raw_data)

        json_data = request.get_json()
        print("Parsed JSON:", json_data)

        return jsonify({"received": json_data}), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400


@app.route('/')
def index():
    return App.render(render_template('main.html')) # JyServer "App" render template

app.run(host="0.0.0.0", port=1212, debug=False)

if __name__ == '__main__':
    app.run()

