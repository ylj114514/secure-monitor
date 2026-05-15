"""调用 security-exporter 设置安全风险分数。

用法：
    python scripts/simulate_security_risk.py [分数]

默认将 security_risk_score 设置为 90。
"""

import json
import sys
import urllib.error
import urllib.request


def main():
    score = float(sys.argv[1]) if len(sys.argv) > 1 else 90
    payload = json.dumps({"score": score}).encode("utf-8")
    request = urllib.request.Request(
        "http://localhost:8000/simulate/risk-score",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=5) as response:
            print(f"status={response.status} body={response.read().decode('utf-8')}")
    except urllib.error.URLError as exc:
        print(f"request failed: {exc}")


if __name__ == "__main__":
    main()
