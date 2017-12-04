import React from 'react';
import { Link } from 'react-router-dom';


function importAll(r) {
  let images = {};
  r.keys().map((item) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('../images/tarot', false, /\.(png|jpe?g|svg)$/));
import tarot from '../sources/tarot.json';

const scrollTop = (e) => {
  window.scrollTo(0,0);
  e.preventDefault();
}

const Home = () => {
  const linker = (card, i) => {
    return <div className="col-6 col-sm-4 col-xl-2" key={i}>
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
    <h3>Wands <button type="button" onClick={scrollTop} className="btn btn-light float-right">Back to Top</button></h3>
    <div className="row">
      { tarot.cards.filter((card) => {
        return card.suit == 'wands';
      }).map(linker)}
    </div>
    <br/>

    <a name="swords"></a>
    <h3>Swords <button type="button" onClick={scrollTop} className="btn btn-light float-right">Back to Top</button></h3>
    <div className="row">
      { tarot.cards.filter((card) => {
        return card.suit == 'swords';
      }).map(linker)}
    </div>
    <br/>

    <a name="coins"></a>
    <h3>Coins <button type="button" onClick={scrollTop} className="btn btn-light float-right">Back to Top</button></h3>
    <div className="row">
      { tarot.cards.filter((card) => {
        return card.suit == 'coins';
      }).map(linker)}
    </div>
    <br/>

    <a name="cups"></a>
    <h3>Cups <button type="button" onClick={scrollTop} className="btn btn-light float-right">Back to Top</button></h3>
    <div className="row">
      { tarot.cards.filter((card) => {
        return card.suit == 'cups';
      }).map(linker)}
    </div>
    <br/>

  </div>
}

export default Home
