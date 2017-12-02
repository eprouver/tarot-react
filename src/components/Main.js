require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import _ from 'underscore';
import { BrowserRouter as Router, Switch, Route, Link, withRouter } from 'react-router-dom';



import tarot from '../sources/tarot.json';
function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('../images/tarot', false, /\.(png|jpe?g|svg)$/));




const Main = () => {

  return <Router>

      <div>
      <ul className="nav">
        <li className="nav-item"><Link className="nav-link" to="/">Cards</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/reading">Reading</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/layout">New Layout</Link></li>
      </ul>

      <hr/>

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

class Card extends React.Component {

  render() {

    var card =
      _(tarot.cards).findWhere({suit: this.props.match.params.suit, rank: parseInt(this.props.match.params.rank)});

    return <div className="container">
      <div className="row">
      <h1 className="col-sm animated slideInLeft text-center">{card.name}:</h1>
      <div className="col-sm animated slideInRight">
      {card.keywords.map(word => {
        return <h2 className="text-muted" style={{display: 'inline-block'}}>{word}&nbsp;&nbsp;</h2>
      })}
      </div>
      </div>

      <div className="row">
        <div className="col-sm animated slideInLeft text-center">
          <img className="mw-100" src={images[card.image]} />
        </div>
        <div className="col-sm animated slideInRight">
          <br/>
          <h3>Indications</h3>
          {card.fortune_telling.map(word => {
            return <li>{word}</li>
          })}

          <br/>
          <h3>Proper Meanings</h3>
          {card.meanings.light.map(word => {
            return <li>{word}</li>
          })}

          <br/>
          <h3>Reversed Meanings</h3>
          {card.meanings.shadow.map(word => {
            return <li>{word}</li>
          })}
        </div>
      </div>

    </div>
  }
}

const Home = ({ match }) => {
  const linker = (card,i) => {
    return <div className="col-6 col-sm-4 col-xl-2">
    <Link className="btn btn-link mw-100" to={'/card/' +  card.suit + '/' + card.rank}>
    <img className="w-75" src={images[card.image]} /><br/>

        {card.name}
      </Link>
    </div>
  }

  return <div className="animated fadeIn">
    <h2>Cards:</h2>
    <div className="nav">
      <span className="nav-link disabled">Jump To:</span>
      <a href="#wands" className="nav-link">Wands</a>
      <a href="#swords" className="nav-link">Swords</a>
      <a href="#coins" className="nav-link">Coins</a>
      <a href="#cups" className="nav-link">Cups</a>
    </div>

    <h3>Major Arcana</h3>
    <div className="row">
      { tarot.cards.filter((card) => {
        return card.suit == 'major';
      }).map(linker)}
    </div>
    <br/>

    <a name="wands"></a>
    <h3>Wands</h3>
    <div className="row">
      { tarot.cards.filter((card) => {
        return card.suit == 'wands';
      }).map(linker)}
    </div>
    <br/>

    <a name="swords"></a>
    <h3>Swords</h3>
    <div className="row">
      { tarot.cards.filter((card) => {
        return card.suit == 'swords';
      }).map(linker)}
    </div>
    <br/>

    <a name="coins"></a>
    <h3>Coins</h3>
    <div className="row">
      { tarot.cards.filter((card) => {
        return card.suit == 'coins';
      }).map(linker)}
    </div>
    <br/>

    <h3>Cups <a name="cups"></a></h3>
    <div className="row">
      { tarot.cards.filter((card) => {
        return card.suit == 'cups';
      }).map(linker)}
    </div>
    <br/>

  </div>
}

const Reading = ({ match }) => (
  <div>
    <h2>Reading</h2>
  </div>
)

const Layout = ({ match }) => (
  <div>
    <h2>Layout</h2>
  </div>
)

export default Main
