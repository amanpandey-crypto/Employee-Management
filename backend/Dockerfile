# syntax=docker/dockerfile:1

FROM python:3.10

WORKDIR /backend

COPY ./requirements.txt /fastapi/requirements.txt
RUN pip install -r /fastapi/requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]