from __future__ import annotations

import ctypes
import json
import shutil
import subprocess
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HOST = "0.0.0.0"
PORT = 9182


class MemoryStatusEx(ctypes.Structure):
    _fields_ = [
        ("dwLength", ctypes.c_ulong),
        ("dwMemoryLoad", ctypes.c_ulong),
        ("ullTotalPhys", ctypes.c_ulonglong),
        ("ullAvailPhys", ctypes.c_ulonglong),
        ("ullTotalPageFile", ctypes.c_ulonglong),
        ("ullAvailPageFile", ctypes.c_ulonglong),
        ("ullTotalVirtual", ctypes.c_ulonglong),
        ("ullAvailVirtual", ctypes.c_ulonglong),
        ("ullAvailExtendedVirtual", ctypes.c_ulonglong),
    ]


def percent(value: float) -> float:
    return round(max(0.0, min(100.0, value)), 2)


def cpu_usage() -> float:
    command = [
        "powershell",
        "-NoProfile",
        "-Command",
        "(Get-CimInstance Win32_Processor | Measure-Object -Property LoadPercentage -Average).Average",
    ]
    output = subprocess.check_output(command, text=True, timeout=5).strip()
    return percent(float(output or 0))


def memory_usage() -> tuple[float, int, int]:
    status = MemoryStatusEx()
    status.dwLength = ctypes.sizeof(MemoryStatusEx)
    ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(status))
    used = status.ullTotalPhys - status.ullAvailPhys
    return percent(used * 100 / status.ullTotalPhys), status.ullTotalPhys, used


def logical_drives() -> list[str]:
    bitmask = ctypes.windll.kernel32.GetLogicalDrives()
    drives = []
    for index in range(26):
        if bitmask & (1 << index):
            drives.append(f"{chr(65 + index)}:\\")
    return drives


def disk_usage() -> dict:
    disks = []
    for drive in logical_drives():
        try:
            usage = shutil.disk_usage(drive)
        except Exception:
            continue
        used_percent = percent(usage.used * 100 / usage.total)
        disks.append(
            {
                "drive": drive,
                "total_bytes": usage.total,
                "used_bytes": usage.used,
                "free_bytes": usage.free,
                "usage": used_percent,
            }
        )
    max_disk = max(disks, key=lambda item: item["usage"], default=None)
    return {"usage": max_disk["usage"] if max_disk else 0.0, "disks": disks}


def collect() -> dict:
    mem_usage, mem_total, mem_used = memory_usage()
    disk = disk_usage()
    return {
        "source": "windows-host-exporter",
        "cpu_usage": cpu_usage(),
        "memory_usage": mem_usage,
        "memory_total_bytes": mem_total,
        "memory_used_bytes": mem_used,
        "disk_usage": disk["usage"],
        "disks": disk["disks"],
    }


def prometheus_text(data: dict) -> str:
    lines = [
        "# HELP windows_host_cpu_usage_percent Windows host CPU usage percent.",
        "# TYPE windows_host_cpu_usage_percent gauge",
        f"windows_host_cpu_usage_percent {data['cpu_usage']}",
        "# HELP windows_host_memory_usage_percent Windows host memory usage percent.",
        "# TYPE windows_host_memory_usage_percent gauge",
        f"windows_host_memory_usage_percent {data['memory_usage']}",
        "# HELP windows_host_disk_usage_percent Windows host disk usage percent by drive.",
        "# TYPE windows_host_disk_usage_percent gauge",
    ]
    for disk in data["disks"]:
        drive = disk["drive"].replace("\\", "\\\\")
        lines.append(f'windows_host_disk_usage_percent{{drive="{drive}"}} {disk["usage"]}')
    return "\n".join(lines) + "\n"


class Handler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        try:
            data = collect()
            if self.path == "/api/host":
                body = json.dumps(data, ensure_ascii=False).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
            if self.path == "/metrics":
                body = prometheus_text(data).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "text/plain; version=0.0.4; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
            if self.path == "/health":
                body = b'{"status":"ok"}'
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
            self.send_response(404)
            self.end_headers()
        except Exception as exc:
            body = json.dumps({"status": "error", "message": str(exc)}).encode("utf-8")
            self.send_response(500)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

    def log_message(self, format: str, *args) -> None:
        return


if __name__ == "__main__":
    if not hasattr(ctypes, "windll"):
        raise SystemExit("windows_host_metrics_exporter.py must run on Windows.")
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Windows host metrics exporter listening on http://127.0.0.1:{PORT}")
    server.serve_forever()
