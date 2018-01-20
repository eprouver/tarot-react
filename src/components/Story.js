import React from 'react';
import Card from './Card.js';
import _ from 'underscore';

var w = 70,
  h = 120,
  margin = 40;

function importAll(r) {
  let images = {};
  r.keys().map((item) => {
    images[item.replace('./', '')] = r(item);
  });

  Object.keys(images).forEach((src) => {
    let img = new Image();
    img.src = images[src];
  })

  return images;
}

const humors = [
  {
    name: 'Positive Repetition',
    type: 'Fidelity'
  }, {
    name: 'Division',
    type: 'Fidelity'
  }, {
    name: 'Completion',
    type: 'Fidelity'
  }, {
    name: 'Translation',
    type: 'Fidelity'
  }, {
    name: 'Opposition',
    type: 'Magnitude'
  }, {
    name: 'Application',
    type: 'Magnitude'
  }, {
    name: 'Qualifiation',
    type: 'Magnitude'
  }, {
    name: 'Scale',
    type: 'Magnitude'
  }
];
const arcs = [
  {
    name: 'Rise',
    orientations: [false, false, false]
  }, {
    name: 'Fall',
    orientations: [true, true, true]
  }, {
    name: 'Rebound',
    orientations: [true, true, false]
  }, {
    name: 'Icarus',
    orientations: [false, false, true]
  }, {
    name: 'Cinderella',
    orientations: [false, true, false]
  }, {
    name: 'Oedipus',
    orientations: [true, false, true]
  }
];

const images = importAll(require.context('../images/tarot', false, /\.(png|jpe?g|svg)$/));
const arcImages = importAll(require.context('../images/arcs', false, /\.(png|jpe?g|svg)$/));

import tarot from '../sources/tarot.json';
import layouts from '../sources/layouts.json';
import pickles from '../sources/nouns.json';

class Story extends React.Component {

  addPickle() {
    return _.sample(pickles.nouns);
  }

  deal(setState) {
    let deck = tarot.cards.slice();

    let makeCard = (() => {
      let rand = _.random(0, deck.length - 1);
      return {
        card: deck.splice(rand, 1)[0],
        pickle: this.addPickle(),
        reversed: (Math.random() > 0.5)
      };
    });

    let state = {moral: new Array(2).fill().map(makeCard),
      plot: new Array(3).fill().map(makeCard),
      humor: humors[~~(Math.random() * humors.length)],
      arc: arcs[~~(Math.random() * arcs.length)],
    };

    state.plot.forEach((c, i) => {
      c.reversed = state.arc.orientations[i];
    })

    if(setState){
      this.setState(state);
    }

    return state;
  }

  cardClick(c) {
    this.setState({currentCard: c});
    document.getElementById('card-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  constructor(props) {
    super(props);

    this.state = this.deal(false);
    this.state.currentCard = {
      card: {
        suit: 'wands',
        rank: 1
      }
    };
  }

  componentWillUnmount() {
    document.body.style.overflow = 'auto';
  }

  render() {
    const linker = (pos, i) => {
      if(!pos){
        return '';
      }

      return <div className="card bg-dark text-white" key={i}>
        <div onClick={this.cardClick.bind(this, pos)}>
          <br/>
          <img style={{
              opacity: 0.35
            }} className={"card-img w-75 " + (
              pos.reversed
              ? 'reversed'
              : '')} src={images[pos.card.image]}/><br/>
          <div className="card-img-overlay">
            <p style={{
                'text-transform' : 'capitalize'
              }}>{pos.card.name}
              {
                pos.reversed
                  ? ' (Reversed)'
                  : ''
              }</p>
            {
              pos.card.keywords.map((word, i) => {
                return <div key={i}>
                  {word}&nbsp;
                </div>
              })
            }

          </div>
          <br/>
        </div>
      </div>
    }

    return <div>
      <h2>Story</h2>
      <br/>

      <div className="btn btn-success" onClick={this.deal.bind(this, true)}>New Story</div>
      <br/>
      <hr/>
      <div className="container-fluid text-center">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-4">
            <div id="humor" className="">
              <h5 className="text-muted">Surprise Humor Pattern:</h5>
              <h4>{this.state.humor.name}</h4>
              <p>Type: {this.state.humor.type}</p>
            </div>
            <hr/>
            <div id="arc" className="">
              <h5 className="text-muted">Plot Arc:</h5>
              <h4>{this.state.arc.name}</h4>
              <img className="mw-100" style={{transition: 'all 0.5s ease'}} src={arcImages[this.state.arc.name + '.png']}/>
            </div>
            <hr/>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-8">
            <h4>Moral:</h4>
            <div id="moral" className="row justify-content-center">
              <div className="col col-sm-4">{linker(this.state.moral[0])}</div>
              <div className="col-xs-1">
                <br/>
                <br/>
                <h1>=</h1>
              </div>
              <div className="col col-sm-4">{linker(this.state.moral[1])}</div>
            </div>
            <br/>
            <h4>Plot:</h4>
            <div id="plot" className="row">
              <div className="col-xs-12 col-sm-4">
                {linker(this.state.plot[0])}
                <div className="alert alert-success capitalize">{this.state.plot[0].pickle}</div>
              </div>
              <div className="col-xs-12 col-sm-4">
                {linker(this.state.plot[1])}
                <div className="alert alert-success capitalize">{this.state.plot[1].pickle}</div>
              </div>
              <div className="col-xs-12 col-sm-4">
                {linker(this.state.plot[2])}
                <div className="alert alert-success capitalize">{this.state.plot[2].pickle}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="card-modal" className="animated zoomIn">
        <br/>
        <div className="container">
          <h1 className="text-center">
            <span className="close float-right" onClick={() => {
                document.getElementById('card-modal').style.display = 'none';
                document.body.style.overflow = 'auto';
              }}>&times;</span>
          </h1>
        </div>
        <br/>
        <Card suit={this.state.currentCard.card.suit} rank={this.state.currentCard.card.rank} reversed={this.state.currentCard.reversed}></Card>
        <br/><br/>
      </div>
    </div>
  }
}

export default Story;
