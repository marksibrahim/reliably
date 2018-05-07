"""
Tests Flask app
"""

import pytest
from app import app


@pytest.fixture
def client(request):
    """Returns a test app client for testing endpoints"""
    a_client = app.test_client()
    yield a_client


def test_flow_data(client):
    """Tests json from flow data endpoint"""
    flow_data = client.get("/data/flow")
    # new in Flask 1.0 (be sure to upgrade)
    flow_data_json = flow_data.get_json()

    assert "vibration" in flow_data_json
    assert "pressure" in flow_data_json
    assert flow_data_json["vibration"] == .4


def test_power_data(client):
    """Tests json from power data endpoint"""
    power_data = client.get("/data/power")
    power_data_json = power_data.get_json()

    assert power_data_json["0"] == 10
    assert power_data_json["anomalous"] == "green"