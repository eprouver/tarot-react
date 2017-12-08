import React from 'react';
import Card from './Card.js';
import _ from 'underscore';

var w = 70,
  h = 120;

function importAll(r) {
  let images = {};
  r.keys().map((item) => {
    images[item.replace('./', '')] = r(item);
  });
  return images;
}

const images = importAll(require.context('../images/tarot', false, /\.(png|jpe?g|svg)$/));
import tarot from '../sources/tarot.json';
import layouts from '../sources/layouts.json';

class Reading extends React.Component {

  deal(cards) {
    let deck = tarot.cards.slice();
    let minX = 1200;
    let minY = 1200;
    let maxX = 0;
    let maxY = 0;

    cards.forEach((c) => {
      var rand = _.random(0, deck.length);
      var picked = deck.splice(rand, 1);

      c.card = picked[0];
      c.reversed = (Math.random() > 0.5);

      if (c.x < minX) {
        minX = c.x;
      }
      if (c.y < minY) {
        minY = c.y;
      }
      if (c.x > maxX) {
        maxX = c.x;
      }
      if (c.y > maxY) {
        maxY = c.y;
      }
    })

    this.setState({
      cards: cards,
      viewBox: [minX, minY, maxX, maxY].join(' ')
    });

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

  render() {
    return <div>
      <h2>Reading</h2>
      <br/>
      <div>
        {
          layouts.layouts.map((l, i) => {
            return <span>
              <button type="button" className="btn btn-info" key={i} onClick={this.deal.bind(this, l.cards)}>{l.name}</button>&nbsp;&nbsp;</span>
          })
        }
      </div>

      <hr/>

      <div id="reading-holder">
        <svg viewBox={this.state.viewBox} className="mw-100" height="1200" width="1200">
          <filter id="linear">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
            <feColorMatrix type="matrix" values="0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 1 0 "/>
          </filter>

          {
            this.state.cards.map((c, i) => {
              return <g key={i} transform={'translate(' + c.x + ',' + c.y + ')'}>
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
              </g>
            })
          }
        </svg>

        <div id="my-prompt" className="popover-holder animated pulse" style={{
            "display" : "none"
          }}>
          <h5>
            <div className="badge badge-info">{this.state.selectedPrompt}</div>
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
