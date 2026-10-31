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

const sampleRows = [
  { id: 1, customer_name: "Alice", revenue: 1200 },
  { id: 2, customer_name: "Bob", revenue: 850 },
  { id: 3, customer_name: "Charlie", revenue: 1750 },
  { id: 4, customer_name: "Diana", revenue: 940 },
];

function App() {
  const [query, setQuery] = useState(initialQuery);
  const [rows, setRows] = useState<typeof sampleRows>([]);
  const [status, setStatus] = useState("Ready. Run the example query.");

  function runQuery() {
    if (!query.trim()) {
      setStatus("Please enter a SQL query.");
      setRows([]);
      return;
    }
    setRows(sampleRows);
    setStatus(`Demo: ${sampleRows.length} rows returned.`);
  }

  function resetEditor() {
    setQuery(initialQuery);
    setRows([]);
    setStatus("Editor reset.");
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>
          <Database size={20} />
          MonacoSQL
        </h2>
        <p className="sidebar-label">EXAMPLE DATABASE</p>
        <div className="table-name">▾ orders</div>
        <div className="column-name">id</div>
        <div className="column-name">customer_name</div>
        <div className="column-name">revenue</div>
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
                    <th>ID</th>
                    <th>Customer Name</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.customer_name}</td>
                      <td>{row.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-results">Run the example query to see sample data.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;