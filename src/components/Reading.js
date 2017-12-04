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
    var deck = tarot.cards.slice();
    cards.forEach((c) => {
      var rand = _.random(0, deck.length);
      var picked = deck.splice(rand, 1);

      c.card = picked[0];
    })

    this.setState({cards: cards});

    cards.forEach((c) => {

      var i = new Image();
      i.onload = () => {
        var bitmap = new createjs.Bitmap(i);
        bitmap.x = c.x;
        bitmap.y = c.y;
        bitmap.scale = 0.2;
        bitmap.on('click', (evt) => {
          this.setState({currentCard: c.card});
          document.getElementById('card-modal').style.display = 'block';
        });

        if (c.rotated) {
          bitmap.rotation = 90;
        }

        this.stage.addChild(bitmap);
        this.stage.update();
      }

      i.src = images[c.card.image];

    })
  }

  componentDidMount() {
    this.stage = new createjs.Stage('myCanvas');
  }

  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      currentCard: {
        suit: 'wands',
        rank: 1
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
            return <button type="button" className="btn btn-info" key={i} onClick={this.deal.bind(this, l.cards)}>{l.name}</button>
          })
        }
      </div>
      <hr/>
      <div id="reading-holder">
        <canvas id="myCanvas" className="reading-canvas" width="1200" height="1200"></canvas>
      </div>
      <hr/>
      <div id="card-modal" className="modal">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
            <span className="close" onClick={()=>{document.getElementById('card-modal').style.display = 'none'}}>&times;</span>

            </div>
            <div className="modal-body">
              <Card suit={this.state.currentCard.suit} rank={this.state.currentCard.rank}></Card>
            </div>
          </div>
        </div>
      </div>

    </div>
  }
}

export default Reading;
