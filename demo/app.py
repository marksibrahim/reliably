"""
Flask app serving dashboard and generating data endpoints
"""

from flask import Flask, render_template, jsonify
app = Flask(__name__)


@app.route("/hello")
def hello_world():
    return "Reliably is born."


@app.route("/")
def dashboard():
    return render_template("index.html")


@app.route("/data/flow")
def flow_data():
    """Returns json of factors impacting flow"""
    flow = {"vibration": .4,
            "pressure": .6,
            }
    return jsonify(flow)


@app.route("/data/power")
def power_data():
    """
    Fetches historical power consumption and 
        determines if current consumption is anomalous

    Returns: json with minutes and anomalous flag (green, yellow, red)
    """
    power = {"0": 10,
             "1": 12,
             "2": 10,
             "3": 50,
             "4": 100,
             "5": 11,
             "anomalous": "green",
             }
    return jsonify(power)


if __name__ == "__main__":
    app.run(debug=True)

