require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Home from './Home.js';
import Card from './Card.js';
import Layout from './Layout.js';
import Reading from './Reading.js';


const Main = () => {

  return <Router>

    <div>
      <ul className="nav bg-light">
        <li className="nav-item">
          <Link className="nav-link" to="/">Cards</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/reading">Reading</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/layout">New Layout</Link>
        </li>
      </ul>
      <br/>

      <div className="container-fluid">

        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/reading" component={Reading}/>
          <Route path="/layout" component={Layout}/>
          <Route path="/card/:suit/:rank" component={Card}/>

        </Switch>

      </div>
    </div>

  </Router>
}

export default Main
