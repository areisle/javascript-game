import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/reset.css';
import './stylesheets/main.css';

//import { BrowserRouter } from 'react-router-dom';
//import { Switch, Route } from 'react-router-dom';
//import Home from './my_modules/home.js';
//import Details from './my_modules/details.js';
//import RSVPApp from './my_modules/rsvp.js';
function setCatalogDirection() {
  //do this only on mount, and resize
  //get current size of window
  //compare to size of current view
  let [wWidth, wHeight] = [window.innerWidth, window.innerHeight];
  let wAR = wWidth / wHeight;
  let vAR = 1001 / 768;
}
class App extends Component {
  constructor(props) {
    //call methods that set position of catalog here -- and on resize?
    super(props);
    this.views = {'kitchen': {connections: ['cellar', 'ice-box', 'stove', 'shelf', 'cutting-board'], items: ['rice'], tools: [], aspectRatio: (1001/768)},
                  'cellar': {connections: ['kitchen'], items: ['onions', 'garlic', 'wine', 'mushrooms'], tools: [], aspectRatio: (480/541)},
                  'stove': {connections: ['kitchen'], items: ['stock'], tools: ['cook'], aspectRatio: (1000/806)},
                  'ice-box': {connections: ['kitchen'], items: ['butter', 'parmesan'], tools: [], aspectRatio: (500/550)},
                  'shelf': {connections: ['kitchen'], items: [], tools: [], aspectRatio: (500/647)},
                  'cutting-board': {connections: ['kitchen'], items: [], tools: ['cut', 'grate'], aspectRatio: (1000/667)},
                 };
    this.itemCap = 10;
    this.state = {
      currentView: 'kitchen',
      items: [],
      layout: 'vertical',
    };
    this.swapView = this.swapView.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }
  
  //change view location
  swapView(view) {
    this.setState({
      currentView: view,
    });
  }
  
  
  //additem to catalog
  addItem(item) {
    if (this.state.items.length < this.itemCap) {
      let newItems = this.state.items.concat(item);
      this.setState({
        items: newItems
      });
    } else {
      //error message about bag being full
      console.log("your bag is full");
    }
    
  }
  
  //delete item from catalog
  removeItem(i) {
    let original = this.state.items;
    let newItems = original.slice(0, i).concat(original.slice(i+1));
    this.setState({
      items: newItems
    });
  }
  
  //changes layout of game depending on window size
  updateLayout() {
    
  }
  
  render () {
    let view = this.views[this.state.currentView];
    return (
      <div className="wrapper">
       <div className="view-wrapper">
          <View name={this.state.currentView} 
                connections={view.connections}
                items={view.items}
                tools={view.tools}
                move={this.swapView}
                add={this.addItem}>
          </View>
        </div>
        <Catalog  items={this.state.items} 
                  removeItem={this.removeItem}>
        </Catalog>
      </div>
      
      
    );
  }
}

class View extends Component {
  
  render () {
    let connections = this.props.connections.map(view => {
      return (<a  key={view} 
                  href={`#${view}`} 
                  className={`${view} nav`} 
                  onClick={() => this.props.move(view)}>
                {view}
              </a>);
    });
    let items = this.props.items.map(item => {
      return (<button key={item} 
                    className={`ingredient ${item}`} 
                    id={`${item}`} 
                    onClick={() => this.props.add({name: item})}>
              </button>);
    });
    return (
      <div className="view" id={`${this.props.name}-view`}>
        {connections}
        {items}
      </div>
    );
  }
}

class Catalog extends Component {
  render () {
    let listItems = this.props.items.map((item, index) => {
      return <Item key={index} name={item.name} remove={() => this.props.removeItem(index)}></Item>;
    });
    return (
      <div className="items">
        <ul className="items">{listItems}</ul>
      </div>
    );
  }
}

//class Ingredient {
//  constructor(name, tools) {
//    this.name = name;
//    this.state = 0;
//    this.tools = tools;
//  }
//}

class Item extends Component {
  constructor(props) {
    super(props);
    //name, time to add, current cut, possible prep options, etc.
    this.state = {
      prepState: 0, //rawest form collectible
      prepOptions: [], //possible things that can be done to item (mince, dice, shred, melt etc.)
    };
  }
  render () {
    return (
      <li className={`item ${this.props.name}`}>
        <button onClick={this.props.remove}></button>
      </li>
    );
  }
}


ReactDOM.render((
    <App />
), document.getElementById('root'));




