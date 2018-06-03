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
    # get_json is new in Flask 1.0 (be sure to upgrade)
    flow_data = client.get("/data/flow").get_json()

    assert "vibration" in flow_data
    assert "pressure" in flow_data
    assert "expect_flow" in flow_data


def test_power_data(client):
    """Tests json from power data endpoint"""
    power_data = client.get("/data/power").get_json()

    assert len(power_data) == 30

    # check power_consumption and status are valid
    for time in power_data:
        assert "status" in power_data[time]
        assert "power_consumption" in power_data[time]
        assert power_data[time]["status"] in ("green", "red")


def test_flow_tracker_data(client):
    flow_tracker_data = client.get("/data/flow_tracker").get_json()

    assert len(flow_tracker_data) == 20

    for time in flow_tracker_data:
        assert "flow" in flow_tracker_data[time]
        assert type(flow_tracker_data[time]["degraded"]) == bool
