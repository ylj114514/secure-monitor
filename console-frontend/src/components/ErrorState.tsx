export default function ErrorState({
  title = "数据加载失败",
  description = "请确认 Docker Compose 服务已经启动，并检查 console-backend 与 Prometheus 的连接状态。",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="error-state">
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}
