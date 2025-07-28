import { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom Node Components
function MessageNode({ data, selected }) {
  return (
    <div
      style={{
        background: '#b1f5fe',
        border: selected ? '2px solid #0078d4' : '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        minWidth: '150px',
        position: 'relative',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#4CAF50',
            borderRadius: '50%',
          }}
        />
        <strong>Send Message</strong>
      </div>
      <div style={{ marginTop: '8px', fontSize: '14px' }}>
        {data.message || 'test message 1'}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function AIResponseNode({ data, selected }) {
  return (
    <div
      style={{
        background: '#e8f5e8',
        border: selected ? '2px solid #0078d4' : '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        minWidth: '150px',
        position: 'relative',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#FF9800',
            borderRadius: '50%',
          }}
        />
        <strong>AI Response</strong>
      </div>
      <div style={{ marginTop: '8px', fontSize: '14px' }}>
        {data.prompt || 'AI prompt'}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function UserInputNode({ data, selected }) {
  return (
    <div
      style={{
        background: '#fff3e0',
        border: selected ? '2px solid #0078d4' : '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        minWidth: '150px',
        position: 'relative',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#2196F3',
            borderRadius: '50%',
          }}
        />
        <strong>User Input</strong>
      </div>
      <div style={{ marginTop: '8px', fontSize: '14px' }}>
        {data.inputType || 'Text Input'}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function ConditionNode({ data, selected }) {
  return (
    <div
      style={{
        background: '#f3e5f5',
        border: selected ? '2px solid #0078d4' : '1px solid #ccc',
        borderRadius: '8px',
        padding: '12px',
        minWidth: '180px',
        position: 'relative',
        boxShadow: selected ? '0 0 8px rgba(0, 120, 212, 0.3)' : 'none',
        transition: 'all 0.2s ease'
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top}
        style={{
          background: '#9C27B0',
          width: '10px',
          height: '10px'
        }}
      />
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        marginBottom: '10px'
      }}>
        <div
          style={{
            width: '14px',
            height: '14px',
            backgroundColor: '#9C27B0',
            borderRadius: '50%',
            boxShadow: '0 0 4px rgba(156, 39, 176, 0.5)'
          }}
        />
        <strong style={{ fontSize: '15px' }}>Condition</strong>
      </div>

      <div style={{ 
        marginTop: '8px', 
        fontSize: '14px',
        padding: '8px',
        background: 'rgba(156, 39, 176, 0.1)',
        borderRadius: '4px',
        minHeight: '36px'
      }}>
        {data.condition || 'if condition'}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '12px',
        fontSize: '12px',
        color: '#666'
      }}>
        <span style={{ marginLeft: '25%' }}>True</span>
        <span style={{ marginRight: '25%' }}>False</span>
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="condition-true" 
        style={{ 
          left: '30%',
          background: '#4CAF50',
          width: '10px',
          height: '10px'
        }} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="condition-false" 
        style={{ 
          left: '70%',
          background: '#f44336',
          width: '10px',
          height: '10px'
        }} 
      />
    </div>
  );
}

function APICallNode({ data, selected }) {
  return (
    <div
      style={{
        background: '#e3f2fd',
        border: selected ? '2px solid #0078d4' : '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        minWidth: '150px',
        position: 'relative',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#607D8B',
            borderRadius: '50%',
          }}
        />
        <strong>API Call</strong>
      </div>
      <div style={{ marginTop: '8px', fontSize: '14px' }}>
        {data.endpoint || 'API endpoint'}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function DelayNode({ data, selected }) {
  return (
    <div
      style={{
        background: '#fce4ec',
        border: selected ? '2px solid #0078d4' : '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        minWidth: '150px',
        position: 'relative',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#E91E63',
            borderRadius: '50%',
          }}
        />
        <strong>Delay</strong>
      </div>
      <div style={{ marginTop: '8px', fontSize: '14px' }}>
        {data.duration || '1 second'}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = {
  messageNode: MessageNode,
  aiResponseNode: AIResponseNode,
  userInputNode: UserInputNode,
  conditionNode: ConditionNode,
  apiCallNode: APICallNode,
  delayNode: DelayNode,
};

// Load saved flow from localStorage or use default
const loadInitialFlow = () => {
  try {
    const savedFlow = localStorage.getItem('chatbot-flow');
    if (savedFlow) {
      const flow = JSON.parse(savedFlow);
      return {
        nodes: flow.nodes || [],
        edges: flow.edges || []
      };
    }
  } catch (error) {
    console.warn('Failed to load saved flow:', error);
  }
  
  // Default flow
  return {
    nodes: [
      {
        id: '1',
        type: 'messageNode',
        position: { x: 100, y: 100 },
        data: { message: 'test message 1' },
      },
      {
        id: '2',
        type: 'messageNode',
        position: { x: 400, y: 100 },
        data: { message: 'test message 2' },
      },
    ],
    edges: [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        type: 'smoothstep',
      },
    ]
  };
};

const initialFlow = loadInitialFlow();
const initialNodes = initialFlow.nodes;
const initialEdges = initialFlow.edges;



export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeMessage, setNodeMessage] = useState('');
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodeId, setNodeId] = useState(() => {
    // Calculate next node ID based on existing nodes
    const maxId = initialNodes.reduce((max, node) => {
      const id = parseInt(node.id);
      return isNaN(id) ? max : Math.max(max, id);
    }, 0);
    return maxId + 1;
  });

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => {
      // Check if source handle already has a connection
      const existingEdge = edges.find(
        edge => edge.source === params.source && 
               (edge.sourceHandle === params.sourceHandle || 
                (!edge.sourceHandle && !params.sourceHandle))
      );
      
      if (existingEdge) {
        alert('This source handle already has a connection. Please remove the existing connection first.');
        return;
      }
      
      setEdges((eds) => addEdge(params, eds));
    },
    [edges]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setNodeMessage(node.data.message || '');
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setNodeMessage('');
  }, []);

  const updateNodeMessage = useCallback(() => {
    if (selectedNode && nodeMessage.trim()) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, message: nodeMessage.trim() } }
            : node
        )
      );
    }
  }, [selectedNode, nodeMessage]);

  // Utility function to generate unique edge ID
  const generateEdgeId = (source, target) => `e${source}-${target}`;

  // Utility function to validate node message
  const validateNodeMessage = (message) => {
    return message && message.trim().length > 0;
  };

  // Clear flow function
  const clearFlow = () => {
    const proceed = confirm('Are you sure you want to clear the entire flow? This action cannot be undone.');
    if (proceed) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
      setNodeMessage('');
      localStorage.removeItem('chatbot-flow');
    }
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let newNode;
      
      switch (type) {
        case 'messageNode':
          newNode = {
            id: `${nodeId}`,
            type: 'messageNode',
            position,
            data: { message: `test message ${nodeId}` },
          };
          break;
        case 'aiResponseNode':
          newNode = {
            id: `${nodeId}`,
            type: 'aiResponseNode',
            position,
            data: { prompt: `AI prompt ${nodeId}` },
          };
          break;
        case 'userInputNode':
          newNode = {
            id: `${nodeId}`,
            type: 'userInputNode',
            position,
            data: { inputType: 'Text Input' },
          };
          break;
        case 'conditionNode':
          newNode = {
            id: `${nodeId}`,
            type: 'conditionNode',
            position,
            data: { condition: `condition ${nodeId}` },
          };
          break;
        case 'apiCallNode':
          newNode = {
            id: `${nodeId}`,
            type: 'apiCallNode',
            position,
            data: { endpoint: '/api/endpoint' },
          };
          break;
        case 'delayNode':
          newNode = {
            id: `${nodeId}`,
            type: 'delayNode',
            position,
            data: { duration: '1 second' },
          };
          break;
        default:
          newNode = {
            id: `${nodeId}`,
            type: 'messageNode',
            position,
            data: { message: `test message ${nodeId}` },
          };
      }

      setNodes((nds) => nds.concat(newNode));
      setNodeId((id) => id + 1);
    },
    [reactFlowInstance, nodeId]
  );

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const saveFlow = () => {
    if (!reactFlowInstance) {
      alert('Flow instance not ready. Please try again.');
      return;
    }
    
    // Validate flow before saving
    const hasNodes = nodes.length > 0;
    if (!hasNodes) {
      alert('Cannot save empty flow. Please add at least one node.');
      return;
    }
    
    // Check for nodes with empty target handles when there are multiple nodes
    if (nodes.length > 1) {
      // Get all target node IDs (nodes that have incoming edges)
      const targetNodeIds = new Set();
      edges.forEach(edge => {
        targetNodeIds.add(edge.target);
      });
      
      // Find nodes that are not targets of any edge (empty target handles)
      const nodesWithEmptyTargets = nodes.filter(node => 
        !targetNodeIds.has(node.id)
      );
      
      // Error if more than one node has empty target handles
      if (nodesWithEmptyTargets.length > 1) {
        alert(
          `Error: Cannot save flow! More than one node has empty target handles. ` +
          `Please connect the nodes properly. Nodes without incoming connections: ` +
          `${nodesWithEmptyTargets.map(node => node.data.message || node.id).join(', ')}`
        );
        return;
      }
    }
    
    // Check for disconnected nodes (nodes without any connections)
    const connectedNodeIds = new Set();
    edges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });
    
    const disconnectedNodes = nodes.filter(node => 
      !connectedNodeIds.has(node.id) && nodes.length > 1
    );
    
    if (disconnectedNodes.length > 0 && nodes.length > 1) {
      const proceed = confirm(
        `Warning: ${disconnectedNodes.length} node(s) are not connected to the flow. Save anyway?`
      );
      if (!proceed) return;
    }
    
    try {
      const flow = reactFlowInstance.toObject();
      // In a real app, you would send this to your backend
      localStorage.setItem('chatbot-flow', JSON.stringify(flow));
      console.log('Saved flow:', flow);
      alert('Flow saved successfully!');
    } catch (error) {
      console.error('Error saving flow:', error);
      alert('Failed to save flow. Please try again.');
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      {/* Main Flow Area */}
      <div style={{ flex: 1, position: 'relative' }} ref={reactFlowWrapper}>
        {/* Top Bar with Action Buttons */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            display: 'flex',
            gap: '10px',
          }}
        >
          <button
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
            onClick={clearFlow}
            onMouseEnter={(e) => e.target.style.background = '#c82333'}
            onMouseLeave={(e) => e.target.style.background = '#dc3545'}
          >
            Clear Flow
          </button>
          <button
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
            onClick={saveFlow}
            onMouseEnter={(e) => e.target.style.background = '#218838'}
            onMouseLeave={(e) => e.target.style.background = '#28a745'}
          >
            Save Changes
          </button>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Right Panel */}
      <div
        style={{
          width: '300px',
          background: '#f5f5f5',
          borderLeft: '1px solid #ccc',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {selectedNode ? (
          /* Settings Panel - Replaces Nodes Panel when node is selected */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <button
                onClick={() => {
                  setSelectedNode(null);
                  setNodeMessage('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginRight: '8px',
                  padding: '4px',
                }}
              >
                ←
              </button>
              <h3 style={{ margin: '0', fontSize: '16px' }}>
                {selectedNode.type === 'messageNode' && 'Message Settings'}
                {selectedNode.type === 'aiResponseNode' && 'AI Response Settings'}
                {selectedNode.type === 'userInputNode' && 'User Input Settings'}
                {selectedNode.type === 'conditionNode' && 'Condition Settings'}
                {selectedNode.type === 'apiCallNode' && 'API Call Settings'}
                {selectedNode.type === 'delayNode' && 'Delay Settings'}
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Message Node Settings */}
              {selectedNode.type === 'messageNode' && (
                <>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>Text:</label>
                  <textarea
                    value={nodeMessage}
                    onChange={(e) => setNodeMessage(e.target.value)}
                    onBlur={updateNodeMessage}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        updateNodeMessage();
                        e.target.blur();
                      }
                    }}
                    style={{
                      width: '100%',
                      height: '80px',
                      padding: '8px',
                      border: validateNodeMessage(nodeMessage) ? '1px solid #28a745' : '1px solid #dc3545',
                      borderRadius: '4px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
                    placeholder="Enter message text..."
                  />
                  <small style={{ 
                    color: validateNodeMessage(nodeMessage) ? '#28a745' : '#dc3545',
                    fontSize: '12px' 
                  }}>
                    {validateNodeMessage(nodeMessage) 
                      ? '✓ Valid message' 
                      : '⚠ Message cannot be empty'
                    }
                  </small>
                  <small style={{ color: '#666', fontSize: '11px' }}>
                    Tip: Press Ctrl+Enter to save changes
                  </small>
                </>
              )}
              
              {/* AI Response Node Settings */}
              {selectedNode.type === 'aiResponseNode' && (
                <>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>AI Prompt:</label>
                  <textarea
                    value={selectedNode.data.prompt || ''}
                    onChange={(e) => {
                      const updatedNodes = nodes.map(node => 
                        node.id === selectedNode.id 
                          ? { ...node, data: { ...node.data, prompt: e.target.value } }
                          : node
                      );
                      setNodes(updatedNodes);
                      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, prompt: e.target.value } });
                    }}
                    placeholder="Enter AI prompt or instructions..."
                    style={{
                      width: '100%',
                      height: '80px',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
                  />
                </>
              )}
              
              {/* User Input Node Settings */}
              {selectedNode.type === 'userInputNode' && (
                <>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>Input Type:</label>
                  <select
                    value={selectedNode.data.inputType || 'Text Input'}
                    onChange={(e) => {
                      const updatedNodes = nodes.map(node => 
                        node.id === selectedNode.id 
                          ? { ...node, data: { ...node.data, inputType: e.target.value } }
                          : node
                      );
                      setNodes(updatedNodes);
                      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, inputType: e.target.value } });
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
                  >
                    <option value="Text Input">Text Input</option>
                    <option value="Number Input">Number Input</option>
                    <option value="Email Input">Email Input</option>
                    <option value="Phone Input">Phone Input</option>
                    <option value="Multiple Choice">Multiple Choice</option>
                  </select>
                </>
              )}
              
              {/* Condition Node Settings */}
              {selectedNode.type === 'conditionNode' && (
                <>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>Condition:</label>
                  <input
                    type="text"
                    value={selectedNode.data.condition || ''}
                    onChange={(e) => {
                      const updatedNodes = nodes.map(node => 
                        node.id === selectedNode.id 
                          ? { ...node, data: { ...node.data, condition: e.target.value } }
                          : node
                      );
                      setNodes(updatedNodes);
                      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, condition: e.target.value } });
                    }}
                    placeholder="Enter condition (e.g., user_age > 18)"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
                  />
                </>
              )}
              
              {/* API Call Node Settings */}
              {selectedNode.type === 'apiCallNode' && (
                <>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>API Endpoint:</label>
                  <input
                    type="text"
                    value={selectedNode.data.endpoint || ''}
                    onChange={(e) => {
                      const updatedNodes = nodes.map(node => 
                        node.id === selectedNode.id 
                          ? { ...node, data: { ...node.data, endpoint: e.target.value } }
                          : node
                      );
                      setNodes(updatedNodes);
                      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, endpoint: e.target.value } });
                    }}
                    placeholder="Enter API endpoint (e.g., /api/users)"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
                  />
                  <label style={{ fontSize: '14px', fontWeight: '500', marginTop: '10px' }}>Method:</label>
                  <select
                    value={selectedNode.data.method || 'GET'}
                    onChange={(e) => {
                      const updatedNodes = nodes.map(node => 
                        node.id === selectedNode.id 
                          ? { ...node, data: { ...node.data, method: e.target.value } }
                          : node
                      );
                      setNodes(updatedNodes);
                      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, method: e.target.value } });
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </>
              )}
              
              {/* Delay Node Settings */}
              {selectedNode.type === 'delayNode' && (
                <>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>Duration:</label>
                  <input
                    type="text"
                    value={selectedNode.data.duration || ''}
                    onChange={(e) => {
                      const updatedNodes = nodes.map(node => 
                        node.id === selectedNode.id 
                          ? { ...node, data: { ...node.data, duration: e.target.value } }
                          : node
                      );
                      setNodes(updatedNodes);
                      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, duration: e.target.value } });
                    }}
                    placeholder="Enter duration (e.g., 5 seconds, 2 minutes)"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
                  />
                </>
              )}
            </div>
          </div>
        ) : (
          /* Nodes Panel - Shows when no node is selected */
          <div>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Nodes Panel</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Text Message Node */}
              {/* Text Message Node */}
              <div
                style={{
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center',
                  cursor: 'grab',
                  background: 'white',
                  transition: 'all 0.2s ease',
                }}
                onDragStart={(event) => onDragStart(event, 'messageNode')}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#0078d4';
                  e.target.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#ccc';
                  e.target.style.backgroundColor = 'white';
                }}
                draggable
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      background: '#e3f2fd',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}
                  >
                    💬
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Text Message</span>
                </div>
              </div>

              {/* AI Response Node */}
              <div
                style={{
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center',
                  cursor: 'grab',
                  background: 'white',
                  transition: 'all 0.2s ease',
                }}
                onDragStart={(event) => onDragStart(event, 'aiResponseNode')}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#0078d4';
                  e.target.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#ccc';
                  e.target.style.backgroundColor = 'white';
                }}
                draggable
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      background: '#e8f5e8',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}
                  >
                    🤖
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>AI Response</span>
                </div>
              </div>

              {/* User Input Node */}
              <div
                style={{
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center',
                  cursor: 'grab',
                  background: 'white',
                  transition: 'all 0.2s ease',
                }}
                onDragStart={(event) => onDragStart(event, 'userInputNode')}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#0078d4';
                  e.target.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#ccc';
                  e.target.style.backgroundColor = 'white';
                }}
                draggable
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      background: '#fff3e0',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}
                  >
                    ❓
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>User Input</span>
                </div>
              </div>

              {/* Condition Node */}
              <div
                style={{
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center',
                  cursor: 'grab',
                  background: 'white',
                  transition: 'all 0.2s ease',
                }}
                onDragStart={(event) => onDragStart(event, 'conditionNode')}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#0078d4';
                  e.target.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#ccc';
                  e.target.style.backgroundColor = 'white';
                }}
                draggable
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      background: '#f3e5f5',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}
                  >
                    🔀
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Condition</span>
                </div>
              </div>

              {/* API Call Node */}
              <div
                style={{
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center',
                  cursor: 'grab',
                  background: 'white',
                  transition: 'all 0.2s ease',
                }}
                onDragStart={(event) => onDragStart(event, 'apiCallNode')}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#0078d4';
                  e.target.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#ccc';
                  e.target.style.backgroundColor = 'white';
                }}
                draggable
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      background: '#e3f2fd',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}
                  >
                    🌐
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>API Call</span>
                </div>
              </div>

              {/* Delay Node */}
              <div
                style={{
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center',
                  cursor: 'grab',
                  background: 'white',
                  transition: 'all 0.2s ease',
                }}
                onDragStart={(event) => onDragStart(event, 'delayNode')}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#0078d4';
                  e.target.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#ccc';
                  e.target.style.backgroundColor = 'white';
                }}
                draggable
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      background: '#fce4ec',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}
                  >
                    ⏰
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Delay</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '8px 16px',
          borderRadius: '20px',
          border: '1px solid #e0e0e0',
          fontSize: '12px',
          color: '#666',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backdropFilter: 'blur(5px)',
        }}
      >
        Built with ❤️ by{' '}
        <a
          href="https://github.com/rollno21-crypto"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#0078d4',
            textDecoration: 'none',
            fontWeight: '500',
          }}
          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
        >
          rollno21-crypto
        </a>
      </div>
    </div>
  );
}

