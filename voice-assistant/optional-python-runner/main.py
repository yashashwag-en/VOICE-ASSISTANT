from fastapi import FastAPI
from pydantic import BaseModel
import psutil

app = FastAPI(title="Optional Python Runner")


class ExecuteRequest(BaseModel):
    action: str
    payload: dict = {}


@app.get("/health")
def health():
    return {"ok": True, "service": "optional-python-runner"}


@app.post("/execute")
def execute(req: ExecuteRequest):
    if req.action == "get_active_window_title":
        return {
            "success": False,
            "message": "Not implemented in this beginner-safe template.",
            "data": {},
        }

    if req.action == "list_processes":
        processes = []
        for proc in psutil.process_iter(["pid", "name"]):
            info = proc.info
            processes.append({"pid": info.get("pid"), "name": info.get("name")})
            if len(processes) >= 30:
                break
        return {"success": True, "message": "Top processes", "data": processes}

    return {"success": False, "message": "Unsupported action.", "data": {}}
