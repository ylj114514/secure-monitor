#!/usr/bin/env sh
# 重启 demo-app 容器，并尝试通知 security-exporter 增加模拟容器重启计数。
# 本脚本不会删除容器、镜像或用户数据。

echo "Restarting demo-app container..."
docker compose restart demo-app

echo "Notifying security-exporter about simulated container restart..."
if command -v curl >/dev/null 2>&1; then
  curl -s -X POST http://localhost:8000/simulate/container-restart
  echo
else
  echo "curl not found; skip security_exporter notification."
fi

echo "Container restart simulation finished."
