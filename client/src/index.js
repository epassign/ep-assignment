
import React from 'react';
import ReactDOM from 'react-dom';

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";

import { api_get } from './common';

import Nav from './nav';
import Home from './home';
import Account from './account';
import Login from './login';
import Signup from './signup';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			auth: null,
		}
	}

	componentDidMount() {
		api_get('/v1/auth', (err, data ) => {
			if (err)
				return this.setState({auth: false});

			this.setState({
				auth: data.user,
				guess: data.guess,
			})
			console.log(data)
		})
	}

	render() {
		return (

			<Router>

					{
						this.state.auth !== null ?
						<Switch>
							<Route exact path="/">
								<Nav auth={this.state.auth} />
								<Home auth={this.state.auth} guess={this.state.guess} />
							</Route>
							<Route path="/login">
								<Login />
							</Route>
							<Route path="/signup">
								<Signup />
							</Route>
							<Route path="/account">
								<Nav auth={this.state.auth} />
								<Account auth={this.state.auth} guess={this.state.guess} />
							</Route>
						</Switch>
						: 
						<div> {/* show loading maybe */}</div>
					}
			</Router>
		)
	}
}

window.onload = function() {
	ReactDOM.render(<App />, document.body );
}