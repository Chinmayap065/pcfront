import { useMemo, useState } from "react";

import {
  Activity,
  BrainCircuit,
  CheckCircle2,
  CircleDot,
  Cpu,
  Gauge,
  Network,
  Play,
  RotateCcw,
  Server,
  Sparkles,
  Timer,
  TrendingUp,
  Zap,
  AlertCircle,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import "./App.css";


const API_URL = "http://127.0.0.1:8000";


const initialResults = {
  ring: {
    path: 0,
    cost: 0,
    burst: 0,
    predicted: 0,
    diameter: 0,
  },

  mesh: {
    path: 0,
    cost: 0,
    burst: 0,
    predicted: 0,
    diameter: 0,
  },

  torus: {
    path: 0,
    cost: 0,
    burst: 0,
    predicted: 0,
    diameter: 0,
  },
};


function formatNumber(value, digits = 3) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
    return "—";
  }

  return Number(value).toFixed(digits);
}


function App() {

  const [nodes, setNodes] = useState(9);

  const [pattern, setPattern] =
    useState("local");

  const [requests, setRequests] =
    useState(40);

  const [workers, setWorkers] =
    useState(4);

  const [results, setResults] =
    useState(initialResults);

  const [aiBest, setAiBest] =
    useState(null);

  const [actualBest, setActualBest] =
    useState(null);

  const [mae, setMae] =
    useState(null);

  const [performance, setPerformance] =
    useState(null);

  const [verification, setVerification] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [hasRun, setHasRun] =
    useState(false);


  const workerChartData = useMemo(() => {

    if (
      !performance ||
      !performance.worker_performance
    ) {
      return [];
    }

    return performance.worker_performance.map(
      (item) => ({
        workers: item.workers,

        execution: Number(
          item.execution_time
        ),

        speedup: Number(
          item.speedup
        ),

        efficiency: Number(
          item.efficiency
        ),
      })
    );

  }, [performance]);


  const predictionChartData = useMemo(() => {

    return [
      {
        topology: "Ring",

        predicted:
          Number(
            results.ring.predicted
          ),

        actual:
          Number(
            results.ring.burst
          ),
      },

      {
        topology: "Mesh",

        predicted:
          Number(
            results.mesh.predicted
          ),

        actual:
          Number(
            results.mesh.burst
          ),
      },

      {
        topology: "Torus",

        predicted:
          Number(
            results.torus.predicted
          ),

        actual:
          Number(
            results.torus.burst
          ),
      },
    ];

  }, [results]);


  async function runAnalysis() {

    setLoading(true);

    setError("");

    try {

      const response = await fetch(
        `${API_URL}/analyze`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            nodes: Number(nodes),

            pattern,

            requests: Number(requests),

            workers: Number(workers),
          }),
        }
      );


      if (!response.ok) {

        let message =
          "Backend analysis failed.";

        try {

          const errorData =
            await response.json();

          message =
            errorData.detail ||
            message;

        } catch {

          // Keep default error message.
        }

        throw new Error(message);
      }


      const data =
        await response.json();


      const backendResults =
        data.actual.results;


      setResults({

        ring: {

          path:
            backendResults.ring
              .average_path,

          cost:
            backendResults.ring
              .communication_cost,

          burst:
            backendResults.ring
              .burst_time,

          predicted:
            data.ai.predictions.ring,

          diameter:
            backendResults.ring
              .diameter,
        },


        mesh: {

          path:
            backendResults.mesh
              .average_path,

          cost:
            backendResults.mesh
              .communication_cost,

          burst:
            backendResults.mesh
              .burst_time,

          predicted:
            data.ai.predictions.mesh,

          diameter:
            backendResults.mesh
              .diameter,
        },


        torus: {

          path:
            backendResults.torus
              .average_path,

          cost:
            backendResults.torus
              .communication_cost,

          burst:
            backendResults.torus
              .burst_time,

          predicted:
            data.ai.predictions.torus,

          diameter:
            backendResults.torus
              .diameter,
        },

      });


      setAiBest(
        data.ai.recommended
      );


      setActualBest(
        data.actual.best
      );


      setMae(
        data.ai.mae
      );


      setPerformance(
        data.performance
      );


      setVerification(
        data.verification
      );


      setHasRun(true);

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Unable to connect to backend."
      );

    } finally {

      setLoading(false);
    }
  }


  function resetAnalysis() {

    setResults(
      initialResults
    );

    setAiBest(null);

    setActualBest(null);

    setMae(null);

    setPerformance(null);

    setVerification(null);

    setError("");

    setHasRun(false);
  }


  const topologyCards = [

    {
      key: "ring",

      name: "Ring",

      icon: CircleDot,

      description:
        "Simple circular connection with two neighbors per node.",

      result:
        results.ring,
    },


    {
      key: "mesh",

      name: "Mesh",

      icon: Network,

      description:
        "Structured grid providing multiple short local paths.",

      result:
        results.mesh,
    },


    {
      key: "torus",

      name: "Torus",

      icon: Activity,

      description:
        "Mesh with wrap-around links for shorter boundary paths.",

      result:
        results.torus,
    },

  ];


  return (

    <div className="app-shell">


      {/* HEADER */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-mark">

            <BrainCircuit size={21} />

          </div>


          <div>

            <div className="brand-title">
              AI Network Selector
            </div>

            <div className="brand-subtitle">
              Parallel topology intelligence
            </div>

          </div>

        </div>


        <div className="header-right">

          <div className="status-pill">

            <span className="status-dot" />

            System Online

          </div>


          <div className="case-label">
            Case Study 09
          </div>

        </div>

      </header>


      <main className="main-content">


        {/* HERO */}

        <section className="hero">

          <div className="hero-copy">

            <div className="eyebrow">

              <Sparkles size={15} />

              AI-assisted parallel computing

            </div>


            <h1>

              Intelligent topology

              <span>
                {" "}selection.
              </span>

            </h1>


            <p>

              Simulate Ring, Mesh and Torus
              interconnection networks, measure
              communication performance and use
              a Random Forest model to predict the
              most suitable topology.

            </p>

          </div>


          <div className="hero-chip">

            <Zap size={18} />

            <div>

              <strong>
                Real-time simulation
              </strong>

              <span>
                AI prediction + verification
              </span>

            </div>

          </div>

        </section>


        {/* ERROR */}

        {error && (

          <div className="error-banner">

            <AlertCircle size={20} />

            <div>

              <strong>
                Analysis failed
              </strong>

              <p>
                {error}
              </p>

            </div>

          </div>

        )}


        {/* CONFIGURATION */}

        <section className="section">

          <div className="section-heading">

            <div>

              <div className="section-kicker">
                01 / CONFIGURATION
              </div>

              <h2>
                Simulation Configuration
              </h2>

            </div>


            <span className="section-note">
              Define the workload
            </span>

          </div>


          <div className="config-card">


            <div className="form-group">

              <label>
                Number of Nodes
              </label>


              <select
                value={nodes}
                onChange={(e) =>
                  setNodes(
                    Number(
                      e.target.value
                    )
                  )
                }
              >

                <option value={4}>
                  4 nodes
                </option>

                <option value={9}>
                  9 nodes
                </option>

                <option value={16}>
                  16 nodes
                </option>

                <option value={25}>
                  25 nodes
                </option>

              </select>

            </div>


            <div className="form-group">

              <label>
                Communication Pattern
              </label>


              <select
                value={pattern}
                onChange={(e) =>
                  setPattern(
                    e.target.value
                  )
                }
              >

                <option value="local">
                  Local
                </option>

                <option value="random">
                  Random
                </option>

                <option value="global">
                  Global
                </option>

              </select>

            </div>


            <div className="form-group">

              <label>
                Communication Requests
              </label>


              <input
                type="number"
                min="1"
                max="500"
                value={requests}
                onChange={(e) =>
                  setRequests(
                    Number(
                      e.target.value
                    )
                  )
                }
              />

            </div>


            <div className="form-group">

              <label>
                Parallel Workers
              </label>


              <select
                value={workers}
                onChange={(e) =>
                  setWorkers(
                    Number(
                      e.target.value
                    )
                  )
                }
              >

                <option value={1}>
                  1 worker
                </option>

                <option value={2}>
                  2 workers
                </option>

                <option value={4}>
                  4 workers
                </option>

                <option value={8}>
                  8 workers
                </option>

              </select>

            </div>


            <div className="config-actions">


              <button
                className="primary-btn"
                onClick={runAnalysis}
                disabled={loading}
              >

                {loading ? (

                  <>

                    <span className="spinner" />

                    Running...

                  </>

                ) : (

                  <>

                    <Play size={17} />

                    Run AI Analysis

                  </>

                )}

              </button>


              <button
                className="secondary-btn"
                onClick={resetAnalysis}
                disabled={loading}
              >

                <RotateCcw size={16} />

                Reset

              </button>


            </div>

          </div>

        </section>


        {/* AI ENGINE */}

        <section className="section">


          <div className="section-heading">

            <div>

              <div className="section-kicker">
                02 / AI ENGINE
              </div>

              <h2>
                AI Recommendation
              </h2>

            </div>


            <span className="model-tag">
              Random Forest Regressor
            </span>

          </div>


          <div className="ai-grid">


            <div className="ai-main-card">


              <div className="ai-icon">

                <BrainCircuit size={25} />

              </div>


              <div className="ai-main-content">

                <span className="muted-label">
                  Recommended topology
                </span>


                <div className="recommendation">

                  {aiBest
                    ? aiBest.toUpperCase()
                    : "RUN ANALYSIS"}

                </div>


                <p>

                  {aiBest

                    ? `The AI model predicts ${aiBest} will have the lowest burst time for the selected workload.`

                    : "Configure the workload and run the AI analysis to generate a recommendation."}

                </p>

              </div>

            </div>


            <div className="metric-card">


              <div className="metric-icon">

                <Timer size={19} />

              </div>


              <span className="muted-label">
                AI predicted burst
              </span>


              <strong>

                {aiBest
                  ? `${formatNumber(
                      results[aiBest]
                        ?.predicted
                    )}`
                  : "—"}

              </strong>


              <small>
                simulated units
              </small>

            </div>


            <div className="metric-card">


              <div className="metric-icon">

                <Gauge size={19} />

              </div>


              <span className="muted-label">
                Model MAE
              </span>


              <strong>

                {mae !== null
                  ? formatNumber(
                      mae,
                      4
                    )
                  : "—"}

              </strong>


              <small>
                lower is better
              </small>

            </div>

          </div>

        </section>


        {/* TOPOLOGIES */}

        <section className="section">


          <div className="section-heading">

            <div>

              <div className="section-kicker">
                03 / TOPOLOGY SIMULATION
              </div>

              <h2>
                Network Comparison
              </h2>

            </div>


            <span className="section-note">
              Same workload for every topology
            </span>

          </div>


          <div className="topology-grid">


            {topologyCards.map(
              (card) => {

                const Icon =
                  card.icon;

                const isSelected =
                  aiBest === card.key;


                return (

                  <div
                    className={
                      `topology-card ${
                        isSelected
                          ? "selected"
                          : ""
                      }`
                    }

                    key={card.key}
                  >


                    <div className="topology-header">


                      <div className="topology-name">


                        <div className="topology-icon">

                          <Icon size={20} />

                        </div>


                        <div>

                          <h3>
                            {card.name}
                          </h3>

                          <p>
                            {card.description}
                          </p>

                        </div>

                      </div>


                      {isSelected && (

                        <span className="selected-badge">

                          <Sparkles size={13} />

                          AI Selected

                        </span>

                      )}

                    </div>


                    <div className="network-preview">

                      <TopologyDiagram
                        type={card.key}
                      />

                    </div>


                    <div className="topology-stats">


                      <Stat
                        label="Avg Path"
                        value={
                          formatNumber(
                            card.result.path
                          )
                        }
                      />


                      <Stat
                        label="Comm Cost"
                        value={
                          formatNumber(
                            card.result.cost
                          )
                        }
                      />


                      <Stat
                        label="Burst Time"
                        value={
                          formatNumber(
                            card.result.burst
                          )
                        }
                      />


                      <Stat
                        label="Diameter"
                        value={
                          card.result.diameter ||
                          "—"
                        }
                      />


                    </div>

                  </div>

                );

              }
            )}

          </div>

        </section>


        {/* PERFORMANCE */}

        <section className="section">


          <div className="section-heading">

            <div>

              <div className="section-kicker">
                04 / PARALLEL PERFORMANCE
              </div>

              <h2>
                Performance Analysis
              </h2>

            </div>


            <span className="section-note">
              Workers vs execution
            </span>

          </div>


          <div className="performance-grid">


            <PerformanceCard
              icon={Timer}
              label="Execution Time"
              value={
                performance
                  ? `${formatNumber(
                      performance.parallel_time,
                      4
                    )} s`
                  : "—"
              }
            />


            <PerformanceCard
              icon={TrendingUp}
              label="Speedup"
              value={
                performance
                  ? `${formatNumber(
                      performance.speedup
                    )}×`
                  : "—"
              }
            />


            <PerformanceCard
              icon={Gauge}
              label="Efficiency"
              value={
                performance
                  ? `${formatNumber(
                      performance.efficiency,
                      1
                    )}%`
                  : "—"
              }
            />


            <PerformanceCard
              icon={Server}
              label="Workers"
              value={
                hasRun
                  ? workers
                  : "—"
              }
            />


          </div>


          <div className="charts-grid">


            {/* WORKER CHART */}

            <div className="chart-card">


              <div className="chart-heading">


                <div>

                  <h3>
                    Workers vs Execution Time
                  </h3>

                  <p>
                    Lower execution time indicates
                    better parallel performance.
                  </p>

                </div>


                <Cpu size={19} />

              </div>


              <div className="chart">


                {workerChartData.length > 0 ? (

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <LineChart
                      data={
                        workerChartData
                      }

                      margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 5,
                      }}
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                        opacity={0.15}
                      />


                      <XAxis
                        dataKey="workers"

                        tick={{
                          fill: "#687487",
                          fontSize: 11,
                        }}

                        axisLine={{
                          stroke:
                            "rgba(255,255,255,0.12)",
                        }}

                        tickLine={false}
                      />


                      <YAxis

                        tick={{
                          fill: "#687487",
                          fontSize: 11,
                        }}

                        axisLine={{
                          stroke:
                            "rgba(255,255,255,0.12)",
                        }}

                        tickLine={false}
                      />


                      <Tooltip
                        contentStyle={{
                          backgroundColor:
                            "#111722",

                          border:
                            "1px solid rgba(255,255,255,0.1)",

                          borderRadius:
                            "8px",

                          color:
                            "#e8edf5",
                        }}

                        labelStyle={{
                          color:
                            "#cfd5e0",
                        }}

                        itemStyle={{
                          color:
                            "#cfd5e0",
                        }}
                      />


                      <Line
                        type="monotone"

                        dataKey="execution"

                        name="Execution Time"

                        stroke="#6d78ff"

                        strokeWidth={3}

                        dot={{
                          r: 4,
                          fill: "#6d78ff",
                          strokeWidth: 0,
                        }}

                        activeDot={{
                          r: 6,
                        }}
                      />


                    </LineChart>

                  </ResponsiveContainer>

                ) : (

                  <EmptyChart />

                )}

              </div>

            </div>


            {/* AI PREDICTION CHART */}

            <div className="chart-card">


              <div className="chart-heading">


                <div>

                  <h3>
                    AI Prediction vs Actual
                  </h3>

                  <p>
                    Verification of predicted burst time.
                  </p>

                </div>


                <BrainCircuit size={19} />

              </div>


              <div className="chart">


                {hasRun ? (

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <BarChart
                      data={
                        predictionChartData
                      }

                      margin={{
                        top: 20,
                        right: 10,
                        left: 0,
                        bottom: 10,
                      }}

                      barGap={6}

                      barCategoryGap="25%"
                    >


                      <CartesianGrid
                        strokeDasharray="3 3"
                        opacity={0.15}
                      />


                      <XAxis
                        dataKey="topology"

                        tick={{
                          fill: "#687487",
                          fontSize: 11,
                        }}

                        axisLine={{
                          stroke:
                            "rgba(255,255,255,0.12)",
                        }}

                        tickLine={false}
                      />


                      <YAxis

                        tick={{
                          fill: "#687487",
                          fontSize: 11,
                        }}

                        axisLine={{
                          stroke:
                            "rgba(255,255,255,0.12)",
                        }}

                        tickLine={false}
                      />


                      <Tooltip

                        contentStyle={{
                          backgroundColor:
                            "#111722",

                          border:
                            "1px solid rgba(255,255,255,0.1)",

                          borderRadius:
                            "8px",

                          color:
                            "#e8edf5",

                          boxShadow:
                            "0 10px 30px rgba(0,0,0,0.35)",
                        }}

                        labelStyle={{
                          color:
                            "#ffffff",

                          fontWeight:
                            600,

                          marginBottom:
                            "5px",
                        }}

                        itemStyle={{
                          color:
                            "#dce2ed",
                        }}

                        cursor={{
                          fill:
                            "rgba(255,255,255,0.03)",
                        }}
                      />


                      <Legend

                        verticalAlign="bottom"

                        height={32}

                        iconType="circle"

                        wrapperStyle={{
                          color:
                            "#8d98aa",

                          fontSize:
                            "11px",

                          paddingTop:
                            "8px",
                        }}
                      />


                      <Bar

                        dataKey="predicted"

                        name="AI Predicted"

                        fill="#6d78ff"

                        stroke="#6d78ff"

                        strokeWidth={1}

                        radius={[
                          6,
                          6,
                          0,
                          0
                        ]}

                        maxBarSize={42}
                      />


                      <Bar

                        dataKey="actual"

                        name="Actual"

                        fill="#35c9b0"

                        stroke="#35c9b0"

                        strokeWidth={1}

                        radius={[
                          6,
                          6,
                          0,
                          0
                        ]}

                        maxBarSize={42}
                      />


                    </BarChart>

                  </ResponsiveContainer>

                ) : (

                  <EmptyChart />

                )}

              </div>

            </div>

          </div>

        </section>


        {/* VERIFICATION */}

        <section className="section">


          <div className="section-heading">

            <div>

              <div className="section-kicker">
                05 / VERIFICATION
              </div>

              <h2>
                AI vs Simulation
              </h2>

            </div>

          </div>


          <div
            className={
              `verification-card ${
                verification?.correct
                  ? "correct"
                  : verification
                    ? "review"
                    : ""
              }`
            }
          >


            <div className="verification-icon">


              {verification?.correct ? (

                <CheckCircle2 size={30} />

              ) : (

                <AlertCircle size={30} />

              )}

            </div>


            <div className="verification-content">


              <span className="muted-label">
                Prediction verification
              </span>


              <h3>

                {verification

                  ? verification.correct
                    ? "AI prediction verified"
                    : "AI prediction requires review"

                  : "Run an analysis to verify the AI model"}

              </h3>


              <p>

                {verification

                  ? `AI selected ${verification.ai_selected.toUpperCase()} while simulation identified ${verification.actual_best.toUpperCase()} as the actual best topology.`

                  : "The system compares the AI prediction with the actual simulation result."}

              </p>

            </div>


            {verification && (

              <div className="verification-result">


                <div>

                  <span>
                    AI
                  </span>

                  <strong>
                    {verification.ai_selected.toUpperCase()}
                  </strong>

                </div>


                <div>

                  <span>
                    Actual
                  </span>

                  <strong>
                    {verification.actual_best.toUpperCase()}
                  </strong>

                </div>


              </div>

            )}

          </div>

        </section>


        {/* SUMMARY */}

        <section className="section">


          <div className="section-heading">

            <div>

              <div className="section-kicker">
                06 / ANALYSIS SUMMARY
              </div>

              <h2>
                Experiment Summary
              </h2>

            </div>

          </div>


          <div className="summary-grid">


            <SummaryItem
              label="Nodes"
              value={nodes}
            />


            <SummaryItem
              label="Pattern"
              value={
                pattern
                  .charAt(0)
                  .toUpperCase()
                  + pattern.slice(1)
              }
            />


            <SummaryItem
              label="Requests"
              value={requests}
            />


            <SummaryItem
              label="Workers"
              value={workers}
            />


            <SummaryItem
              label="AI Model"
              value="Random Forest"
            />


            <SummaryItem
              label="Recommended"
              value={
                aiBest
                  ? aiBest.toUpperCase()
                  : "—"
              }
            />


          </div>

        </section>

      </main>


      <footer className="footer">

        <span>
          AI Network Selector
        </span>

        <span>
          Interconnection Network Selection
          · Parallel Computing
        </span>

      </footer>

    </div>
  );
}


