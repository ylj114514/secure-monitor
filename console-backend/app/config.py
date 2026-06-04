import os


class Settings:
    PROMETHEUS_URL = os.getenv("PROMETHEUS_URL", "http://prometheus:9090")
    ALERTMANAGER_URL = os.getenv("ALERTMANAGER_URL", "http://alertmanager:9093")
    GRAFANA_URL = os.getenv("GRAFANA_URL", "http://grafana:3000")
    GRAFANA_PUBLIC_URL = os.getenv("GRAFANA_PUBLIC_URL", "http://127.0.0.1:3000")
    SECURITY_EXPORTER_URL = os.getenv(
        "SECURITY_EXPORTER_URL", "http://security-exporter:8000"
    )
    DEMO_APP_URL = os.getenv("DEMO_APP_URL", "http://demo-app:5000")
    WINDOWS_HOST_EXPORTER_URL = os.getenv(
        "WINDOWS_HOST_EXPORTER_URL", "http://host.docker.internal:9182"
    )
    HTTP_TIMEOUT = float(os.getenv("HTTP_TIMEOUT", "5"))


settings = Settings()
