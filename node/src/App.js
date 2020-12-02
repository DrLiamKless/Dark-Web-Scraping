import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Dashboard from "./components/dashboard";
import Home from "./components/home";
import Alerts from "./components/alerts";
import Statistics from "./components/statistics";

require('dotenv').config()


function App() {
  const [articles, setArticles] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="App">
      <Router>
        <Dashboard   
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          setArticles={setArticles}>
        </Dashboard>
        <Switch>
          {/* <Route path="/alerts"><Alerts setArticles={setArticles} articles={articles}/></Route> */}
          {/* <Route path="/statistics"><Statistics/></Route> */}
          <Route path="/"><Home setArticles={setArticles} articles={articles}/></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
