import "./App.css";
import Home from "./Pages/Home";
import StatsPage from "./Pages/StatsPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <ul className="navbar-nav mr-auto">
              <li>
                <Link to={"/"} className="nav-link">
                  {" "}
                  Home{" "}
                </Link>
              </li>
              <li>
                <Link to={"/stats"} className="nav-link">
                  Statistics page
                </Link>
              </li>
            </ul>
          </nav>
          <hr />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </div>
      </Router>
      {/* <Home />
      <StatsPage /> */}
    </div>
  );
}

export default App;
