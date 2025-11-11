"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X, Link as LinkIcon, Zap } from "lucide-react";

interface Node {
  id: string;
  name: string;
  category: string;
  confidence: number;
  type: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  size?: number;
}

interface Link {
  source: string | Node;
  target: string | Node;
  type: string;
  strength?: number;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

interface KnowledgeGraphVisualizationProps {
  data: GraphData;
  width?: number;
  height?: number;
}

// Category information with descriptions
const CATEGORY_INFO: Record<string, { color: string; description: string; icon: string }> = {
  focus: {
    color: "#8B5CF6",
    description: "Your main research focus area",
    icon: "🎯"
  },
  primary_interest: {
    color: "#3B82F6",
    description: "Core topics you're actively researching",
    icon: "🔬"
  },
  secondary_interest: {
    color: "#06B6D4",
    description: "Related areas of interest",
    icon: "💡"
  },
  technique: {
    color: "#10B981",
    description: "Laboratory techniques you use",
    icon: "🧪"
  },
  computational_skill: {
    color: "#F59E0B",
    description: "Programming and analysis skills",
    icon: "💻"
  },
  query_concept: {
    color: "#EC4899",
    description: "Keywords from your research queries",
    icon: "🔍"
  },
  data_source: {
    color: "#6B7280",
    description: "Databases and data sources",
    icon: "📊"
  },
  example: {
    color: "#A855F7",
    description: "Example research concept",
    icon: "📚"
  },
};

// Relationship type descriptions
const RELATIONSHIP_INFO: Record<string, { description: string; icon: string }> = {
  FOCUSES_ON: { description: "Primary research focus on", icon: "→" },
  RELATED_TO: { description: "Related to", icon: "↔" },
  USES: { description: "Uses technique", icon: "⚡" },
  SUPPORTS: { description: "Supports", icon: "🔧" },
  EXPLORES: { description: "Explores topic", icon: "🔭" },
  CO_OCCURS: { description: "Appears together with", icon: "🔗" },
  PROVIDES_DATA: { description: "Provides data for", icon: "📥" },
  INCLUDES: { description: "Includes", icon: "⊃" },
  TESTED_IN: { description: "Tested in", icon: "🧬" },
  MEASURES: { description: "Measures", icon: "📏" },
  PRODUCES: { description: "Produces", icon: "➜" },
};

export default function KnowledgeGraphVisualization({
  data,
  width = 1200,
  height = 800,
}: KnowledgeGraphVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);

    // Create zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const g = svg.append("g");

