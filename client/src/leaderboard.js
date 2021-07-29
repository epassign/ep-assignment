
import { api_get } from './common';

// this is hardcoded here and in btc_history on insert handler
const global_realtime_channel = '367544a50c6f7d9b454fbc14114833d7'

class Leaderboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			top: []
		}
		this.refresh = this.refresh.bind(this)
	}

	refresh() {
		api_get('/v1/top', ( err, data ) => {
			if (err)
				return;

			this.setState({ top: data.top }) 
		})
	}
	componentDidMount() {
		this.refresh()

		var global_channel = pusher.subscribe( global_realtime_channel );
		global_channel.bind('top', (data) => {
			this.refresh()
		});
	}
	render() {
		return (
			<div class="card">
				<div class="card-header">
					🥇 Leaderboard
				</div>
				<div class="card-body">

				<table class="table">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">User</th>
							<th scope="col">Name</th>
							<th scope="col">Coins</th>
						</tr>
					</thead>
					<tbody style={{fontSize: 12,}}>
						{
							this.state.top.map((r, idx) => {
								return (
									<tr>
										<td>{ idx + 1 }</td>
										<td>@{r.username}</td>
										<td>{r.name}</td>
										<td align="center">{r.coins}</td>
									</tr>
								)
							})
						}
					</tbody>
				</table>
				</div>
			</div>
		)
	}
}

export default Leaderboard;