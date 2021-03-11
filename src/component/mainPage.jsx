import React from "react";
import axios from "axios";
import LastIssued from "./lastIssued";
import ByEmployee from "./byEmployee";
import CreateNew from "./createNew";
import "../styles.css";

class MainPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      userInfo: {},
      pages: {
        lastIssued: "block",
        byEmployee: "none",
        createNew: "none",
      }
    };
  }

  componentWillMount() {
    this.requestUserInfo();
    this.byRoleFeaturesHide();
  }

  requestUserInfo() {
    axios.get('/main/userInfo/' + localStorage.getItem('loginEmail'))
    .then((response) => {
      if (response.data) {
        this.setState({userInfo: response.data});
      }
    }, (error) => {
      console.log(error.message);
    });
  }

  byRoleFeaturesHide() {
    ;
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

  goToPage(e) {
    this.setState( (prevState) => ({
      ...prevState,
      pages: {
        lastIssued: "none",
        byEmployee: "none",
        createNew: "none",
      }
    }));
    this.setState( (prevState) => ({
      ...prevState,
      pages: {
        ...prevState.pages,
        [e.target.id]: "block",
      }
    }));
  }

  signOut() {
    localStorage.removeItem('loginToken');
    localStorage.removeItem('loginEmail');
    window.location.reload();
  }

  render() {
    return (
      <div>
        <input type="button" value="Sign Out" onClick={this.signOut.bind(this)} id="signOutButton" />
        <header>
          <h1>Invoice</h1>
          <p>Welcome, { this.state.userInfo.name }</p>
        </header>

        <nav>
          <div id="lastIssued" onClick={this.goToPage.bind(this)}>Last Issued</div>
          <div id="byEmployee" onClick={this.goToPage.bind(this)}>By Employee</div>
          <div id="createNew"  onClick={this.goToPage.bind(this)}>Create New Issue</div>
        </nav>

        <LastIssued display={this.state.pages.lastIssued} />
        <ByEmployee display={this.state.pages.byEmployee} />
        <CreateNew loginUserInfo={this.state.userInfo} display={this.state.pages.createNew} />

      </div>
    );
  }
}

export default MainPage;