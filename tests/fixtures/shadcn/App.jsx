// Original representative CSS-variable components, Apache-2.0. No registry install.
import React from "react";
import { createRoot } from "react-dom/client";
function Button({ children, onClick }) { return <button className="button" onClick={onClick}>{children}</button>; }
function Card({ children }) { return <section className="card">{children}</section>; }
function App() {
  return <main><h1>Keep the components. Continue the design.</h1><Card><h2>Project continuity</h2><p>A second session preserves the selected typography and measured palette.</p><Button onClick={()=>document.documentElement.classList.toggle("dark")}>Switch theme</Button><p className="muted">A representative shadcn-style variable contract.</p></Card></main>;
}
createRoot(document.getElementById("root")).render(<App/>);
