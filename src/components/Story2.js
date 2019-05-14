import React from 'react';
import Card from './Card';
import Story from './Story';
import { patterns, affectLevels, humors, arcs, importAll, conflicts } from './meaningBlocks';
import _ from 'underscore';


const images = importAll(require.context('../images/tarot', false, /\.(png|jpe?g|svg)$/));
const arcImages = importAll(require.context('../images/arcs', false, /\.(png|jpe?g|svg)$/));

import tarot from '../sources/tarot.json';
import places from '../sources/places.json';

export default class Story2 extends Story {

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

    let state = {
      moral: new Array(2).fill().map(makeCard),
      plot: new Array(3).fill().map(makeCard),
      story: new Array(10).fill().map(makeCard),
      humor: humors[~~ (Math.random() * humors.length)],
      arc: arcs[~~ (Math.random() * arcs.length)],
      affectLevel: ~~ (Math.random() * 3),
      conflict: conflicts[~~ (Math.random() * conflicts.length)],
      setting: places.places[~~ (Math.random() * places.places.length)],
    };

    state.plot.forEach((c, i) => {
      c.reversed = state.arc.orientations[i];
    })

    if (setState) {
      this.setState(state);
    }

    return state;
  }

  render() {

    const moral = () => {
      return <div>
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
      return <div>
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
      return <div id="humor" className="">
        <h5 className="text-muted">Humor Pattern:</h5>
        <h4>{this.state.humor.name}</h4>
        <p>{this.state.humor.descrip}</p>
        <h5>{this.state.humor.type}</h5>
        <p>{patterns[this.state.humor.type]}</p>
      </div>
    }

    const conflict = () => {
      return <div>
        <h5 className="text-muted">Central Conflict:</h5>
        <h3><strong>{this.state.conflict.title}</strong></h3>
        <h5>{this.state.conflict.explain}</h5>
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

      return <table className="table table-sm">
      <tr>
        <td colSpan={6}>
        <h5 className="text-muted">Main Story:</h5>
        </td>
      </tr>
             <tr>
               <td></td>
               <td>
                 { place('Starting Hero') }
                 {this.linker(this.state.story[1])}
               </td>
               <td colSpan={2}></td>
               <td>
                 { place('Grown Hero') }
                 {this.linker(this.state.story[6])}
               </td>
               <td></td>
             </tr>
             <tr>
               <td>
                 { place('The World') }
                 {this.linker(this.state.story[0])}
               </td>
               <td>
                 { place('The Conflict') }
                 {this.linker(this.state.story[2])}
               </td>
               <td>
                 { place('Major trial') }
                 {this.linker(this.state.story[4])}
               </td>
               <td>
                 { place('Hero reinvests') }
                 {this.linker(this.state.story[5])}
               </td>
               <td>
                 { place('Finale') }
                 {this.linker(this.state.story[7])}
               </td>
               <td>
                 { place('New World') }
                 {this.linker(this.state.story[9])}
               </td>
             </tr>
             <tr>
               <td></td>
               <td>
                 { place('Foil') }
                 {this.linker(this.state.story[3])}
               </td>
               <td colSpan={2}></td>
               <td>
                 { place('Foil Finished') }
                 {this.linker(this.state.story[8])}
               </td>
               <td></td>
             </tr>
           </table>

    }

    const arc = () => {
      return <div>
      <h5 className="text-muted">Plot Arc:</h5>
      <img className="mw-100" style={{
          transition: 'all 0.5s ease'
        }} src={arcImages[this.state.arc.name + '.png']}/>
        <br/>
        <h2 className={this.state.arc.orientations[2] ? 'text-danger': 'text-success'}>{this.state.arc.name}</h2>
      </div>
    }

    const setting = () => {
      return <div>
      <h5 className="text-muted">Setting:</h5>
      <h5>{ this.state.setting }</h5>
      </div>
    }

    return <div>
      <h2>Story
        <div className="btn btn-success float-right" onClick={this.deal.bind(this, true)}>New Story</div>
      </h2>

      <table className="table table-sm text-center">
        <tbody>
          <tr className="main-row">
            <td>
              { conflict() }<br/>
              { setting() }
            </td>
            <td> { moral() } </td>
          </tr>
          <tr className="main-row">
            <td> { arc() } </td>
            <td> { effect() } </td>
          </tr>
          <tr className="main-row">
            <td> { plot() } </td>
            <td> { humor() } </td>
          </tr>
          <tr className="main-row">
            <td colSpan={2}> { story() } </td>
          </tr>
        </tbody>
      </table>

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
      </div>;

  }
}
