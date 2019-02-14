import React, { Component } from "react";
import 'whatwg-fetch';
import ReactAutocomplete from 'react-autocomplete';
import App from './App';

class Main extends Component {
    constructor() {
        super();

        this.state = {
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
                            <div>Payee: <ReactAutocomplete
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
                                onSelect={(value, item) => this.setState({ value, payee: item.id })}
                            /></div>
                            <div>Amount: <input id='amount' type='number'/></div>
                        </div>
                        <button onClick={this.pay} className='btn btn-primary'>Pay</button>
                    </div>
                    <table className='table'>
                        <thead>
                        <tr>
                            <td>Payer</td>
                            <td>Payee</td>
                            <td>Date</td>
                            <td>Amount</td>
                            <td>Balance</td>
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