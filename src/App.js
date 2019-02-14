import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './Main';
import 'whatwg-fetch';

class App extends Component {
  constructor() {
    super();

    this.state = {
      clicked: false,
      loggedIn: false
    };

    this.onLogin = this.onLogin.bind(this);
    this.onRegister = this.onRegister.bind(this);
    this.login = this.login.bind(this);
  }
  onLogin() {
    this.setState({
      clicked: true
    });
  }
  onRegister() {
    this.setState({
      clicked: false
    });
  }
  login() {
    this.setState({
      loggedIn: true
    })
  }
  render() {
    return (
      <div>
        {this.state.loggedIn ? <Main /> : 
          <div>
            <button onClick={this.onRegister}className="btn btn-secondary">Register</button>
            <button onClick={this.onLogin} className="btn btn-primary">Login</button>
            <br />
            {!this.state.clicked ? <RegisterComponent /> : <LoginComponent login={this.login} />}
          </div>
        }
      </div>
    );
  }
}

class LoginComponent extends Component {
  constructor (props){
    super(props);
    this.test = this.test.bind(this);
    this.login = this.login.bind(this);
  }
  login() {
    {
      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: document.getElementById('loginEmail').value,
          password: document.getElementById('loginPassword').value,
        })
      }).then((response) => {
        if (response.status === 401) {
          return alert('Wrong credentials.');
        }
        if (response.status === 200) {
          return this.props.login();
        }
      }).catch((error) => {
        console.log('Fucking Error: ' + error);
      });
    }
  }
  render() {
    return (
      <div>
        <div className="prompt">Login.</div>
        <div>Email: <input id="loginEmail" type="text"/></div>
        <div>Password: <input id="loginPassword" type="password"/></div>
        <button onClick={this.login} className="btn btn-primary">Login</button>
      </div>
    );
  }
}

class RegisterComponent extends Component {
  register() {
    {
      if (document.getElementById('password').value != document.getElementById('confirmPassword').value) {
        return alert('Passwords do not match.');
      }
      fetch('/api/register', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
        })
      }).then(response => {
        if(response.status === 200) {
          return alert('Success! Please, log in to continue.');
        }
        return response.json();
      }).then(data => {
        if (data && data.error) {
          alert(data.error);
        }
      }).catch((error) => {
        console.log('Fucking Error: ' + error);
      });
    }
  }
  render() {
    return (
      <div>
        <div>Register.</div>
        <div>Name: <input id="name" type="text"/></div>
        <div>Email: <input id="email" type="text"/></div>
        <div>Password: <input id="password" type="password"/></div>
        <div>Confirm password: <input id="confirmPassword" type="password"/></div>
        <button onClick={this.register} className="btn btn-secondary">Register</button>
      </div>
    );
  }
}

export default App;
