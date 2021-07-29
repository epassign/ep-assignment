
import BTCChart from './btc_chart_with_player';

class Account extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div class="container">
				<div class="row mt-5">
					<div class="col">
						<BTCChart auth={this.props.auth} guess={this.props.guess} />
					</div>
				</div>
				<div class="row mt-5">
					<div class="col">
						<div class="card">
							<div class="card-header">
								Your Recent Guesses
							</div>
							<div class="card-body">
								Not Implemented yet, go to home page
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Account