import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Database, Play, RotateCcw } from "lucide-react";
import "./App.css";

const initialQuery = `SELECT 
    id, 
    customer_name, 
    revenue 
FROM orders 
LIMIT 10;`;

function App() {
  const [query, setQuery] = useState(initialQuery);
  const [rows, setRows] = useState<any[]>([]);
  const [status, setStatus] = useState("Ready. Run the query to fetch from ClickHouse.");

  async function runQuery() {
    if (!query.trim()) {
      setStatus("Please enter a SQL query.");
      setRows([]);
      return;
    }

    setStatus("Executing query...");
    setRows([]);

    try {
      const response = await fetch("http://localhost:3000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus(`Error: ${data.error}`);
        return;
      }

      setRows(data.rows);
      setStatus(`Success: ${data.rows.length} rows returned in real-time.`);
    } catch (error) {
      setStatus(`Network error: Could not connect to API.`);
    }
  }

  function resetEditor() {
    setQuery(initialQuery);
    setRows([]);
    setStatus("Editor reset.");
  }

  // Extract column names dynamically from the first row of results
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>
          <Database size={20} />
          MonacoSQL
        </h2>
        <p className="sidebar-label">CLICKHOUSE DATABASE</p>
        <div className="table-name">▾ orders</div>
        <div className="column-name">id (UInt32)</div>
        <div className="column-name">customer_name (String)</div>
        <div className="column-name">revenue (Float64)</div>
      </aside>

      <main className="workspace">
        <header className="toolbar">
          <h3>Query Editor</h3>
          <div className="actions">
            <button onClick={resetEditor}>
              <RotateCcw size={16} />
              Reset
            </button>
            <button className="run-button" onClick={runQuery}>
              <Play size={16} />
              Run Query
            </button>
          </div>
        </header>

        <div className="editor-panel">
          <Editor 
            height="100%" 
            defaultLanguage="sql" 
            theme="vs-dark" 
            value={query}
            onChange={(value) => setQuery(value ?? "")}
            options={{
              minimap: { enabled: false },
              fontSize: 15,
              automaticLayout: true,
              wordWrap: "on",
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        <section className="results-panel">
          <div className="results-heading">
            <h3>Query Results</h3>
            <span>{status}</span>
          </div>
          {rows.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      {columns.map((col) => (
                        <td key={col}>{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-results">No results to display.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;