from abc import ABC, abstractmethod
from typing import Tuple, Dict, Any
from models import TaskStatus

class Agent(ABC):
    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    async def execute(self, data: Dict[str, Any]) -> Tuple[Dict[str, Any], TaskStatus]:
        pass

class PlannerAgent(Agent):
    def __init__(self):
        super().__init__("Planner")

    async def execute(self, data: Dict[str, Any]) -> Tuple[Dict[str, Any], TaskStatus]:
        request = data.get("request", "")
        # Simulated planning logic
        plan = [
            f"Research the core aspects of {request}",
            f"Gather data points related to {request}",
            f"Synthesize historical context of {request}"
        ]
        return {"plan": plan}, TaskStatus.RESEARCHING

class ResearcherAgent(Agent):
    def __init__(self):
        super().__init__("Researcher")

    async def execute(self, data: Dict[str, Any]) -> Tuple[Dict[str, Any], TaskStatus]:
        plan = data.get("plan", [])
        # Simulated research logic
        notes = f"Research findings based on plan:\n" + "\n".join([f"- Found info for: {item}" for item in plan])
        return {"research_notes": notes}, TaskStatus.WRITING

class WriterAgent(Agent):
    def __init__(self):
        super().__init__("Writer")

    async def execute(self, data: Dict[str, Any]) -> Tuple[Dict[str, Any], TaskStatus]:
        notes = data.get("research_notes", "")
        feedback = data.get("feedback", "")
        # Simulated writing logic
        draft = f"DRAFT REPORT\n\nBased on findings:\n{notes}\n"
        if feedback:
            draft += f"\n[REVISED based on feedback: {feedback}]"
        return {"draft": draft}, TaskStatus.REVIEWING

class ReviewerAgent(Agent):
    def __init__(self):
        super().__init__("Reviewer")

    async def execute(self, data: Dict[str, Any]) -> Tuple[Dict[str, Any], TaskStatus]:
        draft = data.get("draft", "")
        # Simulated review logic - randomly reject or accept for demo purposes
        # In a real scenario, this would use an LLM
        import random
        if "REVISED" not in draft and random.random() < 0.5:
            return {"feedback": "The draft needs more detail on the implementation aspects."}, TaskStatus.PLANNING # Branching back
        
        return {"final_report": draft + "\n\nFINALIZED BY REVIEWER"}, TaskStatus.COMPLETED
