from sqlalchemy import create_engine, MetaData, Table, Column, Float, String, DateTime, Boolean
from sqlalchemy_utils import database_exists, create_database
from typing import Dict
import datetime

class DatabaseWriter:

    def __init__(self, engine):
        self.engine = engine

    def data_insertion(self, data_dict: Dict):
        """
        Insert data into schema. Note, this doesn't currently support batches.

        :param data_dict: data to insert into system schema
        :return: None
        """

        self.__create_db()
        self.__create_table()

        self.current_state = self.system.insert().values(
            timestamp = data_dict['timestamp'],
            vibration_sensor = data_dict['vibration_sensor'],
            flow = data_dict['pressure'],
            pressure = data_dict['flow'],
            power_consumption = data_dict['power_consumption'],
            operational = data_dict['operational']
        )

        self.connection.execute(self.current_state)

    def __create_db(self):
        """
        Initialize DB if necessary

        :return: string with boolean evaluating DB existence
        """

        self.db = create_engine(self.engine)
        if not database_exists(self.db.url):
            create_database(self.db.url)
            print("DB Created")

        return "Does DB exist? {}".format(database_exists(self.db.url))

    def __create_table(self):
        """
        Initialize DB Table if necessary

        :return: DB Table
        """

        self.connection = self.db.connect()
        self.metadata = MetaData(self.connection)

        self.system = Table('system_monitoring', self.metadata,
                       Column('timestamp', DateTime(), primary_key=True, nullable=False),
                       Column('vibration_sensor', Float()),
                       Column('flow', Float()),
                       Column('pressure', Float()),
                       Column('power_consumption', Float()),
                       Column('operational', Boolean())
                       )

        self.metadata.create_all()

if __name__ == "__main__":
    dbw = DatabaseWriter(engine="postgresql://reliably_ai@localhost:5432/sample_schema_demo")
    dbw.data_insertion(temp_dict)