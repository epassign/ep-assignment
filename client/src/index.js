
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

				<nav class="navbar navbar-expand-lg bg-dark">
					<div class="container-fluid"> 
						<a class="navbar-brand" href="#">
							
						</a> 
						<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation"> 
							<span class="navbar-toggler-icon"></span> 
						</button>
						<div class="collapse navbar-collapse" id="navbarNavAltMarkup">
							<div class="navbar-nav ml-auto"> 
								<Link class="nav-link active" to="/">HOME</Link> 

								<Link class="nav-link" to="/login">Login</Link>
								<Link class="nav-link" to="/signup">Signup</Link>

							</div>
						</div>
					</div>

					<form class="container-fluid justify-content-end">
						<Link class="btn btn-sm btn-outline-secondary" to="/account"> <img src="https://i.imgur.com/C4egmYM.jpg" class="rounded-circle" width="30" /> Account</Link>
					</form>
				</nav>



				<div class="container">
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