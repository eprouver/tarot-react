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

    window.scrollTo(0,0)

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
    this.setState({suit: nextProps.suit, rank: nextProps.rank, text: nextProps.text});
  }

  toggleImage() {
    this.setState({writing: !this.state.writing});
  }

  render() {
    var card = _(tarot.cards).findWhere({
      suit: this.state.suit,
      rank: parseInt(this.state.rank)
    });

    return <div className="container">
      <div className="row">
        <div className="col-sm animated slideInLeft text-center flex-center">
          <h1>{card.name}:</h1>
        </div>
        <div className="col-sm animated slideInRight">
          {
            card.keywords.map((word, i) => {
              return <h4 className="text-muted" style={{
                  display: 'inline-block'
                }} key={i}>{word}&nbsp;&nbsp;</h4>
            })
          }
        </div>
      </div>

      <div className="row">
        <div className="col-sm animated slideInLeft text-center">
          <div className="toggler" onDoubleClick={this.toggleImage.bind(this)}>
            <img id="reading-image" className={"mw-100 " + (this.props.reversed? 'reversed': '')  + (!this.state.writing ? ' active': '')} src={images[card.image]}/>
            <textarea id="reading-input" rows="10" className={"form-control " + (this.state.writing ? ' active': '')} value={this.state.text} onChange={this.props.handleChange || _.noop}></textarea>
          </div>
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
