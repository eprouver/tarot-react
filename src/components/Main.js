require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Home from './Home.js';
import Card from './Card.js';
import Layout from './Layout.js';
import Reading from './Reading.js';
import Story from './Story.js';
import Story2 from './Story2.js';
import Kcard from './Kcard.js';


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
          <Link className="nav-link" to="/story">Tale</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/story2">Story</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/layout">New Layout</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/kcard">Katerina Mode</Link>
        </li>
      </ul>
      <br/>

      <div className="container-fluid">

        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/reading" component={Reading}/>
          <Route path="/story" component={Story}/>
          <Route path="/story2" component={Story2}/>
          <Route path="/layout" component={Layout}/>
          <Route path="/card/:suit/:rank" component={Card}/>
          <Route path="/kcard" component={Kcard}/>
        </Switch>

      </div>
    </div>

  </Router>
}

export default Main
