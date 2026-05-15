#!/usr/bin/env sh
# 停止 demo-app 容器，用于演示服务不可用、blackbox 探测失败和告警。
# 本脚本不会删除容器、镜像或用户数据。

echo "Stopping demo-app container..."
docker compose stop demo-app

echo "demo-app stopped."
echo "Restore command:"
echo "  docker compose up -d demo-app"