/* --------------------------------------------------
   SMALL COMPONENTS
-------------------------------------------------- */


function Stat({
  label,
  value
}) {

  return (

    <div className="topology-stat">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>

  );
}


function PerformanceCard({
  icon: Icon,
  label,
  value
}) {

  return (

    <div className="performance-card">

      <div className="performance-icon">

        <Icon size={19} />

      </div>


      <span>
        {label}
      </span>


      <strong>
        {value}
      </strong>

    </div>

  );
}


function SummaryItem({
  label,
  value
}) {

  return (

    <div className="summary-item">

      <span>
        {label}
      </span>


      <strong>
        {value}
      </strong>

    </div>

  );
}


function EmptyChart() {

  return (

    <div className="empty-chart">

      <Activity size={24} />

      <span>
        Run analysis to generate chart data
      </span>

    </div>

  );
}


/* --------------------------------------------------
   TOPOLOGY DIAGRAMS
-------------------------------------------------- */


function TopologyDiagram({
  type
}) {

  if (type === "ring") {

    return (

      <svg
        viewBox="0 0 240 130"
        className="topology-svg"
      >

        <rect
          x="45"
          y="25"
          width="150"
          height="80"
          rx="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.6"
        />


        <Node
          x="45"
          y="65"
          label="0"
        />


        <Node
          x="120"
          y="25"
          label="1"
        />


        <Node
          x="195"
          y="65"
          label="2"
        />


        <Node
          x="120"
          y="105"
          label="3"
        />

      </svg>

    );
  }


  if (type === "mesh") {

    return (

      <svg
        viewBox="0 0 240 150"
        className="topology-svg"
      >

        <line
          x1="55"
          y1="35"
          x2="120"
          y2="35"
        />

        <line
          x1="120"
          y1="35"
          x2="185"
          y2="35"
        />


        <line
          x1="55"
          y1="75"
          x2="120"
          y2="75"
        />

        <line
          x1="120"
          y1="75"
          x2="185"
          y2="75"
        />


        <line
          x1="55"
          y1="115"
          x2="120"
          y2="115"
        />

        <line
          x1="120"
          y1="115"
          x2="185"
          y2="115"
        />


        <line
          x1="55"
          y1="35"
          x2="55"
          y2="75"
        />

        <line
          x1="55"
          y1="75"
          x2="55"
          y2="115"
        />


        <line
          x1="120"
          y1="35"
          x2="120"
          y2="75"
        />

        <line
          x1="120"
          y1="75"
          x2="120"
          y2="115"
        />


        <line
          x1="185"
          y1="35"
          x2="185"
          y2="75"
        />

        <line
          x1="185"
          y1="75"
          x2="185"
          y2="115"
        />


        <Node
          x="55"
          y="35"
          label="0"
        />

        <Node
          x="120"
          y="35"
          label="1"
        />

        <Node
          x="185"
          y="35"
          label="2"
        />


        <Node
          x="55"
          y="75"
          label="3"
        />

        <Node
          x="120"
          y="75"
          label="4"
        />

        <Node
          x="185"
          y="75"
          label="5"
        />


        <Node
          x="55"
          y="115"
          label="6"
        />

        <Node
          x="120"
          y="115"
          label="7"
        />

        <Node
          x="185"
          y="115"
          label="8"
        />

      </svg>

    );
  }


  return (

    <svg
      viewBox="0 0 240 150"
      className="topology-svg"
    >

      <line
        x1="55"
        y1="35"
        x2="120"
        y2="35"
      />

      <line
        x1="120"
        y1="35"
        x2="185"
        y2="35"
      />


      <line
        x1="55"
        y1="75"
        x2="120"
        y2="75"
      />

      <line
        x1="120"
        y1="75"
        x2="185"
        y2="75"
      />


      <line
        x1="55"
        y1="115"
        x2="120"
        y2="115"
      />

      <line
        x1="120"
        y1="115"
        x2="185"
        y2="115"
      />


      <line
        x1="55"
        y1="35"
        x2="55"
        y2="75"
      />

      <line
        x1="55"
        y1="75"
        x2="55"
        y2="115"
      />


      <line
        x1="120"
        y1="35"
        x2="120"
        y2="75"
      />

      <line
        x1="120"
        y1="75"
        x2="120"
        y2="115"
      />


      <line
        x1="185"
        y1="35"
        x2="185"
        y2="75"
      />

      <line
        x1="185"
        y1="75"
        x2="185"
        y2="115"
      />


      {/* Wrap-around indicators */}

      <path
        d="M55 20 C15 20, 15 130, 55 130"
        fill="none"
        stroke="currentColor"
        strokeDasharray="5 5"
        opacity="0.45"
      />


      <path
        d="M185 20 C225 20, 225 130, 185 130"
        fill="none"
        stroke="currentColor"
        strokeDasharray="5 5"
        opacity="0.45"
      />


      <Node
        x="55"
        y="35"
        label="0"
      />

      <Node
        x="120"
        y="35"
        label="1"
      />

      <Node
        x="185"
        y="35"
        label="2"
      />


      <Node
        x="55"
        y="75"
        label="3"
      />

      <Node
        x="120"
        y="75"
        label="4"
      />

      <Node
        x="185"
        y="75"
        label="5"
      />


      <Node
        x="55"
        y="115"
        label="6"
      />

      <Node
        x="120"
        y="115"
        label="7"
      />

      <Node
        x="185"
        y="115"
        label="8"
      />

    </svg>

  );
}


function Node({
  x,
  y,
  label
}) {

  return (

    <g>

      <circle
        cx={x}
        cy={y}
        r="9"
        fill="currentColor"
        opacity="0.9"
      />


      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fontSize="8"
        fill="white"
      >

        {label}

      </text>

    </g>

  );
}


export default App;