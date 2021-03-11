import React from "react";
import axios from "axios";
import "../styles.css";

class LoginPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isCreate: false,
      isSuccess: false,
      responseMessage: '',
      fields: {
         email: '', password: '',
         name: '', role: 'Staff', 
         address: '', phone: '',
      },
    };
  }

  handleFieldChange(e) {
    this.setState( (prevState) => ({
      ...prevState, 
      fields: { 
        ...prevState.fields, 
        [e.target.name]: e.target.value,
      }
    }));
  }

  showInitialUserFields() { this.setState({isCreate: true , responseMessage: ''}); }
  hideInitialUserFields() { this.setState({isCreate: false, responseMessage: ''}); }

  requestSignUp() {
    const curUrl = "/premain/" + (this.state.isCreate ? "signup" : "signin");
    
    axios.post(curUrl, this.state.fields)
    .then( (response) => {
      if (response.data.status == 200) {
        this.setState({ isSuccess: true });
        this.setState({ responseMessage: "User created, please sign in with your password" });
        setTimeout( () => window.location.reload(), 2000);
      } else {
        this.setState({ responseMessage: response.data });
      }
    }, (error) => {
      this.setState({ responseMessage: error.message });
    });
  }

  requestSignIn() {
    const curUrl = "/premain/" + (this.state.isCreate ? "signup" : "signin");
    var curData = {
        email: this.state.fields.email, 
        password: this.state.fields.password,
    };
    
    axios.post(curUrl, curData)
    .then((response) => {
      if (response.data) {
        this.setState({ isSuccess: true });
        this.setState({ responseMessage: "Sign in success, you will be directed to the main page." });
        localStorage.setItem('loginToken', response.data);
        localStorage.setItem('loginEmail', this.state.fields.email);
        setTimeout( () => window.location.reload(), 2000);
      }
    }, (error) => {
      this.setState({ responseMessage: error.message });
      console.log(error.message);
    });
  }

  render() {
    return (
      <div>
        <header>
          <h1>Invoice</h1>
          <p>Please login with your email</p>
        </header>

        <nav>
          <div onClick={this.hideInitialUserFields.bind(this)}>Sign In</div>
          <div onClick={this.showInitialUserFields.bind(this)}>Sign Up</div>
        </nav>

        <div 
          className="signError"
          style={{
            display: this.state.responseMessage? 'block' : 'none',
            backgroundColor: this.state.isSuccess ? 'green' : 'red',
          }}
        >
          {this.state.responseMessage}
        </div>

        <main>
          <input className="loginInput" type="text" name="email" placeholder="Email" onChange={this.handleFieldChange.bind(this)} />
          <input className="loginInput" type="password" name="password" placeholder="Password" onChange={this.handleFieldChange.bind(this)} />
          <span id="signUpFields" style={{display: this.state.isCreate ? 'inline' : 'none'}}>
            <input className="loginInput" type="text" name="name" placeholder="Full Name" onChange={this.handleFieldChange.bind(this)} />
            <input className="loginInput" type="text" name="address" placeholder="Address" onChange={this.handleFieldChange.bind(this)} />
            <input className="loginInput" type="text" name="phone" placeholder="Phone" onChange={this.handleFieldChange.bind(this)} />
            <div className="roleSelection">
              <h6 style={{margin: 20}}>Role</h6>
              <select name="role" onChange={this.handleFieldChange.bind(this)}>
                <option value="Staff">Staff</option>
                <option value="Lead">Lead</option>
                <option value="Director">Director</option>
              </select>
            </div>
          </span>
          <input 
            type="button" 
            id={`sign${this.state.isCreate ? 'Up' : 'In'}Button`}
            value={`Sign ${this.state.isCreate ? 'Up' : 'In'}`}
            onClick={
              this.state.isCreate ? 
                this.requestSignUp.bind(this): this.requestSignIn.bind(this)
            }
          />
        </main>

      </div>
    );
  }
}

export default LoginPage;