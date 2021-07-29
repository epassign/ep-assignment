
import { api_get } from './common';

// this is hardcoded here and in btc_history on insert handler
const global_realtime_channel = '367544a50c6f7d9b454fbc14114833d7'

class Recents extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			recents: []
		}
		this.refresh = this.refresh.bind(this)
	}

	refresh() {
		api_get('/v1/recents', ( err, data ) => {
			if (err)
				return;

			this.setState({ recents: data.recents }) 
		})
	}
	componentDidMount() {

		this.refresh()

		var global_channel = pusher.subscribe( global_realtime_channel );
		global_channel.bind('guess', (data) => {
			this.refresh()
		});
	}
	render() {
		return (
			<div class="card">
				<div class="card-header">
					🕒  Recents
				</div>
				<div class="card-body">


				<table class="table">
					<thead>
						<tr>
							<th scope="col">User</th>
							<th scope="col">Open</th>
							<th scope="col">Close</th>
							<th scope="col">Guess</th>
							<th scope="col">Coins</th>
						</tr>
					</thead>
					<tbody style={{fontSize: 12,}}>
						{
							this.state.recents.map((r, idx) => {
								return (
									<tr>
										<td>
											{ 
												(r.user || {}).username ? ('@' + r.user.username) : r.user_id 
											}
										</td>
										<td>{r.initial_rate}</td>
										<td>{r.final_rate}</td>
										<td align="center">
											{r.next === 'up' ? '↑' : '↓' }
										</td>
										<td align="right">{r.coins > 0 ? '+' : '' }{r.coins} 💰 </td>
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

export default Recents;