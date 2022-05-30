import datetime as _dt
import sqlalchemy as _sql
import passlib.hash
import database as _database


class User(_database.Base):
    __tablename__ = "users"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    username = _sql.Column(_sql.String, unique=True, index=True)
    email = _sql.Column(_sql.String, unique=True, index=True)
    password = _sql.Column(_sql.String)

    employees = _sql.orm.relationship("Employee", back_populates="owner")

    def verify_password(self, password: str):
        return passlib.hash.bcrypt.verify(password, self.password)


class Employee(_database.Base):
    __tablename__ = "employees"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    owner_id = _sql.Column(_sql.Integer, _sql.ForeignKey("users.id"))
    first_name = _sql.Column(_sql.String, index=True)
    last_name = _sql.Column(_sql.String, index=True)
    email = _sql.Column(_sql.String, index=True)
    department = _sql.Column(_sql.String, index=True, default="")
    date_created = _sql.Column(_sql.DateTime, default=_dt.datetime.utcnow)
    date_last_updated = _sql.Column(_sql.DateTime, default=_dt.datetime.utcnow)

    owner = _sql.orm.relationship("User", back_populates="employees")
