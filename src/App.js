import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Logo from './components/Logo/Logo'
import Rank from "./components/Rank/Rank"
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Particles from 'react-particles-js'
import Clarifai from 'clarifai'

import './App.css';

const app = new Clarifai.App({
  apiKey: "ad5b9825c91e49818b99163fdf1ad0d1"
});

const particleOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 700
      }
    }
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "grab"
      }
    }
  }
}

class App extends Component {
  constructor() {
    super()
    this.state  = {
      input: '',
      imageUrl: ''
    }
  }

  onInputChange = (event) => {
    console.log(event.target.value)
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: input})
    app.models
      .predict(
        Clarifai.COLOR_MODEL,
        "https://samples.clarifai.com/metro-north.jpg"
      )
      .then(
        function(response) {
          console.log(response)
        },
        function(err) {
          // there was an error
        }
      );
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particleOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition imageUrl={this.state.imageUrl} />
      </div>
    );
  }
  
}

export default App;
