import React from "react";
import axios from "axios";
import "../styles.css";

class ByEmployee extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      invoices: [],
    };
  }

  componentWillMount() {
    this.getByUser();
    console.log(this.state.invoices);
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

  getByUser() {
    axios.get('main/getByUser')
    .then((response) => {
      if (response.data) {
        this.setState({ invoices: response.data });
      }
    }, (error) => {
      this.setState({ responseMessage: error.message });
      console.log(error.message);
    });
  }

  render() {
    return (
      <div style={{display: this.props.display}}>

        <div 
          className="signError"
          style={{
            display: this.state.responseMessage? 'block' : 'none',
            backgroundColor: this.state.isSuccess ? 'green' : 'red',
          }}
        >
          {this.state.responseMessage}
        </div>

        <table className="invoiceTable">
          <thead><tr>
            <th>Customer Name</th>
            <th>Customer Phone</th>
            <th>Last Invoice ID</th>
            <th>Last Invoice Date</th>
            <th>Last Invoice Amount</th>
          </tr></thead>
          <tbody>{ this.state.invoices.map((data) => 
            <tr key={ data.name }>
              <td>{ data.name }</td>
              <td>{ data.phone }</td>
              <td>IV { data.invoices.id }</td>
              <td>{ data.invoices.date }</td>
              <td>$ { data.invoices.total }</td>
            </tr>
          ) }</tbody>
        </table>

      </div>
    );
  }
}

export default ByEmployee;