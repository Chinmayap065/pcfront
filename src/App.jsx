import { useMemo, useState } from "react";
import {
  Activity,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Clock3,
  Cpu,
  GitBranch,
  Layers3,
  Network,
  Play,
  RotateCcw,
  Server,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import "./App.css";


const topologyInfo = {
  ring: {
    name: "Ring",
    description: "Circular node arrangement",
  },

  mesh: {
    name: "Mesh",
    description: "2D grid interconnection",
  },

  torus: {
    name: "Torus",
    description: "Mesh with wrap-around links",
  },
};


const initialResults = {
  ring: {
    path: 3.24,
    cost: 42.4,
    burst: 32.8,
    predicted: 33.6,
  },

  mesh: {
    path: 2.10,
    cost: 31.2,
    burst: 25.1,
    predicted: 25.8,
  },

  torus: {
    path: 1.78,
    cost: 27.8,
    burst: 21.4,
    predicted: 21.9,
  },
};


function NetworkDiagram({ type }) {
  if (type === "ring") {
    return (
      <div className="network-visual ring-visual">
        <div className="ring-node ring-a">0</div>
        <div className="ring-node ring-b">1</div>
        <div className="ring-node ring-c">2</div>
        <div className="ring-node ring-d">3</div>

        <span className="ring-edge edge-a" />
        <span className="ring-edge edge-b" />
        <span className="ring-edge edge-c" />
        <span className="ring-edge edge-d" />
      </div>
    );
  }


  if (type === "mesh") {
    return (
      <div className="network-visual grid-visual">
        <div className="grid-lines horizontal h1" />
        <div className="grid-lines horizontal h2" />
        <div className="grid-lines horizontal h3" />

        <div className="grid-lines vertical v1" />
        <div className="grid-lines vertical v2" />
        <div className="grid-lines vertical v3" />

        {Array.from({ length: 9 }).map((_, index) => (
          <div className="grid-node" key={index}>
            {index}
          </div>
        ))}
      </div>
    );
  }


  return (
    <div className="network-visual torus-visual">

      <div className="torus-lines">
        <div className="grid-lines horizontal h1" />
        <div className="grid-lines horizontal h2" />
        <div className="grid-lines horizontal h3" />

        <div className="grid-lines vertical v1" />
        <div className="grid-lines vertical v2" />
        <div className="grid-lines vertical v3" />

        {Array.from({ length: 9 }).map((_, index) => (
          <div className="grid-node" key={index}>
            {index}
          </div>
        ))}
      </div>

      <div className="torus-arrow torus-top">↔</div>
      <div className="torus-arrow torus-right">↕</div>

    </div>
  );
}


function Metric({ label, value, unit }) {
  return (
    <div className="metric">

      <span>{label}</span>

      <div>
        <strong>{value}</strong>
        <small>{unit}</small>
      </div>

    </div>
  );
}


function App() {

  const [nodes, setNodes] = useState("16");
  const [pattern, setPattern] = useState("Random");
  const [requests, setRequests] = useState("50");
  const [workers, setWorkers] = useState("4");

  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const [results, setResults] = useState(initialResults);


  const actualBest = useMemo(() => {

    return Object.entries(results).reduce(
      (best, [key, value]) =>
        value.burst < results[best].burst ? key : best,
      "ring"
    );

  }, [results]);


  const aiBest = useMemo(() => {

    return Object.entries(results).reduce(
      (best, [key, value]) =>
        value.predicted < results[best].predicted ? key : best,
      "ring"
    );

  }, [results]);


  const speedupData = [
    {
      workers: "1",
      time: 8.4,
    },
    {
      workers: "2",
      time: 5.2,
    },
    {
      workers: "4",
      time: 3.2,
    },
    {
      workers: "8",
      time: 2.7,
    },
  ];


  const topologyChartData = [
    {
      topology: "Ring",
      actual: results.ring.burst,
      predicted: results.ring.predicted,
    },
    {
      topology: "Mesh",
      actual: results.mesh.burst,
      predicted: results.mesh.predicted,
    },
    {
      topology: "Torus",
      actual: results.torus.burst,
      predicted: results.torus.predicted,
    },
  ];


  const runAnalysis = () => {

    setRunning(true);
    setHasRun(false);

    setTimeout(() => {

      setRunning(false);
      setHasRun(true);

      setResults({
        ring: {
          path: 3.24,
          cost: 42.4,
          burst: 32.8,
          predicted: 33.6,
        },

        mesh: {
          path: 2.10,
          cost: 31.2,
          burst: 25.1,
          predicted: 25.8,
        },

        torus: {
          path: 1.78,
          cost: 27.8,
          burst: 21.4,
          predicted: 21.9,
        },
      });

    }, 1400);
  };


  const resetAnalysis = () => {

    setHasRun(false);
    setRunning(false);

    setNodes("16");
    setPattern("Random");
    setRequests("50");
    setWorkers("4");

    setResults(initialResults);
  };


  const isCorrect = aiBest === actualBest;


  return (
    <div className="app-shell">

      <div className="background-grid" />
      <div className="background-glow glow-purple" />
      <div className="background-glow glow-blue" />


      {/* HEADER */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-mark">
            <BrainCircuit size={24} />
          </div>

          <div>
            <h1>AI Network Selector</h1>
            <p>Interconnection Network Intelligence</p>
          </div>

        </div>


        <div className="topbar-right">

          <div className="system-status">
            <span className="status-light" />
            System Online
          </div>

          <div className="header-divider" />

          <div className="project-name">
            Case Study 09
          </div>

        </div>

      </header>


      <main className="page">


        {/* HERO */}

        <section className="hero-section">

          <div className="hero-copy">

            <div className="hero-kicker">
              <Sparkles size={14} />
              DISTRIBUTED & PARALLEL COMPUTING
            </div>

            <h2>
              Intelligent topology
              <span> selection.</span>
            </h2>

            <p>
              Simulate interconnection networks, measure communication
              performance, and use machine learning to identify the
              most suitable topology for your parallel workload.
            </p>

          </div>


          <div className="hero-mini-stats">

            <div>
              <Network size={17} />
              <strong>3</strong>
              <span>Topologies</span>
            </div>

            <div>
              <Server size={17} />
              <strong>{nodes}</strong>
              <span>Nodes</span>
            </div>

            <div>
              <BrainCircuit size={17} />
              <strong>RF</strong>
              <span>AI Model</span>
            </div>

          </div>

        </section>


        {/* CONFIGURATION */}

        <section className="main-grid">


          <div className="card config-card">

            <div className="card-heading">

              <div className="heading-left">

                <div className="heading-icon">
                  <Cpu size={18} />
                </div>

                <div>
                  <span className="eyebrow-number">01</span>
                  <h3>Simulation Configuration</h3>
                </div>

              </div>

              <span className="configuration-tag">
                INPUT
              </span>

            </div>


            <div className="form-grid">

              <div className="field">

                <label>
                  <Server size={13} />
                  Number of Nodes
                </label>

                <div className="select-wrapper">

                  <select
                    value={nodes}
                    onChange={(e) => setNodes(e.target.value)}
                  >
                    <option value="4">4 Nodes</option>
                    <option value="9">9 Nodes</option>
                    <option value="16">16 Nodes</option>
                    <option value="25">25 Nodes</option>
                  </select>

                  <ChevronDown size={15} />

                </div>

              </div>


              <div className="field">

                <label>
                  <GitBranch size={13} />
                  Communication Pattern
                </label>

                <div className="select-wrapper">

                  <select
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                  >
                    <option>Local</option>
                    <option>Random</option>
                    <option>Global</option>
                  </select>

                  <ChevronDown size={15} />

                </div>

              </div>


              <div className="field">

                <label>
                  <Activity size={13} />
                  Communication Requests
                </label>

                <input
                  type="number"
                  min="1"
                  value={requests}
                  onChange={(e) => setRequests(e.target.value)}
                />

              </div>


              <div className="field">

                <label>
                  <Layers3 size={13} />
                  Parallel Workers
                </label>

                <div className="select-wrapper">

                  <select
                    value={workers}
                    onChange={(e) => setWorkers(e.target.value)}
                  >
                    <option value="1">1 Worker</option>
                    <option value="2">2 Workers</option>
                    <option value="4">4 Workers</option>
                    <option value="8">8 Workers</option>
                  </select>

                  <ChevronDown size={15} />

                </div>

              </div>

            </div>


            <div className="configuration-summary">

              <div>
                <span>Topology Set</span>
                <strong>Ring · Mesh · Torus</strong>
              </div>

              <div>
                <span>AI Model</span>
                <strong>Random Forest</strong>
              </div>

            </div>


            <div className="button-row">

              <button
                className="primary-button"
                onClick={runAnalysis}
                disabled={running}
              >

                {running ? (
                  <>
                    <span className="button-spinner" />
                    Running Simulation
                  </>
                ) : (
                  <>
                    <Play size={17} fill="currentColor" />
                    Run AI Analysis
                  </>
                )}

              </button>


              <button
                className="secondary-button"
                onClick={resetAnalysis}
              >
                <RotateCcw size={16} />
                Reset
              </button>

            </div>

          </div>


          {/* AI CARD */}

          <div className="card ai-card">

            <div className="ai-background-circle" />

            <div className="ai-heading">

              <div className="ai-icon">
                <BrainCircuit size={21} />
              </div>

              <div>
                <span>AI ENGINE</span>
                <strong>Random Forest</strong>
              </div>

              <div className="ai-live">
                <span />
                READY
              </div>

            </div>


            <div className="ai-result-label">
              RECOMMENDED TOPOLOGY
            </div>


            <div className="ai-best">

              <div>

                <div className="ai-best-icon">
                  <Network size={27} />
                </div>

                <div>
                  <h3>
                    {topologyInfo[aiBest].name}
                  </h3>

                  <p>
                    {topologyInfo[aiBest].description}
                  </p>
                </div>

              </div>

              <Target size={26} />

            </div>


            <div className="ai-numbers">

              <div>
                <span>Predicted Burst</span>
                <strong>
                  {results[aiBest].predicted}
                  <small> ms</small>
                </strong>
              </div>

              <div>
                <span>Communication Cost</span>
                <strong>
                  {results[aiBest].cost}
                </strong>
              </div>

            </div>


            <div className="ai-explanation">

              <CircleDot size={14} />

              <p>
                The AI predicts the lowest burst time for
                <b> {topologyInfo[aiBest].name}</b> under the
                selected workload.
              </p>

            </div>

          </div>

        </section>


        {/* TOPOLOGY SECTION */}

        <section className="section-block">

          <div className="section-header">

            <div>

              <div className="section-number">
                02
              </div>

              <div>
                <h3>Topology Simulation</h3>
                <p>
                  Communication structure and measured performance
                </p>
              </div>

            </div>


            <div className="simulation-status">

              {running ? (
                <>
                  <span className="status-pulse running" />
                  Simulation Running
                </>
              ) : (
                <>
                  <span className="status-pulse" />
                  Simulation Ready
                </>
              )}

            </div>

          </div>


          <div className="topology-grid">

            {Object.entries(topologyInfo).map(
              ([key, info]) => {

                const result = results[key];

                const selected = aiBest === key;

                return (

                  <div
                    className={`topology-card ${
                      selected ? "ai-selected" : ""
                    }`}
                    key={key}
                  >

                    {selected && (
                      <div className="ai-selected-label">
                        <Sparkles size={11} />
                        AI SELECTED
                      </div>
                    )}


                    <div className="topology-card-heading">

                      <div className="topology-name">

                        <div className="topology-symbol">
                          <Network size={17} />
                        </div>

                        <div>
                          <h4>{info.name}</h4>
                          <span>{info.description}</span>
                        </div>

                      </div>

                    </div>


                    <NetworkDiagram type={key} />


                    <div className="metric-grid">

                      <Metric
                        label="Avg. Path"
                        value={result.path}
                        unit="hops"
                      />

                      <Metric
                        label="Comm. Cost"
                        value={result.cost}
                        unit="units"
                      />

                      <Metric
                        label="Burst Time"
                        value={result.burst}
                        unit="ms"
                      />

                    </div>


                    <div className="card-bottom-status">

                      <span
                        className={
                          result.burst ===
                          results[actualBest].burst
                            ? "best-status"
                            : ""
                        }
                      >

                        {result.burst ===
                        results[actualBest].burst
                          ? "● Actual Best"
                          : "● Simulated"}

                      </span>

                      <span>
                        {result.predicted.toFixed(1)} ms AI
                      </span>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        </section>


        {/* PERFORMANCE */}

        <section className="section-block">

          <div className="section-header">

            <div>

              <div className="section-number">
                03
              </div>

              <div>
                <h3>Parallel Performance</h3>
                <p>
                  Runtime, speedup and resource utilization
                </p>
              </div>

            </div>

          </div>


          <div className="stats-grid">

            <div className="performance-stat">

              <div className="stat-top">
                <div className="stat-icon">
                  <Clock3 size={17} />
                </div>

                <span className="positive">
                  ↓ 61%
                </span>
              </div>

              <span className="stat-label">
                Execution Time
              </span>

              <strong>
                3.21 <small>sec</small>
              </strong>

              <p>
                Compared with sequential execution
              </p>

            </div>


            <div className="performance-stat">

              <div className="stat-top">
                <div className="stat-icon">
                  <Zap size={17} />
                </div>

                <span className="neutral">
                  PARALLEL
                </span>
              </div>

              <span className="stat-label">
                Speedup
              </span>

              <strong>
                2.81 <small>×</small>
              </strong>

              <p>
                Improvement over baseline
              </p>

            </div>


            <div className="performance-stat">

              <div className="stat-top">
                <div className="stat-icon">
                  <TrendingUp size={17} />
                </div>

                <span className="positive">
                  GOOD
                </span>
              </div>

              <span className="stat-label">
                Efficiency
              </span>

              <strong>
                70.3 <small>%</small>
              </strong>

              <p>
                With {workers} parallel workers
              </p>

            </div>


            <div className="performance-stat">

              <div className="stat-top">
                <div className="stat-icon">
                  <Network size={17} />
                </div>

                <span className="neutral">
                  TOPOLOGY
                </span>
              </div>

              <span className="stat-label">
                Network Diameter
              </span>

              <strong>
                4 <small>hops</small>
              </strong>

              <p>
                Maximum shortest path
              </p>

            </div>

          </div>


          <div className="charts-grid">

            {/* SPEEDUP CHART */}

            <div className="chart-card">

              <div className="chart-card-header">

                <div className="chart-title-icon">
                  <TrendingUp size={16} />
                </div>

                <div>
                  <h4>Workers vs Execution Time</h4>
                  <p>
                    Parallel scheduler performance
                  </p>
                </div>

              </div>


              <ResponsiveContainer
                width="100%"
                height={270}
              >

                <LineChart
                  data={speedupData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                  />

                  <XAxis
                    dataKey="workers"
                    stroke="#657086"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                  />

                  <YAxis
                    stroke="#657086"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#12172a",
                      border:
                        "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      color: "#fff",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="time"
                    name="Execution Time"
                    stroke="#9b7cff"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#9b7cff",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>


            {/* AI CHART */}

            <div className="chart-card">

              <div className="chart-card-header">

                <div className="chart-title-icon">
                  <BrainCircuit size={16} />
                </div>

                <div>
                  <h4>AI Prediction vs Actual</h4>
                  <p>
                    Burst-time model verification
                  </p>
                </div>

              </div>


              <ResponsiveContainer
                width="100%"
                height={270}
              >

                <BarChart
                  data={topologyChartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                  />

                  <XAxis
                    dataKey="topology"
                    stroke="#657086"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                  />

                  <YAxis
                    stroke="#657086"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#12172a",
                      border:
                        "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      color: "#fff",
                    }}
                  />

                  <Legend
                    wrapperStyle={{
                      fontSize: "10px",
                    }}
                  />

                  <Bar
                    dataKey="predicted"
                    name="AI Predicted"
                    fill="#9b7cff"
                    radius={[5, 5, 0, 0]}
                  />

                  <Bar
                    dataKey="actual"
                    name="Actual"
                    fill="#39d98a"
                    radius={[5, 5, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </section>


        {/* VERIFICATION */}

        <section
          className={`verification-card ${
            isCorrect ? "verified" : "not-verified"
          }`}
        >

          <div className="verification-icon">

            {isCorrect ? (
              <CheckCircle2 size={27} />
            ) : (
              <CircleDot size={27} />
            )}

          </div>


          <div className="verification-main">

            <div className="verification-label">

              {isCorrect
                ? "AI PREDICTION VERIFIED"
                : "AI PREDICTION REQUIRES REVIEW"}

            </div>


            <h3>

              AI selected{" "}
              <strong>
                {topologyInfo[aiBest].name}
              </strong>

              <span className="verification-arrow">
                →
              </span>

              Actual best{" "}
              <strong>
                {topologyInfo[actualBest].name}
              </strong>

            </h3>


            <p>

              {isCorrect
                ? "The topology recommended by the Random Forest model matches the topology with the lowest measured burst time."
                : "The AI recommendation differs from the topology with the lowest measured burst time."}

            </p>

          </div>


          <div className="verification-badge">

            {isCorrect ? (
              <>
                <CheckCircle2 size={15} />
                CORRECT
              </>
            ) : (
              <>
                <CircleDot size={15} />
                REVIEW
              </>
            )}

          </div>

        </section>


        {/* ANALYSIS SUMMARY */}

        <section className="summary-section">

          <div className="summary-heading">

            <div>
              <span>ANALYSIS SUMMARY</span>
              <h3>Current Experiment</h3>
            </div>

            <div className="summary-time">
              <Clock3 size={14} />
              Latest run
            </div>

          </div>


          <div className="summary-grid">

            <div>
              <span>Nodes</span>
              <strong>{nodes}</strong>
            </div>

            <div>
              <span>Pattern</span>
              <strong>{pattern}</strong>
            </div>

            <div>
              <span>Requests</span>
              <strong>{requests}</strong>
            </div>

            <div>
              <span>Workers</span>
              <strong>{workers}</strong>
            </div>

            <div>
              <span>AI Model</span>
              <strong>Random Forest</strong>
            </div>

            <div>
              <span>Recommended</span>
              <strong className="summary-best">
                {topologyInfo[aiBest].name}
              </strong>
            </div>

          </div>

        </section>


      </main>


      <footer className="footer">

        <div className="footer-brand">

          <div className="footer-dot" />

          AI Network Selector

        </div>

        <div>
          Distributed & Parallel Computing
        </div>

        <div>
          Case Study 09
        </div>

      </footer>

    </div>
  );
}


export default App;