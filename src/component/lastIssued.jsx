import React from "react";
import axios from "axios";
import "../styles.css";

class LastIssued extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isSuccess: false,
      responseMessage: '',
      invoices: [
        {
          customer: "linuxize",
          total: 875.6640000000001,
          date: Date.now(),
          id: 1,
        }

      ],
    };
  }

  componentWillMount() {
    this.getLastIssued();
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

  getLastIssued() {
    axios.get('main/getLastTwenty')
    .then((response) => {
      if (response.data) {
        this.setState({ invoices: response.data });
      }
    }, (error) => {
      this.setState({ responseMessage: error.message });
      console.log(error.message);
    });
  }

  requestInvoiceDelete(e) {
    axios.delete('main/invoiceDelete/' + e.target.name)
    .then((response) => {
      if(response.data) {
        this.setState({ isSuccess: true, responseMessage: response.data });
        setTimeout( () => window.location.reload(), 2000);
      }
    }, (error) => {
        this.setState({responseMessage: error.message});
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
          <thead>
          <tr>
            <th>IV. ID</th>
            <th>Customer Name</th>
            <th>Total Invoice Amount</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody> { this.state.invoices.map((data) =>
            <tr key={data.id}>
              <td><a href={`/main/invoice/${data.id}`}>IV {data.id}</a></td>
              <td>{data.customer}</td>
              <td>{(data.total).toFixed(2)}</td>
              <td>[<a href="#">Edit</a>] [<a href="#" name={data.id} onClick={this.requestInvoiceDelete.bind(this)}>Delete</a>]</td>
            </tr>
          )}
          </tbody>
        </table>

      </div>
    );
  }
}

export default LastIssued;