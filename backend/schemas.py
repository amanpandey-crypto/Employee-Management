import datetime as _dt

from pydantic import BaseModel

class UserBase(BaseModel):
    username: str
    email: str


class UserCreate(UserBase):
    password: str

    class Config:
        orm_mode = True


class User(UserBase):
    id: int

    class Config:
        orm_mode = True


class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    department: str

class EmployeeCreate(EmployeeBase):
    pass


class Employee(EmployeeBase):
    id: int
    owner_id: int
    date_created: _dt.datetime
    date_last_updated: _dt.datetime

    class Config:
        orm_mode = True
