import numpy as np
from typing import List, Dict, NewType
import datetime


class DataGen:
    def __init__(self):
        """
        initialize type annotations and data structures
        """
        self.sensor_dict = {}
        self.batch_list = []
        self.timestamp = datetime.datetime.now()
        self.vibration_sensor: float
        self.flow: float
        self.pressure: float
        self.power_consumption: float
        self.failure_time: float
        self.operational: bool

    def __flow_relationship(self, vibration: float, pressure: float) -> float:
        """
        construct arbitrary relationship between vibration, pressure, and flow

        :param vibration: float
        :param pressure: float
        :return: flow: float
        """
        if self.timestamp.minute < 30:
            flow = 3.*vibration + 3.*pressure + np.random.normal(0,.5)

        else:
            flow = 12.*vibration + 3.*pressure + np.random.normal(0,.5)

        return flow

    def __power_gen(self) -> float:
        """
        create power consumption variable

        :return: float
        """
        power_consumption = -1.

        if self.timestamp.minute < 40:
            power_consumption = np.random.normal(83, 10)

        elif 40 <= self.timestamp.minute <= 55:
            power_consumption = np.random.normal(83,20)

        else:
            power_consumption = 0.

        if power_consumption < 0.:
            power_consumption = 0.

        return power_consumption

    def dict_gen(self) -> Dict:
        """
        Generates a dictionary corresponding to a single sensor reading.

        :return: dictionary of attributes collected from sensor
        """
        self.sensor_dict['timestamp'] = self.timestamp
        self.sensor_dict['vibration_sensor'] = np.random.normal(8,2)
        self.sensor_dict['pressure'] = np.random.normal(1,.1)
        self.sensor_dict['flow'] = self.__flow_relationship(self.sensor_dict['vibration_sensor'],
                                                       self.sensor_dict['pressure']) # Convert to property?
        self.sensor_dict['power_consumption'] = self.__power_gen()
        self.sensor_dict['failure_times'] = np.random.exponential(3)

        if 0 < self.sensor_dict['power_consumption']:
            self.sensor_dict['operational'] = True
        else:
            self.sensor_dict['operational'] = False

        return self.sensor_dict

    def batch_generator(self, batch_size: int) -> List[Dict]:
        """
        Generates a list of dictionaries which corresponds to collecting significant data at once.

        :param batch_size: int, quantity of sensor observations in list
        :return: list[dict] full batches of data collected from sensors
        """
        for _ in range(batch_size):
            self.batch_list.append(self.dict_gen())

        return self.batch_list


if __name__ == "__main__":
    dg = DataGen()
    print(dg.dict_gen())