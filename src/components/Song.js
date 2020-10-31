import React from 'react';
import Card from './Card';
import Metronome from './Metronome';
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

import pickles from '../sources/nouns.json';
import tarot from '../sources/tarot.json';

const randomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

const escapeRegExp = (str) => {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

const ToggleButton = React.createClass({
  getInitialState: function() {
    return {
      condition: false
    }
  },
  handleClick: function() {
    this.setState({
      condition: !this.state.condition
    });
  },
  render: function() {
    return (
      <div
        onClick={ this.handleClick }
        className= { this.state.condition ? "btn btn-success m-1" : "btn m-1" }
      >
        { this.props.message }
      </div>
    )
  }
});


// Key in this dict is Wavelength (in cm), taken from:
//   http://www.phy.mtu.edu/~suits/notefreqs.html
// "+" means sharp, "-" means flat, "." means natural.
// E+ exists because of this: http://en.wikipedia.org/wiki/C-sharp_major
const allNotes = [{
    "freq": 1050,
    "vals": ["C.", "B+", "D--"]
  },
  {
    "freq": 996,
    "vals": ["C+", "D-"]
  },
  {
    "freq": 940,
    "vals": ["D.", "C++", "E--"]
  },
  {
    "freq": 887,
    "vals": ["D+", "E-", "F--"]
  },
  {
    "freq": 837,
    "vals": ["E.", "F-", "D++"]
  },
  {
    "freq": 790,
    "vals": ["F.", "E+", "G--"]
  },
  {
    "freq": 746,
    "vals": ["F+", "G-"]
  },
  {
    "freq": 704,
    "vals": ["G.", "F++", "A--"]
  },
  {
    "freq": 665,
    "vals": ["G+", "A-"]
  },
  {
    "freq": 627,
    "vals": ["A.", "G++", "B--"]
  },
  {
    "freq": 592,
    "vals": ["A+", "B-", "C--"]
  },
  {
    "freq": 559,
    "vals": ["B.", "C-", "A++"]
  }
];

// the base note (no modifier)
// used for the key picker & to work out the correct notation.
const baseNotes = ["C", "D", "E", "F", "G", "A", "B"];
let baseNote = baseNotes[0];

// flat/natural/sharp
const noteModifiers = [{
    "name": "flat",
    "offset": -1,
    "sign": "-",
    "frontEndSign": "♭"
  },
  {
    "name": "natural",
    "offset": 0,
    "sign": ".",
    "frontEndSign": ""
  },
  {
    "name": "sharp",
    "offset": 1,
    "sign": "+",
    "frontEndSign": "♯"
  }
];
let noteModifier = noteModifiers[1];

// major & minor modes. includes stepsToNext & chord types at each step.
const modes = [{
    "name": "major",
    "innerCircleOffset": 3,
    "opposingModeName": "minor",
    // stepsToNext is how many semitones until the next note in the key.
    // C + 2 = D; D + 2 = E; E + 1 = F; [etc...]
    "stepsToNext": [2, 2, 1, 2, 2, 2, 1],
    "chordTypes": [{
        "name": "major",
        "symbol": ""
      },
      {
        "name": "minor",
        "symbol": "m"
      },
      {
        "name": "minor",
        "symbol": "m"
      },
      {
        "name": "major",
        "symbol": ""
      },
      {
        "name": "major",
        "symbol": ""
      },
      {
        "name": "minor",
        "symbol": "m"
      },
      {
        "name": "diminished",
        "symbol": "dim"
      }
    ]
  },
  {
    "name": "minor",
    "innerCircleOffset": 9,
    "opposingModeName": "major",
    "stepsToNext": [2, 1, 2, 2, 1, 2, 2],
    "chordTypes": [{
        "name": "minor",
        "symbol": "m"
      },
      {
        "name": "diminished",
        "symbol": "dim"
      },
      {
        "name": "major",
        "symbol": ""
      },
      {
        "name": "minor",
        "symbol": "m"
      },
      {
        "name": "minor",
        "symbol": "m"
      },
      {
        "name": "major",
        "symbol": ""
      },
      {
        "name": "major",
        "symbol": ""
      }
    ]
  }
];
let mode = modes[1];

// progressions including name and steps
const progressions = [{
    "name": "Alternative",
    "steps": [5, 3, 0, 4]
  },
  {
    "name": "Canon",
    "steps": [0, 4, 5, 2, 3, 0, 3, 4]
  },
  {
    "name": "Cliché",
    "steps": [0, 4, 5, 3]
  },
  {
    "name": "Cliché 2",
    "steps": [0, 5, 2, 6]
  },
  {
    "name": "Creepy",
    "steps": [0, 5, 3, 4]
  },
  {
    "name": "Creepy 2",
    "steps": [0, 5, 1, 4]
  },
  {
    "name": "Endless",
    "steps": [0, 5, 1, 3]
  },
  {
    "name": "Energetic",
    "steps": [0, 2, 3, 5]
  },
  {
    "name": "Grungy",
    "steps": [0, 3, 2, 5]
  },
  {
    "name": "Memories",
    "steps": [0, 3, 0, 4]
  },
  {
    "name": "Rebellious",
    "steps": [3, 0, 3, 4]
  },
  {
    "name": "Sad",
    "steps": [0, 3, 4, 4]
  },
  {
    "name": "Simple",
    "steps": [0, 3]
  },
  {
    "name": "Simple 2",
    "steps": [0, 4]
  },
  {
    "name": "Twelve Bar Blues",
    "steps": [0, 0, 0, 0, 3, 3, 0, 0, 4, 3, 0, 4]
  },
  {
    "name": "Wistful",
    "steps": [0, 0, 3, 5]
  }
];
let progression = progressions[2];

const randomizeProgression = () => {
  progression = randomItem(progressions);
  baseNote = randomItem(baseNotes);
  mode = randomItem(modes);
};

let scale = [];
const recalculateScale = () => {
  var rootNoteStr = baseNote + noteModifier.sign;
  var absSteps = getAbsoluteSteps(mode);
  scale = getScale(rootNoteStr, absSteps);
};

let allChordsInKey = [];
const recalculateAllChordsInKey = () => {
  const chordsInKey = [];
  for (var i = 0; i < scale.length; i++) {

    var chordName = scale[i].name + mode.chordTypes[i].symbol;

    var chord = {
      "name": chordName,
      "mode": mode.chordTypes[i],
      "baseNote": scale[i].details
    };

    chordsInKey.push(chord);
  }

  allChordsInKey = chordsInKey;
};

let mainProgression = [];
const recalculateMainProgression = () => {
  var rootNoteStr = baseNote + noteModifier.sign;
  var progression = getProgressionFromBaseAndMode(rootNoteStr, mode);

  mainProgression = progression;
};

let alternatives = [];
const recalculateAlternatives = () => {
  var alts = [];

  var rootNoteStr = baseNote + noteModifier.sign;
  var rootNoteDetails = getNoteDetails(rootNoteStr);
  var orderedNotes = getAllNotesInOrder(rootNoteDetails);

  // 1. Create the circle of fifths.
  var circleOfFifths = getCircleOfFifths(rootNoteDetails, orderedNotes);

  // 2. Rotate the circleOfFifths to get the inner circle.
  var innerCircle = rotateCircleOfFifths(circleOfFifths, mode.innerCircleOffset);

  // 3. Get related keys. That's one opposite and the two either side.
  // a. Opposite.

  var alt1Base = innerCircle[0].vals[0]; // first note option in the first note.
  var oppMode;
  for (var i = 0; i < modes.length; i++) {
    var theMode = modes[i];
    if (theMode.name === theMode.opposingModeName) {
      oppMode = theMode;
    }
  }
  var altOpposite = getProgressionFromBaseAndMode(alt1Base, theMode || oppMode);
  alts.push(altOpposite);

  // b & c are -1 and +1 rotations of the outer circle
  var alt2Base = circleOfFifths[1].vals[0]; // +1
  var alt3Base = circleOfFifths[circleOfFifths.length - 1].vals[0]; // -1

  for (var i = 0; i < [alt2Base, alt3Base].length; i++) {
    var theBaseNote = [alt2Base, alt3Base][i];
    var altProg = getProgressionFromBaseAndMode(theBaseNote, theMode);
    alts.push(altProg);
  }

  alternatives = alts;
};

const notesInChord = (chord) => {
  var baseNoteIndex = -1;
  var theScale = scale;
  for (var i = 0; i < theScale.length; i++) {
    var note = theScale[i];
    if (note.details.freq === chord.baseNote.freq) {
      baseNoteIndex = i;
      break;
    }
  }

  if (baseNoteIndex >= 0) {
    // get [0, 2, 4] of $scope.scale, starting at base note
    var notesInChord = [theScale[baseNoteIndex]];

    var second = baseNoteIndex + 2;
    if (second >= theScale.length) {
      second = second - theScale.length;
    }

    notesInChord.push(scale[second]);

    var third = baseNoteIndex + 4;
    if (third >= theScale.length) {
      third = third - theScale.length;
    }

    notesInChord.push(theScale[third]);

    return notesInChord;
  } else {
    return []; // this is weird.
  }
}

////////////////////////////
// Helpers
////////////////////////////

const getProgressionFromBaseAndMode = (baseNote, theMode) => {
  var absSteps = getAbsoluteSteps(theMode);
  var theScale = getScale(baseNote, absSteps);

  var chordsInKey = [];
  for (var i = 0; i < theScale.length; i++) {
    var chord = {
      "name": theScale[i].name + theMode.chordTypes[i].symbol,
      "mode": theMode.chordTypes[i],
      "baseNote": theScale[i].details
    };
    chordsInKey.push(chord);
  }
  return getProgression(progression, chordsInKey);
};

const getProgression = (progressionDetails, allChordsInKey) => {
  var theProgression = [];
  for (var i = 0; i < progressionDetails.steps.length; i++) {
    var step = progressionDetails.steps[i];
    theProgression.push(allChordsInKey[step]);
  }
  return theProgression;
};

// Calculate absolute steps.
// returns something like [0,2,3,5,7,9,10]
const getAbsoluteSteps = (theMode) => {
  var absoluteSteps = [];
  var rollingTotal = 0;
  for (var i = 0; i < theMode.stepsToNext.length; i++) {
    absoluteSteps.push(rollingTotal);
    rollingTotal += theMode.stepsToNext[i];
  }
  return absoluteSteps;
};

// helper to get the details for a given note.
// noteStr is something like "C+"
const getNoteDetails = (noteStr) => {
  var noteDetails;

  for (var i = 0; i < allNotes.length; i++) {
    var currentNote = allNotes[i];
    for (var j = 0; j < currentNote.vals.length; j++) {
      var currentNoteVal = currentNote.vals[j];
      if (currentNoteVal === noteStr) {
        noteDetails = currentNote;
        break;
      }
    }
    if (typeof(noteDetails) !== "undefined") {
      break;
    }
  }
  return noteDetails;
};

const prettifyNoteStr = (noteStr) => {
  var prettyNote = noteStr;

  for (var i = 0; i < noteModifiers.length; i++) {
    var noteModifier = noteModifiers[i];
    if (prettyNote.indexOf(noteModifier.sign) !== -1) {
      prettyNote = prettyNote.replace(new RegExp(escapeRegExp(noteModifier.sign), 'g'), noteModifier.frontEndSign);
    }
  }
  return prettyNote;
};

// bring it all together
const getScale = (rootNoteStr, steps) => {
  // This will return an array of notes representing a scale.
  // baseNote and returned notes should be something like "C+", "C-" or "C."
  // absoluteSteps is a 0-based array of notes.

  var rootNoteDetails = getNoteDetails(rootNoteStr);
  var notesInOrder = getAllNotesInOrder(rootNoteDetails);

  // full note details for the scale.
  var detailScale = [];
  for (var i = 0; i < steps.length; i++) {
    detailScale.push(notesInOrder[steps[i]]);
  }

  // just the string values of the notes in the scale.
  var strScale = [];

  var currentLetter = rootNoteStr.charAt(0);

  for (var i = 0; i < detailScale.length; i++) {
    var noteDetails = detailScale[i];
    for (var j = 0; j < noteDetails.vals.length; j++) {
      var noteStr = noteDetails.vals[j];
      if (noteStr.charAt(0) === currentLetter) {
        var prettyNoteStr = prettifyNoteStr(noteStr);

        var note = {
          "name": prettyNoteStr,
          "details": noteDetails
        };

        strScale.push(note);
      }
    }
    // increment the letter.
    if (currentLetter === "G") {
      // lazy way to loop around.
      currentLetter = "A";
    } else {
      currentLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 1);
    }
  }
  return strScale;
};

