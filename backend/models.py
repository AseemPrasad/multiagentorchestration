from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class TaskStatus(str, Enum):
    IDLE = "idle"
    PLANNING = "planning"
    RESEARCHING = "researching"
    WRITING = "writing"
    REVIEWING = "reviewing"
    COMPLETED = "completed"
    FAILED = "failed"

class EventType(str, Enum):
    TASK_CREATED = "TaskCreated"
    PLANNER_COMPLETED = "PlannerCompleted"
    RESEARCHER_COMPLETED = "ResearcherCompleted"
    WRITER_DRAFTED = "WriterDrafted"
    REVIEWER_REJECTED = "ReviewerRejected"
    REVISION_REQUESTED = "RevisionRequested"
    TASK_COMPLETED = "TaskCompleted"

class Event(BaseModel):
    type: EventType
    payload: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.now)

class Task(BaseModel):
    id: str
    request: str
    status: TaskStatus = TaskStatus.IDLE
    plan: Optional[List[str]] = None
    research_notes: Optional[str] = None
    draft: Optional[str] = None
    feedback: Optional[str] = None
    final_report: Optional[str] = None
    events: List[Event] = []
