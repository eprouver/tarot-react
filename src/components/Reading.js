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
    var prompt = document.getElementById('my-prompt');

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
          this.setState({currentCard: c});
          document.getElementById('card-modal').style.display = 'block';
        });

        bitmap.on('mouseover', (e) => {
          prompt.style.left = ((c.x + w/2)/ 1200) * 100 + '%';
          prompt.style.top = ((c.y + h/2) / 1200) * 100 + '%';
          prompt.style.display = "block";

          this.setState({
            selectedPrompt: unescape(c.prompt)
          });

        });

        bitmap.on('mouseout', (e) => {
          prompt.style.display = "none";
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
    this.stage.enableMouseOver(40);
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
            return <button type="button" className="btn btn-info" key={i} onClick={this.deal.bind(this, l.cards)}>{l.name}</button>
          })
        }
      </div>
      <hr/>
      <div id="reading-holder">
        <canvas id="myCanvas" className="reading-canvas" width="1200" height="1200"></canvas>
        <div id="my-prompt" className="popover-holder animated pulse" style={{"display":"none"}}>

          <div className="badge badge-info">
            {this.state.selectedPrompt}
          </div>
        </div>
      </div>
      <hr/>

      <div id="card-modal" className="modal">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{unescape(this.state.currentCard.prompt)}</h2>
              <span className="close float-right" onClick={() => {
                  document.getElementById('card-modal').style.display = 'none'
                }}>&times;</span>

            </div>
            <div className="modal-body">
              <Card suit={this.state.currentCard.card.suit} rank={this.state.currentCard.card.rank}></Card>
            </div>
          </div>
        </div>
      </div>

    </div>
  }
}

export default Reading;
