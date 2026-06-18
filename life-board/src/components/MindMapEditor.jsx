import { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowLeft, Plus, Trash2, Pencil, Check, Brain, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

const CANVAS_W = 4000
const CANVAS_H = 3000
const NODE_W = 164
const NODE_H = 44

const COLORS = [
  { bg: 'from-violet-500 to-purple-600', line: '#8b5cf6', glow: 'rgba(139,92,246,0.4)' },
  { bg: 'from-blue-500 to-indigo-600',   line: '#3b82f6', glow: 'rgba(59,130,246,0.4)'  },
  { bg: 'from-teal-400 to-emerald-500',  line: '#14b8a6', glow: 'rgba(20,184,166,0.4)'  },
  { bg: 'from-pink-500 to-rose-500',     line: '#ec4899', glow: 'rgba(236,72,153,0.4)'  },
  { bg: 'from-orange-400 to-amber-500',  line: '#f97316', glow: 'rgba(249,115,22,0.4)'  },
  { bg: 'from-green-400 to-teal-500',    line: '#22c55e', glow: 'rgba(34,197,94,0.4)'   },
]

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function getColor(colorIdx) {
  return COLORS[colorIdx % COLORS.length]
}

function bezier(from, to) {
  const x1 = from.x + NODE_W / 2
  const y1 = from.y + NODE_H / 2
  const x2 = to.x + NODE_W / 2
  const y2 = to.y + NODE_H / 2
  const mx = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`
}

function autoPosition(parent, siblings) {
  if (!parent.parentId) {
    // Root: radial placement
    const angles = [0, 55, -55, 110, -110, 170, -170].map(d => d * Math.PI / 180)
    const dist = 270
    const angle = angles[siblings.length % angles.length]
    return {
      x: parent.x + NODE_W / 2 + Math.cos(angle) * dist - NODE_W / 2,
      y: parent.y + NODE_H / 2 + Math.sin(angle) * dist - NODE_H / 2,
    }
  }
  // Non-root: column to the right
  const spread = 80
  return {
    x: parent.x + 220,
    y: parent.y + siblings.length * spread,
  }
}

function assignColorIdx(parentNode, siblings, allNodes) {
  if (!parentNode.parentId) {
    // Direct children of root each get a unique branch color
    return (siblings.length + 1) % COLORS.length
  }
  // Inherit parent color
  return parentNode.colorIdx ?? 0
}

export default function MindMapEditor({ mapId, onClose }) {
  const { mindMaps, updateMindMap } = useApp()
  const mindMap = mindMaps.find(m => m.id === mapId)

  const [nodes, setNodes] = useState(mindMap?.nodes ?? [])
  const [mapName, setMapName] = useState(mindMap?.name ?? '')
  const [editingName, setEditingName] = useState(false)

  const [selected, setSelected] = useState(null)
  const [dragging, setDragging] = useState(null)
  const [editing, setEditing] = useState(null)
  const [editText, setEditText] = useState('')

  const containerRef = useRef(null)
  const saveTimer = useRef(null)

  // Scroll to center on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo(
        CANVAS_W / 2 - containerRef.current.clientWidth / 2,
        CANVAS_H / 2 - containerRef.current.clientHeight / 2
      )
    }
  }, [])

  // Debounced save
  useEffect(() => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      updateMindMap(mapId, nodes, mapName)
    }, 300)
    return () => clearTimeout(saveTimer.current)
  }, [nodes, mapName])

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return
    const dx = e.clientX - dragging.startMouseX
    const dy = e.clientY - dragging.startMouseY
    setNodes(ns => ns.map(n =>
      n.id === dragging.nodeId
        ? { ...n, x: dragging.startNodeX + dx, y: dragging.startNodeY + dy }
        : n
    ))
  }, [dragging])

  const handleMouseUp = useCallback(() => setDragging(null), [])

  const startDrag = (e, node) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging({
      nodeId: node.id,
      startNodeX: node.x,
      startNodeY: node.y,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
    })
  }

  const addChild = (parentId) => {
    const parent = nodes.find(n => n.id === parentId)
    if (!parent) return
    const siblings = nodes.filter(n => n.parentId === parentId)
    const pos = autoPosition(parent, siblings)
    const colorIdx = assignColorIdx(parent, siblings, nodes)
    const newNode = { id: uid(), text: 'New idea', parentId, x: pos.x, y: pos.y, colorIdx }
    setNodes(ns => [...ns, newNode])
    setSelected(newNode.id)
    setTimeout(() => { setEditing(newNode.id); setEditText('New idea') }, 50)
  }

  const deleteNode = (nodeId) => {
    const toDelete = new Set()
    const collect = (id) => {
      toDelete.add(id)
      nodes.filter(n => n.parentId === id).forEach(n => collect(n.id))
    }
    collect(nodeId)
    setNodes(ns => ns.filter(n => !toDelete.has(n.id)))
    setSelected(null)
    setEditing(null)
  }

  const saveEdit = () => {
    if (editText.trim()) {
      setNodes(ns => ns.map(n => n.id === editing ? { ...n, text: editText.trim() } : n))
    }
    setEditing(null)
  }

  const root = nodes.find(n => !n.parentId)

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#080810]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 h-14 bg-black/60 backdrop-blur-2xl border-b border-white/10 flex-shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mr-2"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="w-px h-5 bg-white/10" />

        <div className="flex items-center gap-2 flex-1">
          <Brain size={15} className="text-violet-400 flex-shrink-0" />
          {editingName ? (
            <input
              autoFocus
              value={mapName}
              onChange={e => setMapName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') setEditingName(false) }}
              onBlur={() => setEditingName(false)}
              className="bg-transparent outline-none text-sm font-bold text-white border-b border-violet-400 w-48"
            />
          ) : (
            <button onClick={() => setEditingName(true)} className="text-sm font-bold text-white hover:text-violet-300 transition-colors">
              {mapName}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-600 hidden sm:block">{nodes.length} nodes</p>
          <button
            onClick={() => root && addChild(root.id)}
            className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold px-3 py-1.5 rounded-xl hover:opacity-90 transition"
          >
            <Plus size={13} /> Add Branch
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto"
        onClick={() => { setSelected(null); setEditing(null) }}
      >
        <div
          className="relative select-none"
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            backgroundColor: '#080810',
          }}
        >
          {/* SVG connections */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={CANVAS_W}
            height={CANVAS_H}
          >
            <defs>
              {COLORS.map((c, i) => (
                <filter key={i} id={`glow-${i}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
            </defs>
            {nodes.filter(n => n.parentId).map(node => {
              const parent = nodes.find(n => n.id === node.parentId)
              if (!parent) return null
              const col = getColor(node.colorIdx ?? 0)
              const isSelectedBranch = selected === node.id || selected === node.parentId
              return (
                <path
                  key={node.id}
                  d={bezier(parent, node)}
                  fill="none"
                  stroke={col.line}
                  strokeWidth={isSelectedBranch ? 2.5 : 1.5}
                  strokeOpacity={isSelectedBranch ? 0.9 : 0.4}
                  filter={isSelectedBranch ? `url(#glow-${node.colorIdx % COLORS.length})` : undefined}
                />
              )
            })}
          </svg>

          {/* Nodes */}
          {nodes.map(node => {
            const isRoot = !node.parentId
            const isSelected = selected === node.id
            const isEditing = editing === node.id
            const col = getColor(node.colorIdx ?? 0)
            const width = isRoot ? 200 : NODE_W
            const height = isRoot ? 56 : NODE_H

            return (
              <div
                key={node.id}
                style={{
                  left: node.x,
                  top: node.y,
                  position: 'absolute',
                  width,
                  minHeight: height,
                  zIndex: isSelected ? 20 : 10,
                }}
                onClick={e => e.stopPropagation()}
                onMouseDown={e => {
                  e.stopPropagation()
                  setSelected(node.id)
                  if (!isEditing) startDrag(e, node)
                }}
                onDoubleClick={e => {
                  e.stopPropagation()
                  setEditing(node.id)
                  setEditText(node.text)
                }}
              >
                {/* Node body */}
                <div
                  className={`
                    w-full h-full bg-gradient-to-br ${col.bg} text-white
                    flex items-center justify-center px-4
                    cursor-grab active:cursor-grabbing
                    transition-all duration-150
                    ${isRoot ? 'rounded-3xl shadow-2xl' : 'rounded-2xl shadow-lg'}
                    ${isSelected
                      ? 'ring-2 ring-white/60 shadow-2xl scale-105'
                      : 'hover:brightness-110'
                    }
                  `}
                  style={{
                    minHeight: height,
                    boxShadow: isSelected
                      ? `0 0 24px ${col.glow}, 0 8px 32px rgba(0,0,0,0.4)`
                      : `0 4px 16px rgba(0,0,0,0.3)`,
                  }}
                >
                  {isEditing ? (
                    <input
                      autoFocus
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveEdit()
                        if (e.key === 'Escape') setEditing(null)
                      }}
                      onBlur={saveEdit}
                      onClick={e => e.stopPropagation()}
                      className="bg-transparent outline-none text-center font-bold text-white placeholder:text-white/50 w-full"
                      style={{ fontSize: isRoot ? '16px' : '13px' }}
                    />
                  ) : (
                    <p
                      className="font-bold text-center break-words leading-tight"
                      style={{ fontSize: isRoot ? '16px' : '13px' }}
                    >
                      {node.text}
                    </p>
                  )}
                </div>

                {/* Action toolbar — shown when selected and not editing */}
                {isSelected && !isEditing && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl px-2 py-1.5 shadow-xl"
                    style={{ top: height + 10, zIndex: 30 }}
                    onClick={e => e.stopPropagation()}
                    onMouseDown={e => e.stopPropagation()}
                  >
                    <button
                      onClick={() => addChild(node.id)}
                      className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 font-semibold px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <Plus size={12} /> Add child
                    </button>
                    <div className="w-px h-4 bg-white/10" />
                    <button
                      onClick={() => { setEditing(node.id); setEditText(node.text) }}
                      className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <Pencil size={11} className="text-gray-400 hover:text-white" />
                    </button>
                    {!isRoot && (
                      <>
                        <div className="w-px h-4 bg-white/10" />
                        <button
                          onClick={() => deleteNode(node.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 size={11} className="text-red-400" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom hint bar */}
      <div className="h-9 bg-black/40 backdrop-blur-xl border-t border-white/10 flex items-center justify-center gap-6 flex-shrink-0">
        <span className="text-xs text-gray-600">Click to select</span>
        <span className="text-xs text-gray-700">·</span>
        <span className="text-xs text-gray-600">Double-click to edit</span>
        <span className="text-xs text-gray-700">·</span>
        <span className="text-xs text-gray-600">Drag to move</span>
        <span className="text-xs text-gray-700">·</span>
        <span className="text-xs text-gray-600">Click node → Add child</span>
      </div>
    </div>
  )
}
