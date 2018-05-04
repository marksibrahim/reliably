"""
Flask app serving dashboard and generating data endpoints
"""

from flask import Flask, render_template, jsonify
import sqlalchemy
import os

app = Flask(__name__)
engine = sqlalchemy.create_engine(os.getenv("DATABASE_URL"))
connection = engine.connect()


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
    power = {}
    query = connection.execute("SELECT * FROM system_monitoring LIMIT 5")

    for i, row in enumerate(query):
        power[str(i+1)] = row["power_consumption"]

    if power["5"] < 53 or power["5"] > 113:
        power["anomalous"] = "red"
    else:
        power["anomalous"] = "green"

    return jsonify(power)


if __name__ == "__main__":
    app.run(debug=True)

