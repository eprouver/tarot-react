import React from 'react';
import {Link} from 'react-router-dom';
import _ from 'underscore';

var w = 70,
  h = 120;

class Layout extends React.Component {

  updateCard(container) {
    _.extend(_(this.state.containers).findWhere({name: container.name}), {
      x: ~~container.x,
      y: ~~container.y,
      name: container.name,
      rotated: container.rotation == 90
    });
    this.forceUpdate();
  }

  updatePrompt(e, card){
      card.prompt = escape(e.target.value);
      this.forceUpdate();
  }

  removeCard(container) {

    this.stage.removeChild(container);
    this.stage.update();

    this.setState({
      containers: this.state.containers.filter((v) => {
        return v.name != container.name;
      })
    })
  }

  selectContainer(container){
    [].slice.call(document.getElementsByClassName('t-card')).forEach((c) => {
      c.classList.remove('alert-warning');
    })
    let me = document.getElementById(container.name)

    if(me){
      me.classList.add('alert-warning');
    }
  }

  addCard() {
    var card = new createjs.Shape();
    var container = new createjs.Container();
    var rotate = new createjs.Shape();
    var remove = new createjs.Shape();

    card.graphics.setStrokeStyle(2).beginStroke("black").beginFill('gray').drawRect(0, 0, w, h);
    container.on("pressmove", (evt) => {
      container.x = evt.stageX - (
        container.rotation == 90
        ? -h / 2
        : w / 2);
      container.y = evt.stageY - (
        container.rotation == 90
        ? w / 2
        : h / 2);
      this.stage.update();

      this.updateCard(container);
    });

    container.on('click', (evt) => {

      this.selectContainer(container);

    })

    rotate.graphics.setStrokeStyle(2).beginStroke("black").beginFill('blue').drawRect(0, 0, 20, 20);
    rotate.on("click", (evt) => {
      container.rotation = container.rotation == 90
        ? 0
        : 90;
      this.stage.update();
      this.updateCard(container);
    });

    remove.graphics.setStrokeStyle(2).beginStroke("black").beginFill('red').drawRect(w - 20, h - 20, 20, 20);
    remove.on("click", (evt) => {
      this.removeCard(container);
    })

    container.addChild(card);
    container.addChild(rotate);
    container.addChild(remove);
    this.stage.addChild(container);

    container.name = _.uniqueId('c_');

    var label = new createjs.Text(container.name, "20px Arial", "white");
    label.y = (h / 2) - 10;
    label.x = (w / 10);
    container.addChild(label);
    this.stage.update();

    this.state.containers.push({x: container.x, y: container.y, name: container.name})
    this.forceUpdate();

  }

  componentDidMount() {
    this.stage = new createjs.Stage('myCanvas');
  }

  constructor(props) {
    super(props);

    this.state = {
      containers: []
    }
  }

  render() {
    return <div>
      <h2>Layout</h2>
      <br/>
      <button type="button" className="btn btn-success" onClick={this.addCard.bind(this)}>Add Card</button>

      <div className="row">
        <div className="col">
          <canvas id="myCanvas" className="reading-canvas" width="1200" height="1200"></canvas>
        </div>
        <div className="col">
          {
            this.state.containers.map((card, i) => {
              return <div id={card.name} key={i} className="t-card-input t-card alert">
                <span>{i + 1}. {card.name} - Prompt:</span>
                <input type="text" className="form-control" onChange={(e) => { this.updatePrompt(e, card) }}/>
              </div>
            })
          }
        </div>
      </div>
      <br/>
      <div className='alert alert-info'>
      <h2>Output:</h2>
      <p>{JSON.stringify(this.state.containers)}</p></div>
    </div>



  }
}

export default Layout;
