
import BTCChart from './btc_chart_with_player';

import Recents from './recents';
import Leaderboard from './leaderboard';

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
						<Leaderboard />
					</div>
					<div class="col">
						<Recents />
					</div>
				</div>
			</div>
		)
	}
}

export default Home