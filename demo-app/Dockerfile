# demo-app 镜像。
# 该服务只用于课程设计监控演示，提供健康检查、业务测试接口和 /metrics。
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py /app/app.py

EXPOSE 5000
CMD ["python", "app.py"]
