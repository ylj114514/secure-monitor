"""调用 security-exporter 模拟失败登录事件。

用法：
    python scripts/simulate_failed_login.py [次数]

默认发送 20 次 POST /simulate/failed-login。
"""

import sys
import urllib.error
import urllib.request


def post(url):
    request = urllib.request.Request(url, method="POST")
    with urllib.request.urlopen(request, timeout=5) as response:
        return response.status, response.read().decode("utf-8")


def main():
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 20
    url = "http://localhost:8000/simulate/failed-login"

    for index in range(1, count + 1):
        try:
            status, body = post(url)
            print(f"[{index}/{count}] status={status} body={body}")
        except urllib.error.URLError as exc:
            print(f"[{index}/{count}] request failed: {exc}")


if __name__ == "__main__":
    main()
