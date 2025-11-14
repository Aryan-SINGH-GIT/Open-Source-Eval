import { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./Charts.css";

const D3Widget = ({ cityData }) => {
  const bubbleRef = useRef();
  const gaugeRef = useRef();
  const streamRef = useRef();

  useEffect(() => {
    if (
      !cityData ||
      !bubbleRef.current ||
      !gaugeRef.current ||
      !streamRef.current
    )
      return;

    // Bubble Chart - City Metrics
    const bubbleData = [
      {
        name: "Weather",
        value: cityData.weather?.temp || 20,
        color: "#ef4444",
      },
      {
        name: "Air Quality",
        value: cityData.airQuality?.aqi || 50,
        color: "#10b981",
      },
      {
        name: "Traffic",
        value: cityData.traffic?.congestionLevel || 30,
        color: "#f59e0b",
      },
      {
        name: "Energy",
        value: (cityData.energy?.usage || 1000) / 20,
        color: "#3b82f6",
      },
      {
        name: "Waste",
        value: cityData.waste?.recycled || 30,
        color: "#8b5cf6",
      },
    ];

    const bubbleSvg = d3.select(bubbleRef.current);
    bubbleSvg.selectAll("*").remove();

    const width = 400;
    const height = 300;
    bubbleSvg.attr("width", width).attr("height", height);

    const simulation = d3
      .forceSimulation(bubbleData)
      .force("charge", d3.forceManyBody().strength(5))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d) => d.value + 5)
      );

    const bubbles = bubbleSvg
      .selectAll("circle")
      .data(bubbleData)
      .enter()
      .append("circle")
      .attr("r", (d) => d.value)
      .attr("fill", (d) => d.color)
      .attr("opacity", 0.7)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    const labels = bubbleSvg
      .selectAll("text")
      .data(bubbleData)
      .enter()
      .append("text")
      .text((d) => d.name)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");

    simulation.on("tick", () => {
      bubbles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });

    // Gauge Chart - AQI
    const gaugeSvg = d3.select(gaugeRef.current);
    gaugeSvg.selectAll("*").remove();

    const gaugeWidth = 300;
    const gaugeHeight = 200;
    const radius = Math.min(gaugeWidth, gaugeHeight) / 2 - 20;

    gaugeSvg.attr("width", gaugeWidth).attr("height", gaugeHeight);
    const g = gaugeSvg
      .append("g")
      .attr("transform", `translate(${gaugeWidth / 2},${gaugeHeight - 20})`);

    const arc = d3
      .arc()
      .innerRadius(radius - 30)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2);

    // Background arc
    g.append("path")
      .datum({ endAngle: Math.PI / 2 })
      .style("fill", "#333")
      .attr("d", arc);

    const aqi = cityData.airQuality?.aqi || 50;
    const aqiAngle = -Math.PI / 2 + (aqi / 500) * Math.PI;
    const aqiColor = aqi <= 50 ? "#10b981" : aqi <= 100 ? "#f59e0b" : "#ef4444";

    // Foreground arc (AQI level)
    g.append("path")
      .datum({ endAngle: aqiAngle })
      .style("fill", aqiColor)
      .attr("d", arc)
      .transition()
      .duration(1000)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate(-Math.PI / 2, d.endAngle);
        return function (t) {
          d.endAngle = interpolate(t);
          return arc(d);
        };
      });

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -radius / 2)
      .attr("font-size", "32px")
      .attr("fill", "#fff")
      .attr("font-weight", "bold")
      .text(aqi);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -radius / 2 + 30)
      .attr("font-size", "14px")
      .attr("fill", "#aaa")
      .text("AQI Level");

    // Stream Graph - Traffic over time
    const streamSvg = d3.select(streamRef.current);
    streamSvg.selectAll("*").remove();

    const streamWidth = 400;
    const streamHeight = 250;
    streamSvg.attr("width", streamWidth).attr("height", streamHeight);

    const hours = d3.range(24);
    const streamData = hours.map((h) => ({
      hour: h,
      cars: 50 + Math.sin(h / 3) * 30 + Math.random() * 20,
      trucks: 20 + Math.cos(h / 4) * 15 + Math.random() * 10,
      bikes: 30 + Math.sin(h / 2) * 20 + Math.random() * 15,
    }));

    const stack = d3
      .stack()
      .keys(["cars", "trucks", "bikes"])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetWiggle);

    const series = stack(streamData);

    const x = d3
      .scaleLinear()
      .domain([0, 23])
      .range([40, streamWidth - 20]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(series, (s) => d3.min(s, (d) => d[0])),
        d3.max(series, (s) => d3.max(s, (d) => d[1])),
      ])
      .range([streamHeight - 30, 30]);

    const area = d3
      .area()
      .x((d) => x(d.data.hour))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]))
      .curve(d3.curveBasis);

    const colors = ["#3b82f6", "#10b981", "#f59e0b"];

    streamSvg
      .selectAll("path")
      .data(series)
      .enter()
      .append("path")
      .attr("fill", (d, i) => colors[i])
      .attr("opacity", 0.7)
      .attr("d", area);

    const xAxis = streamSvg
      .append("g")
      .attr("transform", `translate(0,${streamHeight - 30})`)
      .call(d3.axisBottom(x).ticks(6));

    xAxis.selectAll("text").attr("fill", "#fff");
    xAxis.selectAll("line").attr("stroke", "#fff");
    xAxis.select(".domain").attr("stroke", "#fff");

    // Add legend
    const legend = streamSvg
      .append("g")
      .attr("transform", `translate(${streamWidth - 100}, 20)`);

    const legendItems = [
      { label: "Cars", color: colors[0] },
      { label: "Trucks", color: colors[1] },
      { label: "Bikes", color: colors[2] },
    ];

    legendItems.forEach((item, i) => {
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", item.color)
        .attr("opacity", 0.7);

      legendRow
        .append("text")
        .attr("x", 20)
        .attr("y", 12)
        .attr("fill", "#fff")
        .attr("font-size", "12px")
        .text(item.label);
    });
  }, [cityData]);

  if (!cityData) {
    return (
      <div className="d3-widget">
        <h2 className="chart-title">🎨 D3.js Visualizations</h2>
        <p style={{ color: "#fff", textAlign: "center", padding: "2rem" }}>
          Loading data...
        </p>
      </div>
    );
  }

  return (
    <div className="d3-widget">
      <h2 className="chart-title">🎨 Data Visualization</h2>
      <div className="charts-grid">
        <div className="chart-container">
          <h3>City Metrics Bubble Chart</h3>
          <div
            className="chart-wrapper"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg ref={bubbleRef}></svg>
          </div>
        </div>
        <div className="chart-container">
          <h3>Air Quality Gauge</h3>
          <div
            className="chart-wrapper"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg ref={gaugeRef}></svg>
          </div>
        </div>
        <div className="chart-container">
          <h3>Traffic Stream Graph (24 Hours)</h3>
          <div
            className="chart-wrapper"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg ref={streamRef}></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default D3Widget;
