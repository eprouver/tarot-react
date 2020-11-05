import React from 'react';
import Card from './Card.js';
import { patterns, affectLevels, humors, arcs } from './meaningBlocks';
import _ from 'underscore';

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

const images = importAll(require.context('../images/tarot', false, /\.(png|jpe?g|svg)$/));
const arcImages = importAll(require.context('../images/arcs', false, /\.(png|jpe?g|svg)$/));

import tarot from '../sources/tarot.json';
import pickles from '../sources/nouns.json';

class Story extends React.Component {

  addPickle() {
    return _.sample(pickles.nouns);
  }

  deal(setState) {
    let deck = tarot.cards.slice();

    let makeCard = (() => {
      const rand = _.random(0, deck.length - 1);
      const reversed = (Math.random() > 0.5);
      const card = deck.splice(rand, 1)[0];
      return {
        card,
        pickle: this.addPickle(),
        reversed,
        mean: this.getMeaning(card.meanings, !reversed),
      };
    });

    let state = {
      moral: new Array(2).fill().map(makeCard),
      plot: new Array(3).fill().map(makeCard),
      humor: humors[~~ (Math.random() * humors.length)],
      arc: arcs[~~ (Math.random() * arcs.length)],
      affectLevel: ~~ (Math.random() * 3)
    };

    state.plot.forEach((c, i) => {
      c.reversed = state.arc.orientations[i];
    })

    if (setState) {
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

  getMeaning(meaning, reversed) {
    const side = reversed ? 'light' : 'shadow';
    return meaning[side][~~(Math.random() * meaning[side].length)];
  }

  linker(pos, i) {
    if (!pos) {
      return '';
    }

    return <div className="card bg-dark text-white" key={i}>
      <div onClick={this.cardClick.bind(this, pos)}>
        <img style={{
            opacity: 0.35,
          }} className={'card-img p-1 ' + (
            pos.reversed
            ? 'reversed'
            : '')} src={images[pos.card.image]}/><br/>
        <div className="card-img-overlay pt-3">
          <p style={{
              'textTransform' : 'capitalize'
            }}><u>{pos.card.name}
            {
              pos.reversed
                ? ' (Reversed)'
                : ''
            }</u></p>

            <h5><strong>{
              pos.mean
            }</strong></h5>

            <br/>
          <p>{
            pos.card.keywords.map((word, i, arr) => {
              return <span key={i}>
                {word}{i < arr.length - 1 ? ',': ''}&nbsp;
              </span>
            })
          }</p>

        </div>
      </div>
    </div>
  }

  render() {


    return <div>
      <h2>Story
        <div className="btn btn-success float-right" onClick={this.deal.bind(this, true)}>New Story</div>
      </h2>
      <hr/>
      <div className="container-fluid text-center">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-4">
          <div id="arc" className="">
            <h5 className="text-muted">Plot Arc:</h5>
            <div className="row">
              <div className="col-4">
                <img className="mw-100" style={{
                    transition: 'all 0.5s ease'
                  }} src={arcImages[this.state.arc.name + '.png']}/>
              </div>
              <div className="col">
                <h4>{this.state.arc.name}</h4>
              </div>
            </div>

          </div>

          <hr/>

            <h5 className="text-muted">Story Effect:</h5>
            <div className="row">
              <div className="col-4">
                <div className="c-level">
                  <div className={'c-circle ' + (
                      this.state.affectLevel === 2
                      ? 'active'
                      : '')}>
                    <div className={'c-circle ' + (
                        this.state.affectLevel === 1
                        ? 'active'
                        : '')}>
                      <div className={'c-circle ' + (
                          this.state.affectLevel === 0
                          ? 'active'
                          : '')}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col">
                <h4>{this.state.arc.orientations[2] ? 'Breaks': 'Restores'} {affectLevels[this.state.affectLevel].name}</h4>
                <h5>{affectLevels[this.state.affectLevel].descrip}</h5>
              </div>
            </div>

            <hr/>



            <div id="humor" className="">
              <h5 className="text-muted">Surprise Humor Pattern:</h5>
              <h4>{this.state.humor.name}</h4>
              <h5>{this.state.humor.descrip}</h5>
              <p className="text-muted">{this.state.humor.type}: {patterns[this.state.humor.type]}</p>
            </div>
            <hr/>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-8">
            <h4>Moral:</h4>
            <div id="moral" className="row justify-content-center">
              <div className="col col-sm-4">{this.linker(this.state.moral[0])}</div>
              <div className="col-xs-1">
                <br/>
                <br/>
                <h1>=</h1>
              </div>
              <div className="col col-sm-4">{this.linker(this.state.moral[1])}</div>
            </div>
            <br/>
            <h4>Plot:</h4>
            <div id="plot" className="row">
              <div className="col-xs-12 col-sm-4">
                {this.linker(this.state.plot[0])}
                <div className="alert alert-success capitalize">{this.state.plot[0].pickle}</div>
              </div>
              <div className="col-xs-12 col-sm-4">
                {this.linker(this.state.plot[1])}
                <div className="alert alert-success capitalize">{this.state.plot[1].pickle}</div>
              </div>
              <div className="col-xs-12 col-sm-4">
                {this.linker(this.state.plot[2])}
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
