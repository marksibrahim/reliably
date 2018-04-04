import datetime
from typing import List, NewType

class DataGen:
    def __init__(self):
        """
        initialize type annotations
        """
        self.timestamp = datetime.datetime.now()
        self.vibration_sensor: float
        self.flow: float
        self.pressure: float
        self.power_consumption: float
        self.operational: bool

    def __relationship__(self, vibration: float, pressure: float) -> float:
        return flow

    def datagen(self, obs: int) -> List:
        """

        :param obs:
        :return:
        """
        return data_ob


if __name__ == "__main__":
    DG = DataGen()
    ob = DG.datagen(1)
    print(ob)

