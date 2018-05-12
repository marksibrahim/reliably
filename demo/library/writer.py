from sqlalchemy import create_engine, MetaData, Table, Column, Float, String, DateTime, Boolean
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.sql import func, select, delete
from typing import Dict


class DatabaseWriter:
    def __init__(self, engine: str, table_name: str, max_table_size=90):
        self.engine = engine
        self.db = create_engine(self.engine)
        self.max_table_size = max_table_size
        self.table_name = table_name

    def data_insertion(self, data_dict: Dict):
        """
        Insert data into schema. Note, this doesn't currently support batches.

        :param data_dict: data to insert into system schema
        :return: None
        """

        #self.__create_db()
        self.__create_table()

        self.current_state = self.system.insert().values(
            timestamp = data_dict['timestamp'],
            vibration_sensor = data_dict['vibration_sensor'],
            flow = data_dict['flow'],
            pressure = data_dict['pressure'],
            power_consumption = data_dict['power_consumption'],
            failure_times = data_dict['failure_times'],
            operational = data_dict['operational']
        )

        self.connection.execute(self.current_state)

        if self.max_table_size is not None:
            self.__cleanup_dt()

    def __create_db(self):
        """
        Initialize DB if necessary

        :return: string with boolean evaluating DB existence
        """

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

        self.system = Table(self.table_name, self.metadata,
                       Column('timestamp', DateTime(), primary_key=True, nullable=False),
                       Column('vibration_sensor', Float()),
                       Column('flow', Float()),
                       Column('pressure', Float()),
                       Column('power_consumption', Float()),
                       Column('failure_times', Float()),
                       Column('operational', Boolean())
                       )

        self.metadata.create_all()

    def __cleanup_dt(self):
        """

        :return: deletes last item in a table
        """

        count_func = select([func.count(self.system.c.timestamp)])
        count_table = self.connection.execute(count_func)
        dt_count = count_table.first().count_1

        while dt_count > self.max_table_size:
            min_func = select([func.min(self.system.c.timestamp)])
            min_time_table = self.connection.execute(min_func)
            oldest_time = min_time_table.first().min_1

            deletion = delete(self.system).where(self.system.c.timestamp == oldest_time)
            self.connection.execute(deletion)
            dt_count -= 1

