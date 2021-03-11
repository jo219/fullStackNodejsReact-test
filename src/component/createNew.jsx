import React from "react";
import axios from "axios";
import "../styles.css";

class CreateNew extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      curId: 'IV001',
      itemToAdd: {
        id: '',
        name: '',
        qty: 0,
        price: 0,
      },
      itemsToSubmit: [],
      subTotal: 0,
      isSuccess: false,
      responseMessage: '',
    };
  }

  componentWillMount() {
    this.requestLastInvoiceId();
  }

  handleFieldChange(e) {
    this.setState( (prevState) => ({
      ...prevState,
      itemToAdd: { 
        ...prevState.itemToAdd, 
        [e.target.name]: e.target.value,
      }
    }));
  }

  addItemToList() {
    this.setState( (prevState) => ({
      ...prevState,
      itemsToSubmit: [...prevState.itemsToSubmit, this.state.itemToAdd]
    }));
    this.setState( (prevState) => ({
      subTotal: prevState.subTotal += (this.state.itemToAdd.qty * this.state.itemToAdd.price),
    }));

    this.setState({
      itemToAdd: {
        id: '',
        name: '',
        qty: 0,
        price: 0,
      }
    });
  }

  requestLastInvoiceId() {
    axios.get('main/lastInvoiceId')
    .then((response) => {
      if (response.data) {
        var curId = (response.data.id + 1).toString();
        var zeros = '';
        for (var i=0; i < (4 - curId.length); i++) {
          zeros += '0';
        }
        curId = 'IV' + zeros + curId;
        this.setState({curId: curId});
      }
    }, (error) => {
      this.setState({ responseMessage: error.message });
      console.log(error.message);
    });
  }

  getTodaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    return today
  }

  requestSubmit() {
    const curData = {
      customer: this.props.loginUserInfo.name,
      items: this.state.itemsToSubmit,
      total: (this.state.subTotal * 0.9),
    }

    axios.post('/main/newInvoice', curData)
    .then((response) => {
      if (response.data) {
        this.setState({ isSuccess: true });
        this.setState({ responseMessage: "Invoice created" });
        setTimeout( () => window.location.reload(), 2000);
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

      <h4>Company Inc.</h4>

      <table className="profileTable">
        <tr> <td>Customer Name</td>    <td>{this.props.loginUserInfo.name}</td>    <td>Invoice #</td> <td>{ this.state.curId } (may change due submission)</td> </tr>
        <tr> <td>Customer Address</td> <td>{this.props.loginUserInfo.address}</td> <td>Invoice Date</td> <td>{ this.getTodaysDate() }</td></tr>
        <tr> <td>Customer Phone</td>   <td>{this.props.loginUserInfo.phone}</td>   <td></td><td></td> </tr>
      </table>

        <input className="createInvoiceFields" type="text" name="id" value={this.state.itemToAdd.id} placeholder="Item ID" onChange={this.handleFieldChange.bind(this)} />
        <input className="createInvoiceFields" type="text" name="name" value={this.state.itemToAdd.name} placeholder="Item Name" onChange={this.handleFieldChange.bind(this)} />
        <input className="createInvoiceFields" type="number" name="qty" value={this.state.itemToAdd.qty} placeholder="Qty" onChange={this.handleFieldChange.bind(this)} />
        <input className="createInvoiceFields" type="number" name="price" value={this.state.itemToAdd.price} placeholder="Unit Price" onChange={this.handleFieldChange.bind(this)} />

        <input type="button" value="Add" onClick={this.addItemToList.bind(this)} />
        <input type="button" value="Submit" onClick={this.requestSubmit.bind(this)} />

        <table className="invoiceTable">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Item Name</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody> { this.state.itemsToSubmit.map((data) =>
            <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.name}</td>
              <td>{data.qty}</td>
              <td>{data.price}</td>
              <td>{data.qty * data.price}</td>
            </tr>
          )}
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td>Sub Total</td>
              <td></td> <td></td> 
              <td>{ this.state.subTotal }</td>
            </tr>
            <tr>
              <td></td>
              <td>Tax 10%</td>
              <td></td> <td></td> 
              <td>{ (this.state.subTotal * 0.1).toFixed(2) }</td>
            </tr>
            <tr>
              <td></td>
              <td>Total</td>
              <td></td> <td></td> 
              <td>{ (this.state.subTotal * 0.9).toFixed(2) }</td>
            </tr>
          </tfoot>
        </table>

      </div>
    );
  }
}

export default CreateNew;