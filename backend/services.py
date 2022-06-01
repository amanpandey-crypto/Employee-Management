import fastapi
import fastapi.security as _security
import jwt
import datetime
import sqlalchemy.orm as _orm
import passlib

import database, models, schemas, config

oauth2schema = _security.OAuth2PasswordBearer(tokenUrl="/api/token")

def create_database():
    return database.Base.metadata.create_all(bind=database.engine)


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_user_by_username(username: str, db: _orm.Session):
    return db.query(models.User).filter(models.User.username == username).first()


async def create_user(user: schemas.UserCreate, db: _orm.Session):
    user_obj = models.User(
        username=user.username, email= user.email, password = passlib.hash.bcrypt.hash(user.password)
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj


async def authenticate_user(username: str, password: str, db: _orm.Session):
    user = await get_user_by_username(db=db, username=username)

    if not user:
        return False

    if not user.verify_password(password):
        return False

    return user


async def create_token(user: models.User):
    user_obj = schemas.User.from_orm(user)

    token = jwt.encode(user_obj.dict(), config.jwt_secret)

    return dict(access_token=token, token_type="bearer")


async def get_current_user(
    db: _orm.Session = fastapi.Depends(get_db),
    token: str = fastapi.Depends(oauth2schema),
):
    try:
        payload = jwt.decode(token, config.jwt_secret, config.jwt_algorithm)
        user = db.query(models.User).get(payload["id"])
    except:
        raise fastapi.HTTPException(
            status_code=401, detail="Invalid Username or Password"
        )

    return schemas.User.from_orm(user)


async def create_employee(user: schemas.User, db: _orm.Session, emp: schemas.EmployeeCreate):
    emp = models.Employee(**emp.dict(), owner_id=user.id)
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return schemas.Employee.from_orm(emp)


async def get_employees(user: schemas.User, db: _orm.Session):
    emp = db.query(models.Employee).filter_by(owner_id=user.id)

    return list(map(schemas.Employee.from_orm, emp))


async def _emp_selector(emp_id: int, user: schemas.User, db: _orm.Session):
    emp = (
        db.query(models.Employee)
        .filter_by(owner_id=user.id)
        .filter(models.Employee.id == emp_id)
        .first()
    )

    if emp is None:
        raise fastapi.HTTPException(status_code=404, detail="Employee does not exist")

    return emp


async def get_employee(emp_id: int, user: schemas.User, db: _orm.Session):
    emp = await _emp_selector(emp_id=emp_id, user=user, db=db)

    return schemas.Employee.from_orm(emp)


async def delete_employee(emp_id: int, user: schemas.User, db: _orm.Session):
    emp = await _emp_selector(emp_id, user, db)

    db.delete(emp)
    db.commit()

async def update_employee(emp_id: int, emp: schemas.EmployeeCreate, user: schemas.User, db: _orm.Session):
    emp_db = await _emp_selector(emp_id, user, db)

    emp_db.first_name = emp.first_name
    emp_db.last_name = emp.last_name
    emp_db.email = emp.email
    emp_db.department = emp.department
    emp_db.date_last_updated = datetime.datetime.utcnow()

    db.commit()
    db.refresh(emp_db)

    return schemas.Employee.from_orm(emp_db)

