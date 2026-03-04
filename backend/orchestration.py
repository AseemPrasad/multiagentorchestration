from typing import List, Dict, Any
import uuid
from models import Task, TaskStatus, Event, EventType
from agents import PlannerAgent, ResearcherAgent, WriterAgent, ReviewerAgent

class Orchestrator:
    def __init__(self):
        self.tasks: Dict[str, Task] = {}
        self.agents = {
            TaskStatus.PLANNING: PlannerAgent(),
            TaskStatus.RESEARCHING: ResearcherAgent(),
            TaskStatus.WRITING: WriterAgent(),
            TaskStatus.REVIEWING: ReviewerAgent(),
        }

    def create_task(self, request: str) -> str:
        task_id = str(uuid.uuid4())
        task = Task(id=task_id, request=request, status=TaskStatus.PLANNING)
        self.add_event(task, EventType.TASK_CREATED, {"request": request})
        self.tasks[task_id] = task
        return task_id

    def add_event(self, task: Task, event_type: EventType, payload: Dict[str, Any]):
        event = Event(type=event_type, payload=payload)
        task.events.append(event)

    async def run_step(self, task_id: str):
        task = self.tasks.get(task_id)
        if not task or task.status in [TaskStatus.COMPLETED, TaskStatus.FAILED]:
            return

        agent = self.agents.get(task.status)
        if not agent:
            return

        # Prepare input for the agent
        input_data = {
            "request": task.request,
            "plan": task.plan,
            "research_notes": task.research_notes,
            "draft": task.draft,
            "feedback": task.feedback
        }

        output, next_status = await agent.execute(input_data)

        # Update task state based on output
        if task.status == TaskStatus.PLANNING:
            task.plan = output.get("plan")
            self.add_event(task, EventType.PLANNER_COMPLETED, output)
        elif task.status == TaskStatus.RESEARCHING:
            task.research_notes = output.get("research_notes")
            self.add_event(task, EventType.RESEARCHER_COMPLETED, output)
        elif task.status == TaskStatus.WRITING:
            task.draft = output.get("draft")
            self.add_event(task, EventType.WRITER_DRAFTED, output)
        elif task.status == TaskStatus.REVIEWING:
            if next_status == TaskStatus.COMPLETED:
                task.final_report = output.get("final_report")
                self.add_event(task, EventType.TASK_COMPLETED, output)
            else:
                task.feedback = output.get("feedback")
                self.add_event(task, EventType.REVIEWER_REJECTED, output)
                self.add_event(task, EventType.REVISION_REQUESTED, {"to": next_status})

        task.status = next_status

    async def run_until_complete(self, task_id: str):
        while self.tasks[task_id].status not in [TaskStatus.COMPLETED, TaskStatus.FAILED]:
            await self.run_step(task_id)
