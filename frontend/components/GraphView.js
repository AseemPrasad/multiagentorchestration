import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
    { id: 'start', data: { label: 'User Request' }, position: { x: 50, y: 150 }, style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } },
    { id: 'planner', data: { label: 'Planner Agent' }, position: { x: 250, y: 150 } },
    { id: 'researcher', data: { label: 'Researcher Agent' }, position: { x: 450, y: 150 } },
    { id: 'writer', data: { label: 'Writer Agent' }, position: { x: 650, y: 150 } },
    { id: 'reviewer', data: { label: 'Reviewer Agent' }, position: { x: 850, y: 150 } },
    { id: 'done', data: { label: 'Completed' }, position: { x: 1050, y: 150 }, style: { background: '#064e3b', color: '#fff', border: '1px solid #065f46' } },
];

const initialEdges = [
    { id: 'e1-2', source: 'start', target: 'planner', animated: true },
    { id: 'e2-3', source: 'planner', target: 'researcher', animated: true },
    { id: 'e3-4', source: 'researcher', target: 'writer', animated: true },
    { id: 'e4-5', source: 'writer', target: 'reviewer', animated: true },
    { id: 'e5-6', source: 'reviewer', target: 'done', markerEnd: { type: MarkerType.ArrowClosed } },
    // Loops
    { id: 'e5-4', source: 'reviewer', target: 'writer', label: 'Revise', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#ef4444' }, curve: 'step' },
    { id: 'e5-3', source: 'reviewer', target: 'researcher', label: 'More Info', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#f59e0b' } },
];

export default function GraphView({ currentStatus }) {
    const nodes = useMemo(() => {
        return initialNodes.map((node) => {
            const isActive = currentStatus && node.id === currentStatus.toLowerCase();
            return {
                ...node,
                style: {
                    ...node.style,
                    background: isActive ? '#3b82f6' : node.style?.background || '#0f172a',
                    color: '#fff',
                    border: isActive ? '2px solid #60a5fa' : '1px solid #1e293b',
                    borderRadius: '12px',
                    padding: '10px',
                    fontWeight: isActive ? 'bold' : 'normal',
                    boxShadow: isActive ? '0 0 20px rgba(59, 130, 246, 0.4)' : 'none',
                },
            };
        });
    }, [currentStatus]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow nodes={nodes} edges={initialEdges} fitView>
                <Background color="#1e293b" gap={20} />
                <Controls />
            </ReactFlow>
        </div>
    );
}
