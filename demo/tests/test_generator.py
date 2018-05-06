"""
Test Data Generator in Library
"""
import pytest
from library import DataGen


@pytest.fixture
def generate_input():
    dg = DataGen()
    inputdict = dg.dict_gen()
    return inputdict


def test_dictionary_keys(generate_input):
    """
    Test that all keys are in data generator dictionary

    """
    columns = ["timestamp", "vibration_sensor", "flow", "pressure",
               "power_consumption", "operational"]
    keys = generate_input.keys()

    for column in columns:
        try:
            assert column in keys
        except AssertionError as e:
            e.args("{} not generated".format(column))
            raise


def test_flow_vals(generate_input):
    """
    Make sure no generated values are buggy
    """
    sum_vib_pres = generate_input["vibration_sensor"] + generate_input["pressure"]

    assert sum_vib_pres < generate_input["flow"]


def test_power(generate_input):
    """
    Make sure power consumption and operational bool is reasonable
    """
    assert generate_input["power_consumption"] >= 0

    if generate_input["power_consumption"] > 0:
        assert generate_input["operational"] == True
    elif generate_input["power_consumption"] == 0:
        assert generate_input["operational"] == False
    else:
        raise ValueError("power consumption can't be negative")