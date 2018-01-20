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

const images = importAll(require.context('../images/tarot', false, /\.(png|jpe?g|svg)$/));
import tarot from '../sources/tarot.json';
import layouts from '../sources/layouts.json';
import pickles from '../sources/nouns.json';

class Reading extends React.Component {

  deal(cards) {
    let deck = tarot.cards.slice();
    let minX = 1200;
    let minY = 1200;
    let maxX = 0;
    let maxY = 0;

    cards.forEach((c) => {
      var rand = _.random(0, deck.length - 1);
      var picked = deck.splice(rand, 1);

      c.pickle = undefined;
      c.card = picked[0];
      c.reversed = (Math.random() > 0.5);

      if (c.x < minX) {
        minX = c.x;
      } else if (c.x + w > maxX) {
        maxX = c.x + w;
      }
      if (c.y < minY) {
        minY = c.y;
      } else if (c.y + h > maxY) {
        maxY = c.y + h;
      }

    })

    this.setState({
      cards: [],
      viewBox: [
        minX - margin,
        minY - margin,
        (maxX - minX) + margin,
        (maxY - minY) + margin + margin
      ].join(' ')
    });

    var currentCards = [];
    cards.forEach((card, i) => {
      setTimeout(() => {
        currentCards.push(card);
        this.setState({cards: currentCards});
      }, i * 500)

    })
  }

  cardClick(c) {
    this.setState({currentCard: c});
    document.getElementById('card-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  cardOver(c, e) {
    let prompt = document.getElementById('my-prompt');
    var bbox = e.target.getBoundingClientRect();
    prompt.style.left = bbox.x + 'px';
    prompt.style.top = bbox.y + 'px';
    prompt.style.display = "block";

    this.setState({
      selectedPrompt: unescape(c.prompt)
    });

    [].slice.call(document.getElementsByTagName('image'), 0).filter((i) => {
      return i.id != e.target.id
    }).forEach(i => i.setAttribute('filter', 'url(#linear)'));
  }

  cardOut(c, e) {
    let prompt = document.getElementById('my-prompt');
    prompt.style.display = "none";

    [].slice.call(document.getElementsByTagName('image'), 0).forEach(i => i.setAttribute('filter', ''));
  }

  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      currentCard: {
        card: {
          suit: 'wands',
          rank: 1
        }

      }
    }
  }

  componentWillUnmount() {
    document.body.style.overflow = 'auto';
  }

  addPickle(c) {
    c.pickle = _.sample(pickles.nouns);
    this.forceUpdate();
  }

  dynamicDeal() {
    try {
      let cards = JSON.parse(document.getElementById("dyn-input").value);

      this.deal(cards)
    } catch (e) {
      alert('There was a problem');
    }

  }

  render() {
    return <div>
      <h2>Reading</h2>
      <br/>
      <div className="row">
        <div className="col">
          <p>Select a saved layout:</p>
        </div>
        <div className="col text-center">
          or
        </div>
        <div className="col text-right">
          <p>Copy and paste output from the &ldquo;New Layout&rdquo; tab:</p>
        </div>
      </div>
      <div className="row">
        <div className="col">

          <div id="reading-list">
            {
              layouts.layouts.map((l, i) => {
                return <span key={i}>
                  <button type="button" className="btn btn-info" onClick={this.deal.bind(this, l.cards)}>{l.name}</button>&nbsp;&nbsp;</span>
              })
            }
          </div>
        </div>
        <div className="col">
          <textarea id="dyn-input" className="form-control"></textarea>
          <br/>
          <div className="btn btn-success float-right" onClick={this.dynamicDeal.bind(this)}>Read</div>
        </div>
      </div>
      <hr/>
      <div id="reading-holder" className="text-center">
        <svg viewBox={this.state.viewBox} className="mw-100 mh-100" style={{
            width: 800
          }}>
          <filter id="linear">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5"/>
          </filter>

          {
            this.state.cards.map((c, i) => {
              return <g className="c-holder" key={i} transform={'translate(' + c.x + ',' + c.y + ')'}>
                <g className="animated zoomIn">
                  <rect width="70" height="120" fill="#ccc" transform={'rotate(' + (
                      c.rotated
                      ? 90
                      : 0) + ') scale(1,' + (
                      c.reversed
                      ? -1
                      : 1) + ') translate(0, ' + (
                      c.reversed
                      ? -120
                      : 0) + ')'}></rect>
                  <image id={c.name} xlinkHref={images[c.card.image]} width="70" height="120" transform={'rotate(' + (
                      c.rotated
                      ? 90
                      : 0) + ') scale(1,' + (
                      c.reversed
                      ? -1
                      : 1) + ') translate(0, ' + (
                      c.reversed
                      ? -120
                      : 0) + ')'} onClick={this.cardClick.bind(this, c)} onMouseOver={(e) => this.cardOver(c, e)} onMouseOut={(e) => this.cardOut(c, e)}/>
                  <g className="pickle-btn-holder" transform={c.rotated
                      ? "translate(-110, 90)"
                      : "translate(10, 140)"} onClick={this.addPickle.bind(this, c)}>
                    <g style={{
                        "display" : c.pickle
                          ? 'none'
                          : 'block'
                      }}>
                      <rect className="pickle-text-back" x="-10" y="-20" width="45" height="20" rx="10" ry="10"/>

                      <text transform="translate(-1, -6)" className="pickle-text">Pickle</text>
                    </g>
                  </g>

                  <g className="final-pickle" style={{
                      "display" : c.pickle
                        ? 'block'
                        : 'none'
                    }} transform={c.rotated
                      ? "translate(-95, 0)"
                      : "translate(-5, 0)"}>
                    <rect className="final-pickle-text-back" x="-10" y="-20" width="100" height="20" rx="10" ry="10"></rect>
                    <text className="final-pickle-text">{c.pickle}</text>
                  </g>
                </g>
              </g>
            })
          }
        </svg>

        <div id="my-prompt" className="popover-holder animated pulse" style={{
            "display" : "none"
          }}>
          <h5>
            <div className="badge badge-danger">{this.state.selectedPrompt}</div>
          </h5>
        </div>
      </div>

      <div id="card-modal" className="animated zoomIn">
        <br/>
        <div className="container">
          <h1 className="text-center">{unescape(this.state.currentCard.prompt)}
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

export default Reading;
