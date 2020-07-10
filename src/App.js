import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'
import Logo from './components/Logo/Logo'
import Rank from "./components/Rank/Rank"
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Particles from 'react-particles-js'
import Clarifai from 'clarifai'

import './App.css';

/*
*To load User's id
*<Signin loadUser={this.loadUser} onRoutChange={this.onRouteChange} />
*
*To update the Rank with the states of the user
*<Rank name={this.state.user.name} entries={this.state.user.entries} />
*/

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
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }


  calculateFaceLocation = (data) => {
    const clarifairFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage')
    const width = Number(image.width)
    const height = Number(image.height)
    return {
      leftCol: clarifairFace.left_col * width,
      topRow: clarifairFace.top_row * height,
      rightCol: width - (clarifairFace.right_col * width),
      bottomRow: height - (clarifairFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onPictureSubmit = () => {

    this.setState({imageUrl: this.state.input})
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input
      )
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      } )
      .catch(err => console.log(err))
          // there was an error
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state
    return (
      <div className="App">
        <Particles className="particles" params={particleOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' 
        ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onPictureSubmit={this.onPictureSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        : (
            this.state.route === 'signin'
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
      } 
      </div>
    );
  }
  
}

export default App;
