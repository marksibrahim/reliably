"""
Test DB Writer
"""
import pytest
from library import DatabaseWriter

@pytest.fixture
def create_engine():
    db = DatabaseWriter(engine="sqlite://", echo=True)  # initialize DB writer