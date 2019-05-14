import React from 'react';
import Card from './Card.js';
import _ from 'underscore';

function importAll(r) {
  let images = {};
  r.keys().map((item) => {
    images[item.replace('./', '')] = r(item);
  });
  return images;
}

const images = importAll(require.context('../images/tarot', false, /\.(png|jpe?g|svg)$/));
import tarot from '../sources/tarot.json';

class Kcard extends React.Component {

  cardClick(c) {
    this.setState({currentCard: c});
    document.getElementById('card-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  pickCard() {
    if(this.state.deck.length == 0){
      if(window.confirm('Start Over?')){
        window.location.reload();
      }
      return;
    }
    let cards = this.state.cards
    let rand = _.random(0, this.state.deck.length - 1);
    let picked = {};
    picked.card = this.state.deck.splice(rand, 1)[0];
    picked.reversed = (Math.random() > 0.5);
    cards.push(picked);

    this.setState({cards: cards});
  }

  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      deck: tarot.cards.slice(),
      currentCard: {
        card: {
          suit: 'wands',
          rank: 1
        }
      }
    }
  }

  render() {
    const linker = (pos, i) => {
      return <div className="col-12 col-sm-4 col-lg-3 col-xl-2 text-center" key={i}>

        <div className="card bg-dark text-white mt-3 animated flipInY">
          <div onClick={this.cardClick.bind(this, pos)}>

            <img style={{
                opacity: 0.35
              }} className={'card-img w-75 ' + (
                pos.reversed
                ? 'reversed'
                : '')} src={images[pos.card.image]}/><br/>
            <div className="card-img-overlay">
              <h1>
                {
                  pos.reversed
                    ? 'No'
                    : 'Yes'
                }
              </h1>
              <p style={{'text-transform': 'capitalize'}}>{pos.card.name}
                {
                  pos.reversed
                    ? ' (Reversed)'
                    : ''
                }</p>
              <h6>{
                  pos.card.keywords.map((word, i) => {
                    return <span className="badge" key={i}>
                      {word}&nbsp;
                    </span>
                  })
                }</h6>

            </div>
          </div>
        </div>
      </div>
    }
    return <div>

      <div className="row">
        {this.state.cards.map(linker)}
        <div className="col-12 col-sm-4 col-lg-3 col-xl-2 text-center">
          <div style={{cursor: 'pointer'}} className="alert alert-success btn-block text-center mt-3" onClick={this.pickCard.bind(this)}>
            <span className="question">?</span>
            <p>Ask a Yes or No Question</p>
            <p>Cards Left: {this.state.deck.length}</p>
          </div>
        </div>
      </div>

      <div id="card-modal" className="animated zoomIn">
        <br/>
        <div className="container">
          <span className="close float-right" onClick={() => {
              document.getElementById('card-modal').style.display = 'none';
              document.body.style.overflow = 'auto';
            }}>&times;</span>

        </div>
        <br/>
        <Card suit={this.state.currentCard.card.suit} rank={this.state.currentCard.card.rank} reversed={this.state.currentCard.reversed}></Card>
        <br/><br/>
      </div>
    </div>

  }

}

export default Kcard;
