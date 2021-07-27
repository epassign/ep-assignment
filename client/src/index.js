
import React from 'react';
import ReactDOM from 'react-dom';

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";

import Home from './home';
import Login from './login';
import Signup from './signup';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	render() {
		return (

			<Router>
				<div>
					<nav>
						<ul>
							<li>
								<Link to="/">Home</Link>
							</li>
							<li>
								<Link to="/login">Login</Link>
							</li>
							<li>
								<Link to="/signup">Signup</Link>
							</li>
						</ul>
					</nav>

					<Switch>
						<Route exact path="/">
							<Home />
						</Route>
						<Route path="/login">
							<Login />
						</Route>
						<Route path="/signup">
							<Signup />
						</Route>
					</Switch>
				</div>
			</Router>

		)
	}
}

window.onload = function() {
	ReactDOM.render(<App />, document.body );
}