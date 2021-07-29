
import { api_get } from './common';

class Recents extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			recents: []
		}
	}

	componentDidMount() {
		api_get('/v1/recents', ( err, data ) => {
			if (err)
				return;

			this.setState({ recents: data.recents }) 
		})
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