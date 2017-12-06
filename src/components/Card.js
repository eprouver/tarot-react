import React from 'react';
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

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      suit: this.props.match
        ? this.props.match.params.suit
        : this.props.suit,
      rank: parseInt(
        this.props.match
        ? this.props.match.params.rank
        : this.props.rank)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({suit: nextProps.suit, rank: nextProps.rank});
  }

  render() {
    var card = _(tarot.cards).findWhere({
      suit: this.state.suit,
      rank: parseInt(this.state.rank)
    });

    return <div className="container">
      <div className="row">
        <h1 className="col-sm animated slideInLeft text-center">{card.name}:</h1>
        <div className="col-sm animated slideInRight">
          {
            card.keywords.map((word, i) => {
              return <h2 className="text-muted" style={{
                  display: 'inline-block'
                }} key={i}>{word}&nbsp;&nbsp;</h2>
            })
          }
        </div>
      </div>

      <div className="row">
        <div className="col-sm animated slideInLeft text-center">
          <img className="mw-100" src={images[card.image]} style={{transform: 'scale(' + (this.props.reversed? -1: 1) +')'}}/>
        </div>
        <div className="col-sm animated slideInRight">
          <br/>
          <h3>Indications</h3>
          {
            card.fortune_telling.map((word, i) => {
              return <li key={i}>{word}</li>
            })
          }

          <br/>
          <h3>Proper Meanings</h3>
          {
            card.meanings.light.map((word, i) => {
              return <li key={i}>{word}</li>
            })
          }

          <br/>
          <h3>Reversed Meanings</h3>
          {
            card.meanings.shadow.map((word, i) => {
              return <li key={i}>{word}</li>
            })
          }
        </div>
      </div>

    </div>
  }
}

export default Card;
