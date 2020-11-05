import React from 'react';
import Card from './Card';
import Story from './Story';
import {
  patterns,
  affectLevels,
  humors,
  arcs,
  importAll,
  conflicts,
  endings
} from './meaningBlocks';
import _ from 'underscore';

const images = importAll(require.context('../images/tarot', false, /\.(png|jpe?g|svg)$/));
const arcImages = importAll(require.context('../images/arcs', false, /\.(png|jpe?g|svg)$/));

import tarot from '../sources/tarot.json';
import places from '../sources/places.json';
import names from '../sources/names.json';

let deck = tarot.cards.slice();

export default class Circle extends Story {
  makeCard () {
    const rand = _.random(0, deck.length - 1);
    const reversed = (Math.random() > 0.5);
    const card = deck.splice(rand, 1)[0];
    return {
      card,
      reversed,
      mean: this.getMeaning(card.meanings, !reversed),
    };
  }

  makeName() {
    return `${names.firstNames[~~ (Math.random() * names.firstNames.length)]} ${names.lastNames[~~ (Math.random() * names.lastNames.length)]}`;
  }

  makeCharacter() {
    const morality = this.makeCard();
    const control = this.makeCard();

    morality.card.meanings.light = _.shuffle(morality.card.meanings.light);
    morality.card.meanings.shadow = _.shuffle(morality.card.meanings.shadow);
    control.card.meanings.light = _.shuffle(control.card.meanings.light);
    control.card.meanings.shadow = _.shuffle(control.card.meanings.shadow);

    return {
      key: _.uniq(),
      info: {
        name: {},
        picture: {},
        dob: {}
      },
      morality,
      control
    };
  };

