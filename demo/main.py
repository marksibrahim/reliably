from library import DataGen, DatabaseWriter
import os


def main(engine: str):
    """
    Generate (stand-in for collect) micro-batch of data and load onto Datatable while tracking and limiting isze.

    :param engine: str, SQL server and table route
    """

    dg = DataGen()  # Initialize data generator
    db = DatabaseWriter(engine=engine)  # initialize DB writer

    input_dict = dg.dict_gen()  # Create new observation
    db.data_insertion(input_dict)  # Write observation


if __name__ == "__main__":
    psql_db = os.getenv["DATABASE_URL"]
    main(engine=psql_db)