// helper to get all notes in order, starting from startNote.
const getAllNotesInOrder = (rootNoteDetails) => {

  var orderedNotes = [];

  // loop through AllNotes until we find the startFreq.
  for (var i = 0; i < allNotes.length; i++) {
    var note = allNotes[i];
    if (note.freq === rootNoteDetails.freq) {
      var startIndex = i;
      var j = 0;
      while (j < allNotes.length) {
        // loop around to the start of the array if necessary.
        var trueIndex = startIndex + j;
        if (trueIndex >= allNotes.length) {
          trueIndex -= allNotes.length;
        }
        orderedNotes.push(allNotes[trueIndex]);
        j++;
      }
      break; // found the startFreq, break the 'for'.
    }
  }

  return orderedNotes;
};

const getCircleOfFifths = (startNote, notes) => {
  // start circle with the root note.
  var circle = [startNote];
  while (circle.length !== 12) {
    // get the note 7 steps after the latest one in the circle.
    var notes = getAllNotesInOrder(circle[circle.length - 1]);
    circle.push(notes[7]);
  }
  return circle;
};

const rotateCircleOfFifths = (circleOfFifths, offset) => {
  var index = offset;
  var newCircle = [];
  while (newCircle.length !== circleOfFifths.length) {
    if (index === circleOfFifths.length) {
      index = 0;
    }
    newCircle.push(circleOfFifths[index]);
    index++;
  }
  return newCircle;
};



