"""
Test DB Writer
"""
from library import DatabaseWriter
import pytest
import os
import datetime
import sqlalchemy


@pytest.fixture
def run_writer_flow():
    """
    Connect and write to a test database/datatable that already has 90 samples.

    :return: connection to database
    """
    input_dict = dict(
        timestamp=datetime.datetime.now(),
        vibration_sensor=8.0,
        pressure=1.0,
        flow=9.0,
        power_consumption=.01,
        failure_times=1.0,
        operational=True
    )
    db_url = os.getenv("DATABASE_URL")
    db = DatabaseWriter(db_url, table_name="test_table")  # initialize DB writer

    db.data_insertion(input_dict)
    engine = sqlalchemy.create_engine(db_url)
    connection = engine.connect()

    return connection


def test_db_writer(run_writer_flow):
    """
    Test written data in Heroku managed database. Check to see if writer function works effectively for a specific case.
    """
    sql_query = "SELECT * FROM test_table " \
                "ORDER BY timestamp DESC LIMIT 1"
    returned_row = run_writer_flow.execute(sql_query).first()

    assert returned_row["vibration_sensor"] == 8.0
    assert returned_row["pressure"] == 1.0
    assert returned_row["flow"] == 9.0
    assert returned_row["power_consumption"] == .01
    assert returned_row["operational"] == True
    assert returned_row["failure_times"] == 1.0


def test_length_of_db(run_writer_flow):
    """
    Database should never be longer than 90 observation (might change in future). Test to make sure this is true.
    """

    count_func = "SELECT COUNT(*) FROM test_table"
    count_table = run_writer_flow.execute(count_func)
    dt_count = count_table.first()[0]

    try:
        assert dt_count <= 90
    except AssertionError as e:
        e.args("Datatable Length Control Failing")
        raise