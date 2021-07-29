
import { Link } from "react-router-dom";

import { api_put } from './common';

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)
import ReactTimeAgo from 'react-time-ago'



class Guess extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	guess_dn() {
		api_put('/v1/guess', {
			next: 'down',
			rate: this.props.current.usd,
		}, ( err, data ) => {
			if (err)
				return alert('Failed: ' + (err.errorMessage || err.errorCode) )

			console.log( data )
		})
		
	}

	guess_up() {
		api_put('/v1/guess', {
			next: 'up',
			rate: this.props.current.usd,
		}, ( err, data ) => {
			if (err)
				return alert('Failed: ' + (err.errorMessage || err.errorCode) )

			console.log( data )
		})
	}

	render() {
		return (
			<div class="card border-primary" style={{ height: "100%", }}>
				<div class="card-header">Guess BTC's next move</div>
				<div class="card-body">
				<div class="text-center">

					<div style={{marginTop: 20, }}>
						<span class="badge rounded-pill bg-primary">
							{this.props.current.usd}
						</span>
						&nbsp; 🔜  &nbsp;
						<span class="badge rounded-pill bg-secondary">
							?
						</span>
					</div>




					{
						this.props.auth === false ?
						<p class="card-text">
							Please <Link to="/signup">signup</Link> or <Link to="/login">login</Link> to play
						</p>
						: 
						<div>
							<div style={{marginTop: 20, }}>	
								Will it go ?
							</div>

							{
								this.props.guess ?
									<div>
										
										<div class="btn-group btn-group-sm" style={{marginTop: 20, }}>
											<button type="button" class={"btn disabled " + ( this.props.guess.next === "down" ? "btn-primary" : "btn-outline-primary") } style={{width: 100, }}>DOWN</button>
											<button type="button" class={"btn disabled " + ( this.props.guess.next === "up"   ? "btn-primary" : "btn-outline-primary") } style={{width: 100, }}>UP</button>
										</div>

										<div>
											<ReactTimeAgo date={new Date(this.props.guess.created_at)} locale="en-US" timeStyle="twitter"/>
										</div>

									</div>
								:
									<div class="btn-group btn-group-sm" style={{marginTop: 20, }}>
										<button type="button" class="btn btn-outline-primary" style={{width: 100, }} onClick={this.guess_dn.bind(this)}>DOWN</button>
										<button type="button" class="btn btn-outline-primary" style={{width: 100, }} onClick={this.guess_up.bind(this)}>UP</button>
									</div>
							}



						</div>
					}

					</div>
				</div>
			</div>




		)
	}
}

export default Guess;