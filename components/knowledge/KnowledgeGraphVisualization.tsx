"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

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
}

interface Link {
  source: string | Node;
  target: string | Node;
  type: string;
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

export default function KnowledgeGraphVisualization({
  data,
  width = 1200,
  height = 800,
}: KnowledgeGraphVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

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
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .attr("marker-end", (d) => `url(#arrow-${d.type})`);

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
      });

    // Color scale based on category
    const colorScale = d3.scaleOrdinal<string>()
      .domain(["gene", "protein", "disease", "drug", "pathway", "other"])
      .range(["#3b82f6", "#8b5cf6", "#ef4444", "#10b981", "#f59e0b", "#6b7280"]);

    // Add circles to nodes
    node
      .append("circle")
      .attr("r", (d) => 10 + d.confidence * 10)
      .attr("fill", (d) => colorScale(d.category || "other"))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer");

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
    svg.on("click", () => setSelectedNode(null));

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
        className="border border-gray-200 rounded-lg bg-white"
      />

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <h3 className="font-semibold text-sm mb-2">Categories</h3>
        <div className="space-y-2">
          {[
            { name: "Gene", color: "#3b82f6" },
            { name: "Protein", color: "#8b5cf6" },
            { name: "Disease", color: "#ef4444" },
            { name: "Drug", color: "#10b981" },
            { name: "Pathway", color: "#f59e0b" },
            { name: "Other", color: "#6b7280" },
          ].map((category) => (
            <div key={category.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-xs text-gray-600">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Node details panel */}
      {selectedNode && (
        <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
          <h3 className="font-semibold text-lg mb-2">{selectedNode.name}</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray-500">Category:</span>{" "}
              <span className="font-medium">{selectedNode.category}</span>
            </p>
            <p>
              <span className="text-gray-500">Confidence:</span>{" "}
              <span className="font-medium">
                {(selectedNode.confidence * 100).toFixed(0)}%
              </span>
            </p>
            <p>
              <span className="text-gray-500">Type:</span>{" "}
              <span className="font-medium">{selectedNode.type}</span>
            </p>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="mt-3 text-xs text-blue-600 hover:text-blue-800"
          >
            Close
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-lg border border-gray-200">
        <p className="text-xs text-gray-500">
          💡 Drag nodes to reposition • Click nodes for details • Scroll to
          zoom
        </p>
      </div>
    </div>
  );
}
