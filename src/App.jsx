import React from "react";
import LoginPage from "./component/loginPage";
import MainPage from "./component/mainPage";
import "./styles.css";

export default class App extends React.Component {
  state = {
    isLogedIn: false,
  };

  componentDidMount() {
    const loginToken = localStorage.getItem('loginToken');
    if(loginToken) {
      this.setState({isLogedIn: true});
    } else {
      this.setState({isLogedIn: false});
    }
  }

  render() {
    if (this.state.isLogedIn) {
      return (<MainPage/>);
    } else {
      return (<LoginPage/>);
    }
  }
}