    // Define arrow markers for directed links
    svg
      .append("defs")
      .selectAll("marker")
      .data(["RELATED_TO", "MENTIONS", "CITES"])
      .enter()
      .append("marker")
      .attr("id", (d) => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    // Create force simulation
    const simulation = d3
      .forceSimulation<Node>(data.nodes)
      .force(
        "link",
        d3
          .forceLink<Node, Link>(data.links)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Create links
    const link = g
      .append("g")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke", (d) => {
        const strength = d.strength || 0.5;
        return d3.interpolateRgb("#E5E7EB", "#8B5CF6")(strength);
      })
      .attr("stroke-opacity", 0.7)
      .attr("stroke-width", (d) => 1 + (d.strength || 0.5) * 3)
      .attr("marker-end", (d) => `url(#arrow-${d.type})`)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedLink(d);
        setSelectedNode(null);
      })
      .on("mouseover", function() {
        d3.select(this).attr("stroke-opacity", 1).attr("stroke-width", 4);
      })
      .on("mouseout", function(event, d) {
        d3.select(this).attr("stroke-opacity", 0.7).attr("stroke-width", 1 + (d.strength || 0.5) * 3);
      });

    // Create node groups
    const node = g
      .append("g")
      .selectAll("g")
      .data(data.nodes)
      .enter()
      .append("g")
      .call(
        d3
          .drag<SVGGElement, Node>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      )
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
        setSelectedLink(null);
      });

    // Color scale based on category
    const getNodeColor = (category: string) => {
      return CATEGORY_INFO[category]?.color || "#6B7280";
    };

    // Add circles to nodes
    node
      .append("circle")
      .attr("r", (d) => {
        const baseSize = d.size || 1;
        return 8 + baseSize * 5 + d.confidence * 5;
      })
      .attr("fill", (d) => getNodeColor(d.category))
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .style("cursor", "pointer")
      .style("transition", "all 0.3s ease")
      .on("mouseover", function(event, d) {
        const node = d as Node;
        const baseSize = node.size || 1;
        d3.select(this)
          .attr("stroke-width", 5)
          .attr("r", 10 + baseSize * 5 + node.confidence * 5);
      })
      .on("mouseout", function(event, d) {
        const node = d as Node;
        const baseSize = node.size || 1;
        d3.select(this)
          .attr("stroke-width", 3)
          .attr("r", 8 + baseSize * 5 + node.confidence * 5);
      });

    // Add labels to nodes
    node
      .append("text")
      .text((d) => d.name)
      .attr("x", 15)
      .attr("y", 5)
      .style("font-size", "12px")
      .style("font-weight", "500")
      .style("fill", "#374151")
      .style("pointer-events", "none");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as Node).x || 0)
        .attr("y1", (d) => (d.source as Node).y || 0)
        .attr("x2", (d) => (d.target as Node).x || 0)
        .attr("y2", (d) => (d.target as Node).y || 0);

      node.attr("transform", (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Drag functions
    function dragstarted(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Click outside to deselect
    svg.on("click", () => {
      setSelectedNode(null);
      setSelectedLink(null);
    });

    return () => {
      simulation.stop();
    };
  }, [data, width, height]);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border-2 border-purple-200 rounded-2xl bg-gradient-to-br from-white to-purple-50"
      />

      {/* Help Button */}
      <button
        onClick={() => setShowHelp(!showHelp)}
        className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white shadow-lg border-2 border-purple-200 flex items-center justify-center hover:bg-purple-50 transition-all hover-lift"
      >
        <Info className="w-5 h-5 text-purple-600" />
      </button>

      {/* Help Panel */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-16 right-4 w-80 bg-white rounded-2xl shadow-2xl border-2 border-purple-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold gradient-text">How to Use</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">1.</span>
                <p><strong>Click nodes</strong> to see detailed information about concepts</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <p><strong>Click connections</strong> to understand relationships between concepts</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">3.</span>
                <p><strong>Drag nodes</strong> to reposition and explore the network</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">4.</span>
                <p><strong>Scroll to zoom</strong> in and out of the graph</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                💡 <strong>Tip:</strong> Larger nodes indicate higher confidence or importance
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white rounded-2xl shadow-xl border-2 border-purple-200 p-4 max-w-xs">
        <h3 className="font-bold text-sm mb-3 gradient-text">Concept Types</h3>
        <div className="space-y-2">
          {Object.entries(CATEGORY_INFO).map(([key, info]) => (
            <div key={key} className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors">
              <div
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: info.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-gray-900 capitalize">
                  {info.icon} {key.replace(/_/g, " ")}
                </div>
                <div className="text-[10px] text-gray-600 leading-tight">{info.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Node Details Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-4 right-4 w-96 bg-white rounded-2xl shadow-2xl border-2 border-purple-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl shadow-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: CATEGORY_INFO[selectedNode.category]?.color || "#6B7280" }}
                >
                  <span className="filter brightness-200">{CATEGORY_INFO[selectedNode.category]?.icon || "📚"}</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{selectedNode.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {selectedNode.category.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center flex-shrink-0"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-gradient-card rounded-xl border border-purple-100">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {CATEGORY_INFO[selectedNode.category]?.description || "Research concept in your knowledge graph"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-xs text-blue-600 font-semibold mb-1">Confidence</div>
                  <div className="flex items-center gap-2">
                    <div className="progress-bar h-2 flex-1">
                      <div
                        className="progress-fill"
                        style={{ width: `${selectedNode.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-blue-700">
                      {(selectedNode.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-xs text-purple-600 font-semibold mb-1">Type</div>
                  <div className="text-sm font-bold text-purple-700 capitalize">
                    {selectedNode.type}
                  </div>
                </div>
              </div>

              {selectedNode.size && selectedNode.size > 1 && (
                <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700 font-medium">
                      High importance concept
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Link Details Panel */}
      <AnimatePresence>
        {selectedLink && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-4 right-4 w-96 bg-white rounded-2xl shadow-2xl border-2 border-blue-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-secondary shadow-lg flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Connection</h3>
                  <p className="text-sm text-gray-600">Relationship Details</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLink(null)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center flex-shrink-0"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Source and Target */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CATEGORY_INFO[(selectedLink.source as Node).category]?.color || "#6B7280" }}
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    {(selectedLink.source as Node).name}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <span className="text-2xl text-blue-500">
                    {RELATIONSHIP_INFO[selectedLink.type]?.icon || "→"}
                  </span>
                  <span className="text-sm font-medium text-blue-700">
                    {RELATIONSHIP_INFO[selectedLink.type]?.description || selectedLink.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CATEGORY_INFO[(selectedLink.target as Node).category]?.color || "#6B7280" }}
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    {(selectedLink.target as Node).name}
                  </span>
                </div>
              </div>

              {selectedLink.strength && (
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-xs text-blue-600 font-semibold mb-2">Connection Strength</div>
                  <div className="progress-bar h-2">
                    <div
                      className="progress-fill"
                      style={{ width: `${selectedLink.strength * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="p-3 bg-gradient-card rounded-xl border border-purple-100">
                <p className="text-xs text-gray-600 leading-relaxed">
                  This connection shows how <strong>{(selectedLink.source as Node).name}</strong> relates to{" "}
                  <strong>{(selectedLink.target as Node).name}</strong> in your research network.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
