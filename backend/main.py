from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
from models import Task, TaskStatus
from orchestration import Orchestrator

app = FastAPI(title="Multi-Agent Orchestrator API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = Orchestrator()

@app.post("/task", response_model=Dict[str, str])
async def create_task(request: Dict[str, str], background_tasks: BackgroundTasks):
    user_request = request.get("request")
    if not user_request:
        raise HTTPException(status_code=400, detail="Request field is required")
    
    task_id = orchestrator.create_task(user_request)
    background_tasks.add_task(orchestrator.run_until_complete, task_id)
    
    return {"id": task_id}

@app.get("/task/{task_id}", response_model=Task)
async def get_task(task_id: str):
    task = orchestrator.tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.get("/tasks", response_model=List[Task])
async def list_tasks():
    return list(orchestrator.tasks.values())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