class Story extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      progressions,
      baseNotes,
      modes,
      currentCard: {
        card: tarot.cards[~~(Math.random() * tarot.cards.length)],
      },
      wordOne: _.sample(pickles.nouns),
      wordTwo: _.sample(pickles.nouns),
      currentProg: [],
    };
  }

  getMeaning(meaning) {
    const side = Math.random() > 0.5? 'light' : 'shadow';

    return meaning[side][~~(Math.random() * meaning[side].length)];
  }

  setProg(currentProg) {
      this.setState({
        currentProg,
      });
  }

  cardClick(c) {
    document.getElementById('card-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  linker(pos, i) {
    return <div className="text-center card bg-dark text-white" key={i}>
      <div onClick={this.cardClick.bind(this, pos)}>
        <br/>
        <img style={{
            opacity: 0.35
          }} className={'card-img w-75 ' + (
            pos.reversed
            ? 'reversed'
            : '')} src={images[pos.card.image]}/><br/>
        <div className="card-img-overlay d-flex justify-content-around flex-column">
          <div className="display-4">{
            this.getMeaning(pos.card.meanings)
          }</div>

          <h5>{
            pos.card.keywords.map((word, i) => {
              return <span className="badge" key={i}>
                {word}&nbsp;&nbsp;&nbsp;
              </span>
            })
          }</h5>

        </div>
        <br/>
      </div>
    </div>
  }

  deal() {
    randomizeProgression();
    recalculateScale();
    recalculateAllChordsInKey();
    recalculateMainProgression();
    recalculateAlternatives();
    this.setState({
      mode,
      baseNote,
      mainProgression,
      alternatives,
      allChordsInKey,
      currentCard: {
        card: tarot.cards[~~(Math.random() * tarot.cards.length)],
      },
      wordOne: _.sample(pickles.nouns),
      wordTwo: _.sample(pickles.nouns),
      currentProg: [],
    });
  }


  recalculate(note = baseNote, prog = progression) {
    progression = prog;
    baseNote = note;
    recalculateScale();
    recalculateAllChordsInKey();
    recalculateMainProgression();
    recalculateAlternatives();

    this.setState({
      mode,
      baseNote,
      mainProgression,
      alternatives,
      allChordsInKey,
    });
  };

  noteChange(event) {
    this.recalculate(baseNotes[event.target.value]);
  }

  progChange(event) {
    this.recalculate(this.state.baseNote, progressions[event.target.value]);
  }

  modeChange(event) {
    mode = modes[event.target.value];
    this.recalculate(baseNote);
  }

  songStyle() {
      switch(_.sample([0,1,2,3])) {
        case 0:
        return ( <div><h4>Basic</h4>
        <p><strong>Verse 1</strong> - Introduce an idea</p>
        <p><strong>Verse 2</strong> - Develop the idea</p>
        <p><strong>Bridge</strong> - Offer a different perspective, omitting the title</p>
        <p><strong>Verse 3</strong> - Conclusion</p></div> );
        break;

        case 1:
        return (<div><h4>Problem-Solution</h4>
        <p><strong>Verse 1</strong> - Identify the problem</p>
        <p><strong>Verse 2</strong> - Elaborate on the problem -- what caused it?</p>
        <p><strong>Bridge</strong> - Discuss the solution to the problem</p>
        <p><strong>Verse 3</strong> - Talk about where we go from here. In a sad song, this is where we offer hope.</p></div>)
        break;

        case 2:
        return (<div><h4>Vignette 1</h4>
        <p>Use "word pictures" to suggest visual images to imagination of the listener. Keep them interested in and focused on the hook.</p>
        <p><strong>Verse 1</strong> - Set in the past</p>
        <p><strong>Verse 2</strong> - Set in the present</p>
        <p><strong>Bridge</strong></p>
        <p><strong>Verse 3</strong> - Set in the future</p></div>)
        break;

        case 3:
        return (<div><h4>Vignette 2</h4>
        <p>Use "word pictures" to suggest visual images to imagination of the listener. Keep them interested in and focused on the hook.</p>
        <p><strong>Verse 1</strong> - Set in the present</p>
        <p><strong>Verse 2</strong> - Flashback to the past</p>
        <p><strong>Bridge</strong></p>
        <p><strong>Verse 3</strong> - Back in the present</p></div>)
        break;
      }
  }

  render() {
    return <div>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
      <h1>Song
        <div className="btn btn-success float-right" onClick={this.deal.bind(this)}>New Song</div>
      </h1>
      <hr/>
      {(() => {
        if (this.state.currentProg.length) {
          return <div><div className="row text-center">
            <div className="col-7">
              <p className="songy">{
                this.state.currentProg.map((note, i) => {
                  return (<span className="badge badge-primary" key={i}>{note.name}</span>)
                })
              }</p>

              <p className="songy">{this.state.wordOne}</p>
              <p className="songy">{this.state.wordTwo}</p>
              <div className="text-left border rounded p-2 text-muted">
              { this.songStyle() }
              </div>

              {allChordsInKey.map((note, i) => {
                return <ToggleButton key={i} message={note.name}/>
              })}
            </div>
            <div className="col-5">
              {this.linker(this.state.currentCard)}
            </div>
          </div>
          <br/><br/>
          <hr/>
          </div>

        } else {
          return <h1>Select Chord Progression:</h1>
        }
      })()}

      <div className="row">
      <div className="col-6">
      <select className="form-control" value={this.state.progression} onChange={this.progChange.bind(this)}>
      {
        progressions.map((prog, i) => {
          return <option key={i} value={i}>{prog.name}</option>
        })
      }</select>
      </div>

      <div className="col-6">
      <select className="form-control" onChange={this.modeChange.bind(this)}>
      {
        modes.map((mode, i) => {
          return <option key={i} value={i}>{mode.name}</option>
        })
      }</select>
      </div>
      </div>
      <br/><br/>

      <div className="row">
        <div className="col">

      {
        baseNotes.map((note, i) => {
          return <button className="btn btn-secondary m-1" key={i} value={i} onClick={this.noteChange.bind(this)}>{note}</button>
        })
      }

      <br/><br/>

      <button className="btn m-1" onClick={this.setProg.bind(this, mainProgression)}><h4>{
        mainProgression.map((note, i) => {
          return <span key={i}>{note.name},&nbsp;&nbsp;</span>
        })
      }</h4></button>

      <div>{
        alternatives.map((alt, i) => {
          return <div><button className="btn m-1" onClick={this.setProg.bind(this, alt)}><h4 key={i}>
            { alt.map((note, i) => {
              return (<span key={i}>{note.name},&nbsp;&nbsp;</span>)
            })
          }</h4></button></div>
          })
        }</div>

        <button className="btn m-1" onClick={this.setProg.bind(this, allChordsInKey)}><h4>{
          allChordsInKey.map((note, i) => {
            return <span key={i}>{note.name},&nbsp;&nbsp;</span>
          })
        }</h4></button>

        </div>
        <div className="col">
        <Metronome/>
        </div>
        </div>
        </div>

        <div id="card-modal" className="animated zoomIn">
          <br/>
          <div className="container">
              <h1><span className="close float-right" onClick={() => {
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
