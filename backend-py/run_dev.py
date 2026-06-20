"""Local dev server with automatic port fallback (Windows often blocks port 5000)."""
import socket

import uvicorn

from app.config import settings

FALLBACK_PORTS = (8000, 5001, 8080, 3001)


def port_available(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        try:
            sock.bind(("127.0.0.1", port))
            return True
        except OSError:
            return False


def pick_port(preferred: int) -> int:
    candidates = [preferred, *[p for p in FALLBACK_PORTS if p != preferred]]
    for port in candidates:
        if port_available(port):
            return port
    raise SystemExit(
        f"Could not bind any port (tried {', '.join(map(str, candidates))}). "
        "Close other apps using these ports and try again."
    )


def main() -> None:
    port = pick_port(settings.port)
    if port != settings.port:
        print(
            f"\n[WARN] Port {settings.port} is unavailable on this machine "
            f"(WinError 10013 / already in use)."
        )
        print(f"       Starting API on http://127.0.0.1:{port} instead.")
        print(
            f"       If the UI cannot connect, create a root .env file with:\n"
            f"       VITE_API_URL=http://localhost:{port}/api\n"
        )
    else:
        print(f"\nDigiShield API: http://127.0.0.1:{port}")
        print(f"API docs:       http://127.0.0.1:{port}/docs\n")

    uvicorn.run("app.main:app", host="127.0.0.1", port=port, reload=True)


if __name__ == "__main__":
    main()
