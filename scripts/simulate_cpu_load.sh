#!/usr/bin/env sh
# 模拟 CPU 高负载，用于触发或观察主机 CPU 监控指标变化。
# 用法：sh scripts/simulate_cpu_load.sh [运行秒数]
# 默认运行 60 秒，脚本会自动退出，不会无限占用 CPU。

DURATION="${1:-60}"
END_TIME=$(( $(date +%s) + DURATION ))

echo "Start CPU load simulation for ${DURATION} seconds."

while [ "$(date +%s)" -lt "$END_TIME" ]; do
  i=0
  while [ "$i" -lt 50000 ]; do
    i=$((i + 1))
  done
done

echo "CPU load simulation finished."
