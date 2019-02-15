import React, { Component } from "react";
import 'whatwg-fetch';
import ReactAutocomplete from 'react-autocomplete';
import App from './App';

class Main extends Component {
    constructor() {
        super();

        this.state = {
            email: 'Not Chosen',
            loggedIn : true,
            user: {},
            userList: [],
            transactions: []
        };

        this.getUser = this.getUser.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.getUserList = this.getUserList.bind(this);
        this.getTransactions = this.getTransactions.bind(this);
        this.pay = this.pay.bind(this);
        this.logOut = this.logOut.bind(this);
        this.sortTable = this.sortTable.bind(this);

        this.updateInfo();
    }
    logOut() {
        fetch('/api/logout', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
        }).then((response) => {
            if (response.status === 200) {
                this.setState({loggedIn: false});
            } else {
                return response.json();
            }
        }).then(data => {
            if (data && data.error) {
                alert(data.error);
            }
        }).catch((error) => {
            console.log('Error: ' + error);
        });
    }
    updateInfo () {
        this.getUser();
        this.getUserList();
        this.getTransactions();
    }
    getUser() {
        fetch('/api/info', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
            }).then(response => {
                return response.json();
            }).then(data => {
                if (data && data.error) {
                    alert(data.error);
                } else if (data) {
                    this.setState({
                        user: data
                    });
                }
            }).catch((error) => {
                console.log('Error: ' + error);
        });
    }
    getUserList() {
        fetch('/api/users', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
            }).then(response => {
                return response.json();
            }).then(data => {
                if (data && data.error) {
                    alert(data.error);
                } else if (data) {
                    this.setState({
                        userList: data
                    });
                }
            }).catch((error) => {
                console.log('Error: ' + error);
        });
    }
    getTransactions() {
        fetch('/api/transactions', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
            }).then(response => {
                return response.json();
            }).then(data => {
                if (data && data.error) {
                    alert(data.error);
                } else if (data) {
                    this.setState({
                        transactions: data
                    });
                }
            }).catch((error) => {
                console.log('Error: ' + error);
        });
    }
    sortTable(n, isInt) {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById("table");
        switching = true;
        dir = "asc"; 
        while (switching) {
          switching = false;
          rows = table.rows;
          for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if(isInt) {
                    if (+x.innerHTML > +y.innerHTML) {
                        shouldSwitch = true;
                        break;
                      }
                } else {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                }
            } else if (dir == "desc") {
                if(isInt) {
                    if (+x.innerHTML < +y.innerHTML) {
                        shouldSwitch = true;
                        break;
                      }
                } else {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
          }
          if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++; 
          } else {
            if (switchcount == 0 && dir == "asc") {
              dir = "desc";
              switching = true;
            }
          }
        }
    }
    pay() {
        fetch('/api/pay', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              payee: this.state.payee,
              amount: document.getElementById('amount').value,
            })
        }).then((response) => {
            if (response.status === 200) {
                this.updateInfo();
                alert('Success!');
            } else {
                return response.json();
            }
        }).then(data => {
            if (data && data.error) {
                alert(data.error);
            }
        }).catch((error) => {
            console.log('Error: ' + error);
        });
    }
    render() {
        if (this.state.loggedIn) {
            return (
                <div>
                    <button onClick={this.logOut} className='btn btn-secondary'>Log Out</button>
                    <h4>Name: {this.state.user.name}</h4>
                    <h4>Balance: {this.state.user.balance}</h4>
                    <div className="panel panel-default">
                        <div className="panel-heading">Payment</div>
                        <div className="panel-body">
                            <div><label>Payee: </label><ReactAutocomplete
                                items={this.state.userList}
                                shouldItemRender={(item, value) => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1}
                                getItemValue={item => item.name}
                                renderItem={(item, highlighted) =>
                                <div
                                    key={item.id}
                                    style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}}
                                >
                                    {item.name}
                                </div>
                                }
                                value={this.state.value}
                                onChange={e => this.setState({ value: e.target.value })}
                                onSelect={(value, item) => this.setState({ value, payee: item.id, email: item.email })}
                            /></div>
                            <div>Email: {this.state.email}</div>
                            <div><label>Amount: </label><input id='amount' type='number'/></div>
                        </div>
                        <button onClick={this.pay} className='btn btn-primary'>Pay</button>
                    </div>
                    <table id="table" className='table'>
                        <thead>
                        <tr>
                            <td onClick={() => this.sortTable(0, false)}>Payer</td>
                            <td onClick={() => this.sortTable(1, false)}>Payee</td>
                            <td onClick={() => this.sortTable(2, false)}>Date</td>
                            <td onClick={() => this.sortTable(3, true)}>Amount</td>
                            <td onClick={() => this.sortTable(4, true)}>Balance</td>
                        </tr>
                        </thead>
                        <tbody>
                    {this.state.transactions.map(value => {
                        return (
                            <tr key={value.id}>   
                                <td>{value.payerName}</td>
                                <td>{value.correspondentName}</td>
                                <td>{(new Date(value.date)).toLocaleDateString('en-US')}</td>
                                <td>{value.amount}</td>
                                <td>{value.balance}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                    </table>
                </div> 
            );
        } else {
            return (
                <App />
            )
        }
    }
}
 
export default Main;