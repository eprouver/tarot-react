import React from 'react';
import Card from './Card';
import Story from './Story';
import { patterns, affectLevels, humors, arcs, importAll, conflicts } from './meaningBlocks';
import _ from 'underscore';


const images = importAll(require.context('../images/tarot', false, /\.(png|jpe?g|svg)$/));
const arcImages = importAll(require.context('../images/arcs', false, /\.(png|jpe?g|svg)$/));

import tarot from '../sources/tarot.json';
import places from '../sources/places.json';
import names from '../sources/names.json';

export default class Story2 extends Story {

  makeName() {
    return `${names.firstNames[~~ (Math.random() * names.firstNames.length)]} ${names.lastNames[~~ (Math.random() * names.lastNames.length)]}`;
  }

  deal(setState) {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const list = document.querySelectorAll('.card, .enter');
    // const transitions = ['rotateInUpLeft', 'rotateInUpRight', 'rotateInDownLeft', 'rotateInDownRight'];
    // const transitions = ['zoomInLeft', 'zoomInRight', 'zoomInDown', 'zoomInUp'];
    // const transitions = ['bounceInLeft', 'bounceInRight', 'bounceInDown', 'bounceInUp'];
    const transitions = ['fadeInLeft', 'fadeInRight', 'fadeInDown', 'fadeInUp'];


    if (list) {
      for (let i = 0; i < list.length; i++) {
        list[i].classList.add('animated');
        list[i].classList.add(transitions[~~(Math.random() * 4)]);
      }

      setTimeout(() => {
        for (let i = 0; i < list.length; i++) {
          list[i].classList.remove('animated');
          transitions.forEach(t => list[i].classList.remove(t));
        }
      }, 1000);
    }

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
      story: new Array(10).fill().map(makeCard),
      humor: humors[~~ (Math.random() * humors.length)],
      arc: arcs[~~ (Math.random() * arcs.length)],
      affectLevel: ~~ (Math.random() * 3),
      conflict: conflicts[~~ (Math.random() * conflicts.length)],
      setting: places.places[~~ (Math.random() * places.places.length)],
      characters: {
        hero: this.makeName(),
        foil: this.makeName()
      },
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
    this.setState({
      currentCard: this.state.currentCard,
    });
  }

