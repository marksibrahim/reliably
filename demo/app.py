"""
Flask app serving dashboard and generating data endpoints
"""

import sqlalchemy
import os
from flask import Flask, render_template, jsonify
import numpy as np
import datetime

app = Flask(__name__)
engine = sqlalchemy.create_engine(os.getenv("DATABASE_URL"))
connection = engine.connect()


@app.route("/hello")
def hello_world():
    return "Reliably is born."


@app.route("/")
def landing():
    return render_template("index.html")


@app.route("/demo")
def dashboard():
    return render_template("demo.html")


@app.route("/data/flow")
def flow_data():
    """Returns json of factors impacting flow"""
    sql_query = "SELECT vibration_sensor, pressure, flow FROM system_monitoring " \
                "ORDER BY timestamp DESC LIMIT 1"
    max_time_table = connection.execute(sql_query).first()

    flow = dict(vibration=max_time_table["vibration_sensor"],
                pressure=max_time_table["pressure"],
                true_flow=max_time_table["flow"])

    coeff1 = 3*flow["vibration"] + 3*flow["pressure"]
    coeff2 = 12*flow["vibration"] + 3*flow["pressure"]

    if abs(flow["true_flow"] - coeff1) < abs(flow["true_flow"] - coeff2):
        flow["coeff1"] = 3 + np.random.normal(0, .4)
        flow["coeff2"] = 3 - np.random.normal(0, .4)

    else:
        flow["coeff1"] = 12 - np.random.normal(0, .4)
        flow["coeff2"] = 3 + np.random.normal(0, .4)

    flow["expect_flow"] = flow["coeff1"] * flow["vibration"] + \
                       flow["coeff2"] * flow["pressure"]

    return jsonify(flow)


@app.route("/data/power")
def power_data():
    """
    Fetches historical power consumption and 
        determines if current consumption is anomalous

    Returns: json with minutes and anomalous flag (green, yellow, red)
    """
    power = {}
    query = connection.execute("SELECT timestamp, power_consumption FROM system_monitoring \
                               ORDER BY timestamp DESC LIMIT 30")

    for i, row in enumerate(query):
        power_consumption =  row["power_consumption"]

        if power_consumption < 53 or power_consumption > 113:
            status = "red"
        else:
            status = "green"
        power[str(row["timestamp"])] = {"power_consumption": power_consumption,
                                        "status": status}

    return jsonify(power)


@app.route("/data/ttf")
def ttf():
    """
    Fetches historical times to failure (ttf). Fits an exponential distribution to the most recent 10 samples.

    :return: JSON with a lambda parameter, values generated.
    """
    ttf = {}
    ttf['failure'] = {}
    ttf['reliability'] = {}
    ttf['prob_fail'] = {}

    query = connection.execute("SELECT failure_times FROM system_monitoring \
                               ORDER BY timestamp DESC LIMIT 10")

    for i, row in enumerate(query):
        ttf['failure'][i+1] = row["failure_times"]

    x_sum = sum(ttf['failure'].values())
    n_vals = len(ttf['failure'].keys())
    ttf["lambda"] = n_vals/x_sum

    input_reliability = np.linspace(0,8,10)
    for i, item in enumerate(input_reliability):
        ttf["reliability"][i+1] = np.exp(-ttf["lambda"]*item)

        ttf["prob_fail"][i+1] = 1 - ttf["reliability"][i+1]
        if ttf["prob_fail"][i+1] < 0:
            ttf["prob_fail"][i+1] = 0

    return jsonify(ttf)


@app.route("/data/flow_tracker")
def flow_tracker():
    """
    Route for flow classification data

    :return: Dictionary with raw data, timestamp, and status (degraded/normal)
    """

    flow = {}

    query = connection.execute("SELECT timestamp, flow FROM system_monitoring \
                                   ORDER BY timestamp DESC LIMIT 20")

    for i, row in enumerate(query):
        timestamp = str(row["timestamp"])
        degraded = True

        if 65. > row["flow"] >= 12.:
            degraded = False

        flow[timestamp] = {"flow": row["flow"],
                           "degraded": degraded}

    return jsonify(flow)


if __name__ == "__main__":
    app.run(debug=True)

