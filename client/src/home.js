
import BTCChart from './btc_chart_with_player';

class Home extends React.Component {
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
								Hall of Fame
							</div>
							<div class="card-body">

							</div>
						</div>
					</div>
					<div class="col">
						<div class="card">
							<div class="card-header">
								Recents
							</div>
							<div class="card-body">

							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Home