  render() {
    const contentClass = 'd-flex justify-content-between flex-column h-100 enter';

    const moral = () => {
      return <div className={contentClass}>
        <h5 className="text-muted">Explores How:</h5>
          <table className="table-sm">
          <tbody>
            <tr>
              <td>
                {this.linker(this.state.moral[0])}
              </td>
              <td>
                {this.linker(this.state.moral[1])}
              </td>
            </tr>
          </tbody>
          </table>
          <div>
            <div className="badge badge-info">Concept 1</div>&nbsp;&nbsp;
            <div className="badge badge-info">===</div>&nbsp;&nbsp;
            <div className="badge badge-info">Concept 2</div>
          </div>
      </div>;
    };

    const effect = () => {
      return <div className={contentClass} onClick={this.cardClick.bind(this, this.state.story[2])}>
      <h5 className="text-muted">Conflict Effect:</h5>
      <h5>{this.state.arc.orientations[2] ? 'Breaks': 'Restores'} {affectLevels[this.state.affectLevel].name}</h5>
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
                        : '')}>
                        </div>
                  </div>
                </div>
              </div>
              <br/>
          </div>;
    }

    const humor = () => {
      return <div id="humor" className={contentClass}>
        <h5 className="text-muted">Humor Pattern:</h5>
        <h4>{this.state.humor.name}</h4>
        <p>{this.state.humor.descrip}</p>
        <p>
          Sample Item:&nbsp;
          <span className="badge badge-info badge-xl">
            { this.addPickle() }
          </span>
        </p>
        <div className="card pt-2">
          <h6>&#x26A0; {this.state.humor.type}</h6>
          <p className="m-1">{patterns[this.state.humor.type]}</p>
        </div>
      </div>
    }

    const conflict = () => {
      return <div className={contentClass}>
        <h5 className="text-muted">Central Conflict:</h5>
        <h4><strong>{this.state.conflict.title}</strong></h4>
        <p>{this.state.conflict.explain}</p>

        { this.linker(this.state.story[2]) }
      </div>
    }

    const plot = () => {
      return <div>
        <h5 className="text-muted">In three acts:</h5>

        <table className="table-sm">
        <tr>
          <td>
          {this.linker(this.state.plot[0])}
          <div className="badge badge-success capitalize">{this.state.plot[0].pickle}</div>

          </td>
          <td>
          {this.linker(this.state.plot[1])}
          <div className="badge badge-success capitalize">{this.state.plot[1].pickle}</div>

          </td>
          <td>
          {this.linker(this.state.plot[2])}
          <div className="badge badge-success capitalize">{this.state.plot[2].pickle}</div>

          </td>
        </tr>
        </table>

      </div>
    }

    const story = () => {
      const place = (txt) => {
        return <div className="badge badge-info">
          {txt}
          </div>
      }

      const pickle = (txt) => {
        return <div className="badge badge-success">
          {txt}
          </div>
      }

      return <table id="main-story" className="table table-sm" style={{backgroundImage: `url(${arcImages[this.state.arc.name + '.png']})`}}>
      <tr>
        <td colSpan={4}> <br/>
        <h2 className="text-muted">Main Story:</h2>
        </td>
        <td colSpan={2}>
        Legend:<br/>
        { place('card position') }
        { pickle('optional prompt') } <br/><br/>
        </td>
      </tr>
             <tr>
               <td></td>
               <td>
                 { place('Starting Hero') }
                 {this.linker(this.state.story[1])}
                 { pickle(this.state.characters.hero) }
               </td>
               <td colSpan={2}></td>
               <td>
                 { place('Grown Hero') }
                 {this.linker(this.state.story[6])}
                 { pickle(this.state.characters.hero) }
               </td>
               <td></td>
             </tr>
             <tr>
               <td>
                 { place('The World') }
                 { this.linker(this.state.story[0])}
                 { pickle(this.state.setting) }
               </td>
               <td>
                 { place('The Conflict') }
                 { this.linker(this.state.story[2])}
                 { pickle(this.state.conflict.title) }
               </td>
               <td>
                 { place('Major trial') }
                 { this.linker(this.state.story[4])}
                 { pickle(this.state.story[4].pickle) }
               </td>
               <td>
                 { place('Hero reinvests') }
                 { this.linker(this.state.story[5])}
                 { pickle(this.state.story[5].pickle) }
               </td>
               <td>
                 { place('Finale') }
                 { this.linker(this.state.story[7])}
                 { pickle(this.state.story[7].pickle) }
               </td>
               <td>
                 { place('New World') }
                 { this.linker(this.state.story[9])}
                 { pickle(this.state.story[9].pickle) }
               </td>
             </tr>
             <tr>
               <td></td>
               <td>
                 { place('Foil') }
                 {this.linker(this.state.story[3])}
                 { pickle(this.state.characters.foil) }
               </td>
               <td colSpan={2}></td>
               <td>
                 { place('Foil Finished') }
                 {this.linker(this.state.story[8])}
                 { pickle(this.state.characters.foil) }
               </td>
               <td></td>
             </tr>
           </table>

    }

    const arc = () => {
      return <div className={contentClass}>
      <h5 className="text-muted">Plot Arc:</h5>
      <img className="mw-100 enter" style={{
          transition: 'all 0.5s ease'
        }} src={arcImages[this.state.arc.name + '.png']}/>
        <br/>
        <div className="enter">
          <h2 className={this.state.arc.orientations[2] ? 'text-danger': 'text-success'}>{this.state.arc.name}</h2>
        </div>
      </div>
    }

    const setting = () => {
      return <div className={contentClass}>
        <h5 className="text-muted">Setting:</h5>
        <h5>{ this.state.setting }</h5>
        { this.linker(this.state.story[0]) }
      </div>
    }

    const hero = () => {
      return <div className={contentClass}>
        <h5 className="text-muted">Hero:</h5>
        <h5>{ this.state.characters.hero }</h5>
        { this.linker(this.state.story[1]) }
      </div>
    }

    const foil = () => {
      return <div className={contentClass}>
        <h5 className="text-muted">The Foil:</h5>
        <h4>{ this.state.characters.foil }</h4>
        <p>Represents the conflict</p>
        { this.linker(this.state.story[3]) }
      </div>
    }

    const notes = () => {
      const inputer = (card) => {
        return <div><textarea className="form-control" value={card.text} onChange={(e) => { card.text = e.target.value; this.setState(card); }}></textarea><br/></div>
      }

     return  <div>
             <div className="sidebar-header">
                 <h3>Notes</h3>
             </div>

             <ul className="list-unstyled components">
                 <li>
                     <p>Hero: { this.state.characters.hero }</p>
                     {inputer(this.state.story[1])}
                 </li>
                 <li>
                     <p>Foil: { this.state.characters.foil }</p>
                     {inputer(this.state.story[3])}
                 </li>
                 <li>
                     <p>Setting: { this.state.setting }</p>
                     {inputer(this.state.story[0])}
                 </li>
                 <li>
                     <p>Conflict:  { this.state.characters.hero } has a { this.state.arc.name } story pitting { this.state.conflict.title }</p>
                     {inputer(this.state.story[2])}
                 </li>
                 <li>
                     <p>Explores How: </p>
                     {inputer(this.state.moral[0])}
                     <p>Equals</p>
                     {inputer(this.state.moral[1])}
                 </li>
                 <li>
                     <p>{this.state.humor.descrip}, {this.state.arc.orientations[2] ? 'Breaks': 'Restores'} {affectLevels[this.state.affectLevel].name} </p>
                     <p>In Three Acts:</p>
                     {inputer(this.state.plot[0])}
                     {inputer(this.state.plot[1])}
                     {inputer(this.state.plot[2])}
                 </li>

                 <li>
                   <p>Major trial</p>
                   {inputer(this.state.story[4])}
                 </li>
                 <li>
                   <p>Hero reinvests</p>
                   {inputer(this.state.story[5])}
                 </li>
                 <li>
                   <p>Finale</p>
                   {inputer(this.state.story[7])}
                 </li>
                 <li>
                   <p>New World</p>
                   {inputer(this.state.story[9])}
                 </li>
                 <li>
                   <p>Hero Finished</p>
                  {inputer(this.state.story[6])}
                 </li>
                 <li>
                   <p>Foil Finished</p>
                  {inputer(this.state.story[8])}
                 </li>
             </ul>
         </div>
    }

    return <div id="wrapper">
    <nav id="sidebar" className={this.state.sidebar ? 'active': ''}>

            <div id="dismiss" className="float-right" onClick={() => { this.setState({sidebar: false}); }}>
                <i className="fas fa-arrow-left"></i>
            </div>
    { notes() }

    </nav>

    <div id="content">
      <h2>
        <span onClick={() => { this.setState({sidebar: true}); }}>Story</span>
        <div className="btn btn-success float-right" onClick={this.deal.bind(this, true)}>New Story</div>
      </h2>
      <div className="text-center">
        <div className="row row-eq-height">
            <div className="col cards-sm">
              { hero() }
            </div>
            <div className="col">
              { arc() }
            </div>
            <div className="col cards-sm">
             { setting() }
            </div>
          </div>

          <hr/>

          <div className="row row-eq-height">
            <div className="col cards-sm">
              { foil() }
            </div>
            <div className="col cards-sm">
              { conflict() }
            </div>
            <div className="col-5">
              { moral() }
            </div>
          </div>
          <hr/>
          <div className="row row-eq-height">
            <div className="col">
              { humor() }
            </div>
            <div className="col">
              { effect() }
            </div>
            <div className="col-5">
              { plot() }
            </div>
          </div>

          <hr/>
          <div className="row row-eq-height">
            <div className="col">
              { story() }
            </div>
          </div>
        </div>

        <hr/>
        { notes() }
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
