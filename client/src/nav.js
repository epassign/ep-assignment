import { Link } from "react-router-dom";

import Cookies from 'js-cookie';

class Nav extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			menu_open: false,
		}
	}
	logout(e) {
		console.log('logout...')
		
		Cookies.remove('sid')
		// @todo: call api to delete server session
		location.href = '/'

		e.stopPropagation()
		e.preventDefault()
		return false;
	}

	render() {
		return (
			<nav class="navbar navbar-expand-lg navbar-light" style={{backgroundColor: '#abd7f1', }}>
				<div class="container-fluid"> 
					<a class="navbar-brand" href="#">
						
					</a> 
					<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation"> 
						<span class="navbar-toggler-icon"></span> 
					</button>
					<div class="collapse navbar-collapse" id="navbarNavAltMarkup">
						<div class="navbar-nav ml-auto"> 
							<Link class="nav-link active" to="/">HOME</Link> 
						</div>
					</div>
				</div>

				<div class="container-fluid justify-content-end">
					{
						this.props.auth === false ?
						<Link class="btn btn-sm btn-primary" style={{minWidth: 100,	}} to="/login">
							Login
						</Link>
						:
						<div class="dropdown">
							<button 
								class="btn btn-sm btn-secondary dropdown-toggle" 
								style={{minWidth: 150,	textAlign: 'left' }} 
								onBlur={ () => this.setState({menu_open: false}) }
								onClick={ () => this.setState({menu_open: !this.state.menu_open}) }
							>
								<img src={this.props.auth.avatar} class="rounded-circle" width="30" /> {this.props.auth.name}
							</button>
							<ul class={ "dropdown-menu dropdown-menu-dark dropdown-menu-end" + (this.state.menu_open ? ' show' : '') } aria-labelledby="dropdownMenuLink">
								<li><a class="dropdown-item" onMouseDown={this.logout.bind(this)}>Logout</a></li>
							</ul>
						</div>
					}
				</div>
			</nav>
		)
	}
}

export default Nav;