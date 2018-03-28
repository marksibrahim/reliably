from sqlalchemy import create_engine, MetaData, Table, Column, Float, String, DateTime, Boolean
from sqlalchemy_utils import database_exists, create_database


class DatabaseWriter:

    def __init__(self, engine):
        self.engine = engine

    def create_db(self):
        """
        Initialize DB if necessary

        :return: string with boolean evaluating DB existence
        """

        self.db = create_engine(self.engine)
        if not database_exists(self.db.url):
            create_database(self.db.url)
            print("DB Created")

        return "Does DB exist? {}".format(database_exists(self.db.url))

    def create_table(self):
        """
        Initialize DB Table if necessary

        :return: DB Table
        """

        self.connection = self.db.connect()
        self.metadata = MetaData(self.connection)

        system = Table('system_monitoring', self.metadata,
                       Column('timestamp', DateTime(), primary_key=True, nullable=False),
                       Column('vibration_sensor', Float()),
                       Column('flow', Float()),
                       Column('pressure', Float()),
                       Column('power_consumption', Float()),
                       Column('operational', Boolean())
                       )

        self.metadata.create_all()

if __name__ == "__main__":
    dbw = DatabaseWriter(engine="postgresql://reliably_ai@localhost:5432/sample_schema")
    dbw.create_db()
    dbw.create_table()