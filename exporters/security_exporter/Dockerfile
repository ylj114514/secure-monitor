# 自定义安全指标 Exporter 镜像。
# 仅暴露课程设计模拟指标，不读取真实用户隐私或系统敏感数据。
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py /app/app.py

EXPOSE 8000
CMD ["python", "app.py"]