  addCharacter() {
    const char = this.makeCharacter();
    const that = this;
    function reqListener() {
      if (this.responseText) {
        const user = JSON.parse(this.responseText).results[0];
        console.log(user);
        char.info = user;
      }
      that.setState(that.state);
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", 'https://randomuser.me/api/');
    oReq.send();

    this.state.characters.push(char);
    this.setState(this.state);
  }

  removeCharacter(char) {
    this.state.characters = _.without(this.state.characters, char);
    this.setState(this.state);
  }

  deal(setState) {
    window.scrollTo({top: 0, behavior: 'smooth'});

    const list = document.querySelectorAll('.card, .enter');
    const transitions = ['fadeInLeft', 'fadeInRight', 'fadeInDown', 'fadeInUp'];

    if (list) {
      for (let i = 0; i < list.length; i++) {
        list[i].classList.add('animated');
        list[i].classList.add(transitions[~~ (Math.random() * 4)]);
      }

      setTimeout(() => {
        for (let i = 0; i < list.length; i++) {
          list[i].classList.remove('animated');
          transitions.forEach(t => list[i].classList.remove(t));
        }
      }, 1000);
    }

    let state = {
      moral: new Array(2).fill().map(this.makeCard.bind(this)),
      arc: arcs[~~ (Math.random() * arcs.length)],
      plot: new Array(8).fill().map(this.makeCard.bind(this)),
      humor: humors[~~ (Math.random() * humors.length)],
      affectLevel: ~~ (Math.random() * 3),
      conflict: conflicts[~~ (Math.random() * conflicts.length)],
      ending: endings[~~ (Math.random() * endings.length)],
      settings: [
        places.places[~~ (Math.random() * places.places.length)],
        places.places[~~ (Math.random() * places.places.length)]
      ],
      characters: [],
      thesis: ['','is the same as', ''],
    };

    state.plot.forEach((c, i) => {
      c.reversed = state.arc.orientations[i];
    })

    if (setState) {
      this.setState(state);
    }

    return state;
  }

  writeText(text) {
    this.state.currentCard.text = text.currentTarget.value
    this.setState({currentCard: this.state.currentCard});
  }

  meaningsLinker(pos, i) {
    if (!pos) {
      return '';
    }

    if (!pos.myMeanings) {
      pos.myMeanings = pos.reversed
        ? pos.card.meanings.shadow
        : pos.card.meanings.light;
    }

    const updateMeanings = (word) => {
      this.state.thesis[i] = word;
      pos.myMeanings = [word];
      this.setState(this.state);
    };

    return <div className="card bg-dark text-white p-1" style={{
        maxWidth: '35em',
        display: 'inline-block'
      }} key={i}>
      <div>
        <img style={{
            opacity: 0.35
          }} className={'card-img ' + (
            pos.reversed
            ? 'reversed'
            : '')} src={images[pos.card.image]}/><br/>
        <div className="card-img-overlay">
          <h3 onClick={this.cardClick.bind(this, pos)} style={{
              'textTransform' : 'capitalize'
            }}>{pos.card.name}
            {
              pos.reversed
                ? ' (Reversed)'
                : ''
            }</h3>
          <hr/> {
            pos.myMeanings.map((word) => {
              return <p onClick={updateMeanings.bind(this, word)}>{word}</p>
            })
          }

          <br/>
        </div>
      </div>
    </div>
  }

  render() {
    const contentClass = 'd-flex flex-column h-100 enter';

    const effect = () => {
      return <div className={contentClass}>
        <h5 className="text-muted">Conflict Effect:</h5>
        <h4>
          <strong>{
              this.state.arc.orientations[2]
                ? 'Breaks'
                : 'Restores'
            }&nbsp;
            {affectLevels[this.state.affectLevel].name}</strong>
        </h4>
        <p>{affectLevels[this.state.affectLevel].descrip}</p>

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
        <br/>
      </div>;
    }

    const moral = () => {
      return <div className={contentClass}>
        <h5 className="text-muted">Explores How:</h5>
        <div className="row alert">
          <div className="col">
            {this.meaningsLinker(this.state.moral[0], 0)}
          </div>
          <div>
            <br/>
            Is sometimes the same as:
          </div>
          <div className="col">
            {this.meaningsLinker(this.state.moral[1], 2)}
          </div>
        </div>
      </div>;
    };

    const humor = () => {
      return <div id="humor" className={contentClass}>
        <h5 className="text-muted">Info Pattern:</h5>
        <h4>
          <strong>{this.state.humor.name}</strong>
        </h4>
        <p>{this.state.humor.descrip}</p>
        <div className="card pt-2">
          <h6>&#x26A0; {this.state.humor.type}</h6>
          <p className="m-1">{patterns[this.state.humor.type]}</p>
        </div>
      </div>
    }

    const conflict = () => {
      return <div className={contentClass}>
        <h5 className="text-muted">Central Conflict:</h5>
        <h4>
          <strong>{this.state.conflict.title}</strong>
        </h4>
        <div className="card pt-2">
          <h6>⚔️</h6>
          <p className="m-1">{this.state.conflict.explain}</p>
        </div>
      </div>
    }

    const ending = () => {
      return <div className={contentClass}>
        <h5 className="text-muted">Ending:</h5>
        <h4>
          <strong>{this.state.ending.name}</strong>
        </h4>
        <p className="m-1">{this.state.ending.explain}</p>
      </div>
    }

    const plot = () => {
      return <div className="row">
        <div className="col">
          <h2>You</h2>
          {this.linker(this.state.plot[0])}
          <p>A character is in a zone of comfort</p>
        </div>
        <div className="col">
          <h2>Need</h2>
          {this.linker(this.state.plot[1])}
          <p>But they want something.</p>
        </div>
        <div className="col">
          <h2>Go</h2>
          {this.linker(this.state.plot[2])}
          <p>They enter an unfamiliar situation.</p>
        </div>
        <div className="col">
          <h2>Search</h2>
          {this.linker(this.state.plot[3])}
          <p>Adapt to it,</p>
        </div>
        <div className="col">
          <h2>Find</h2>
          {this.linker(this.state.plot[4])}
          <p>Get what they wanted,</p>
        </div>
        <div className="col">
          <h2>Take</h2>
          {this.linker(this.state.plot[5])}
          <p>Pay a heavy price for it,</p>
        </div>
        <div className="col">
          <h2>Return</h2>
          {this.linker(this.state.plot[6])}
          <p>Then return to their familiar situation,</p>
        </div>
        <div className="col">
          <h2>Change</h2>
          {this.linker(this.state.plot[7])}
          <p>Having changed.</p>
        </div>
      </div>;
    }

    const arc = () => {
      return <div className={contentClass}>
        <h5 className="text-muted">Plot Arc:</h5>
        <img className="mw-100 enter" style={{
            transition: 'all 0.5s ease'
          }} src={arcImages[this.state.arc.name + '.png']}/>
        <br/>
        <div className="enter">
          <h2 className={this.state.arc.orientations[2]
              ? 'text-danger'
              : 'text-success'}>{this.state.arc.name}</h2>
        </div>
      </div>
    }

    const setting = (index) => {
      const updateSetting = () => {
        this.state.settings[index] = places.places[~~ (Math.random() * places.places.length)];
        this.setState(this.state);
      };

      return <div className={contentClass}>
        <h5 className="text-muted">Setting:</h5>
        <img className="img img-fluid mw-100" style={{
            height: 'auto',
          }} src={`https://source.unsplash.com/${index === 0
            ? 400
            : 800}x400/weekly?${escape(this.state.settings[index])}`} onClick={updateSetting.bind(this)}/>
        <h5>{this.state.settings[index]}</h5>
      </div>
    }

    const specialLinker = (card, reversed, index) => {
      const copy = _.clone(card);
      copy.reversed = reversed;

      const meanings = copy.card.meanings[
        reversed
          ? 'shadow'
          : 'light'
      ];

      return <div>{meanings[index]}</div>
    }

    const characterArcsOnly = (character) => {
      return <div className="row">
        <div className="col">
          <p className="text-info">
            {specialLinker(character.morality, false, 0)}
          </p>
          <p className="text-primary">
            {specialLinker(character.control, true, 0)}
          </p>
        </div>
        <div className="col">
          <p className="text-info">
            {specialLinker(character.morality, true, 1)}
          </p>
          <p className="text-primary">
            {specialLinker(character.control, true, 1)}
          </p>
        </div>
        <div className="col">
          <p className="text-info">
            {specialLinker(character.morality, true, 2)}
          </p>
          <p className="text-primary">
            {specialLinker(character.control, false, 2)}
          </p>
        </div>
        <div className="col">
          <p className="text-info">
            {specialLinker(character.morality, false, 3)}
          </p>
          <p className="text-primary">
            {specialLinker(character.control, false, 3)}
          </p>
        </div>
      </div>;
    }

    const characters = () => {
      return <div>
        {
          this.state.characters.map((character) => <div className="p-2 m-2">
            <div className="row">

              <div>
                <img className="mw-100 rounded-circle" src={character.info.picture.large}/>
              </div>

              <div className="col-7 text-left">
                <h3>{character.info.name.title}.&nbsp;{character.info.name.first}&nbsp;{character.info.name.last}:</h3>
                <div>
                  <span className="text text-info" onClick={this.cardClick.bind(this, character.morality)}>
                  {character.morality.card.fortune_telling.join(', ')}</span></div>
                <div>
                  <span className="text text-primary" onClick={this.cardClick.bind(this, character.control)}>
                  {character.control.card.fortune_telling.join(', ')}</span></div>
              </div>

              <div className="col text-center">
                <div className="row">
                  <div className="col-6">
                    <img style={{height: '128px'}} onClick={this.cardClick.bind(this, character.morality)} className={'mw-50 ' + (character.morality.reversed ? 'reversed' : '')} src={images[character.morality.card.image]}/>
                  </div>
                  <div className="col-6">
                    <img style={{height: '128px'}} onClick={this.cardClick.bind(this, character.control)} className={'mw-50 ' + (character.control.reversed ? 'reversed' : '')} src={images[character.control.card.image]}/>
                  </div>
                </div>
              </div>

              <div className="col">
                <button onClick={this.removeCharacter.bind(this, character)} className="float-right btn btn-sm btn-danger">Remove</button>
              </div>
            </div>
          </div>)
        }
      </div>
    }

    const notes = () => {
      const inputer = (card) => {
        return <div>
          <textarea className="form-control" value={card.text} onChange={(e) => {
              card.text = e.target.value;
              this.setState(card);
            }}></textarea><br/></div>
      }

      return <div>
        <div className="sidebar-header">
          <h3>Notes</h3>
        </div>

        <h4>{ this.state.thesis.join(' ') }</h4>
        <br/>
        { this.state.characters.map((character) => <div className="row">
            <div className="col text-left d-flex">
          <h6 className="pt-2">{character.info.name.title}.&nbsp;{character.info.name.first}&nbsp;{character.info.name.last}:</h6>
            <div className="flex-fill p-2">{ inputer(character.morality) }</div>
            <div className="flex-fill p-2">{ inputer(character.control) }</div>
            </div>
            </div>)
        }

        <ul className="list-unstyled components">
          <li>
            <p>A character is in a zone of comfort</p>
            {inputer(this.state.plot[0])}
          </li>
          <li>
            <p>But they want something.</p>
            {inputer(this.state.plot[1])}
          </li>
          <li>
            <p>They enter an unfamiliar situation.</p>
            {inputer(this.state.plot[2])}
          </li>
          <li>
            <p>Adapt to it,</p>
            {inputer(this.state.plot[3])}
          </li>
          <li>
            <p>Get what they wanted,</p>
            {inputer(this.state.plot[4])}
          </li>
          <li>
            <p>Pay a heavy price for it,</p>
            {inputer(this.state.plot[5])}
          </li>
          <li>
            <p>Then return to their familiar situation,</p>
            {inputer(this.state.plot[6])}
          </li>
          <li>
            <p>Having changed.</p>
            {inputer(this.state.plot[7])}
          </li>
        </ul>
      </div>
    }

    return <div id="wrapper">
      <nav id="sidebar" className={this.state.sidebar
          ? 'active'
          : ''}>

        <div id="dismiss" className="float-right" onClick={() => {
            this.setState({sidebar: false});
          }}>
          <i className="fas fa-arrow-left"></i>
        </div>
        {notes()}

      </nav>

      <div id="content">
        <h2>
          <span onClick={() => {
              this.setState({sidebar: true});
            }}>Story</span>
          <div className="btn btn-success float-right" onClick={this.deal.bind(this, true)}>New Story</div>
        </h2>
        <div className="text-center">
          <div className="row">
            <div className="col">
              {moral()}
            </div>
            <div className="col-3">
              {humor()}
            </div>
          </div>
          <br/><br/>
          <div>
            <div className="row">
              <div className="col">
                {conflict()}
              </div>
              <div className="col">
                {effect()}
              </div>
              <div className="col">
                {ending()}
              </div>
            </div>
            <br/><br/>

          <div>
            <div className="float-right">
              <button className="btn btn-success" onClick={this.addCharacter.bind(this, true)}>+ Add Character</button>
            </div>
            <h2>Characters</h2>

            {characters()}
            </div>
          </div>

          <br/>
          <br/>

          <div className="row text-center">
            <div className="col card">
              {setting(0)}
            </div>
            <div className="col-6 card">
              {setting(1)}
            </div>
            <div className="col card">
              {setting(0)}
            </div>
          </div>
          <br/>

          <div  className="p-2" style={{
            width: '100%',
            overflowX: 'scroll',
            boxShadow: 'inset 0 0 20px #ccc'
          }}>
          <div style={{
            width: '1800px',
          }}>
          {plot()}

          {
            this.state.characters.map((character) => <div className="text-left">
              <strong>{character.info.name.title}.&nbsp;{character.info.name.first}&nbsp;{character.info.name.last}:</strong>
              { characterArcsOnly(character) }
            </div>)
          }
          </div>
          </div>

        </div>

        <hr/> {notes()}
        <h2>The End
          <div className="btn btn-success float-right" onClick={this.deal.bind(this, true)}>New Story</div>
        </h2>

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
          <Card suit={this.state.currentCard.card.suit} rank={this.state.currentCard.card.rank} reversed={this.state.currentCard.reversed} text={this.state.currentCard.text || ""} handleChange={this.writeText.bind(this)}></Card>
          <br/><br/>
        </div>
      </div>
    </div>;
  }
}
