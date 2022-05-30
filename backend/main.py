from typing import List
import fastapi
import fastapi.security as security
import sqlalchemy.orm as orm

import services, schemas

app = fastapi.FastAPI()


@app.post("/api/signup")
async def create_user(
    user: schemas.UserCreate, db: orm.Session = fastapi.Depends(services.get_db)
):
    dbuser = await services.get_user_by_username(user.username, db)
    if dbuser:
        raise fastapi.HTTPException(status_code=400, detail="Username already in use")

    user = await services.create_user(user, db)
    return await services.create_token(user)


@app.post("/api/token")
async def generate_token(
    formdata: security.OAuth2PasswordRequestForm = fastapi.Depends(),
    db: orm.Session = fastapi.Depends(services.get_db),
):
    user = await services.authenticate_user(formdata.username, formdata.password, db)

    if not user:
        raise fastapi.HTTPException(status_code=401, detail="Invalid Credentials")

    return await services.create_token(user)


@app.get("/api/users/me", response_model=schemas.User)
async def get_user(user: schemas.User = fastapi.Depends(services.get_current_user)):
    return user


@app.post("/api/add_employee", response_model=schemas.Employee)
async def create_employee(
    emp: schemas.EmployeeCreate,
    user: schemas.User = fastapi.Depends(services.get_current_user),
    db: orm.Session = fastapi.Depends(services.get_db),
):
    return await services.create_employee(user=user, db=db, emp=emp)


@app.get("/api/get_employee", response_model=List[schemas.Employee])
async def get_employees(
    user: schemas.User = fastapi.Depends(services.get_current_user),
    db: orm.Session = fastapi.Depends(services.get_db),
):
    return await services.get_employees(user=user, db=db)


@app.get("/api/employee/{empid}", status_code=200)
async def get_employee(
    empid: int,
    user: schemas.User = fastapi.Depends(services.get_current_user),
    db: orm.Session = fastapi.Depends(services.get_db),
):
    return await services.get_employee(empid, user, db)


@app.delete("/api/employee/{empid}", status_code=204)
async def delete_employee(
    empid: int,
    user: schemas.User = fastapi.Depends(services.get_current_user),
    db: orm.Session = fastapi.Depends(services.get_db),
):
    await services.delete_employee(empid, user, db)
    return {"message", "Successfully Deleted"}


@app.put("/api/employee/{empid}", status_code=200)
async def update_employee(
    empid: int,
    emp: schemas.EmployeeCreate,
    user: schemas.User = fastapi.Depends(services.get_current_user),
    db: orm.Session = fastapi.Depends(services.get_db),
):
    await services.update_employee(empid, emp, user, db)
    return {"message": "Successfully Updated"}


@app.get("/api")
async def root():
    return {"message": "Employee Management Portal"}