
import Chart from "react-apexcharts";
import Guess from './guess';

import { api_get } from './common';

// this is hardcoded here and in btc_history on insert handler
const global_realtime_channel = '367544a50c6f7d9b454fbc14114833d7'

class BTCChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currency: 'USD',
			current: {
				usd: null,
				eur: null,
			},

			chart_options: {
				chart: {
					toolbar: {
						show: false
					}
				},
				stroke: {
					width: [1, 0, 0]
				},
				xaxis: {
					type: 'datetime',
				},
				dataLabels: {
					enabled: false
				},

			},
			usd_chart_series: [
				{
					data: []
				}
			],
			eur_chart_series: [
				{
					data: []
				}
			],

		}
		this.refresh = this.refresh.bind(this)
	}

	refresh() {
		api_get('/v1/history', ( err, data ) => {
			if (err)
				return;

			this.setState({
				usd_chart_series: [
					{
						data: data.history.usd
					}
				],
				eur_chart_series: [
					{
						data: data.history.eur
					}
				],
				current: data.current,
			})
		})
	}
	componentDidMount() {
		this.refresh()

		var global_channel = pusher.subscribe( global_realtime_channel );
		global_channel.bind('btc', (data) => {
			console.log("rates have changed")
			this.refresh()
		});
	}

	render() {
		return (
			<div class="card">
				<div class="card-header">

					BTC/{this.state.currency}

					<div class="btn-group btn-group-sm float-end">
						<button class={"btn " + ( this.state.currency === "USD" ? "btn-primary" : "btn-outline-primary")} onClick={() => this.setState({ currency: 'USD'})}>USD</button>
						<button class={"btn " + ( this.state.currency === "EUR" ? "btn-primary" : "btn-outline-primary")} onClick={() => this.setState({ currency: 'EUR'})}>EUR</button>
					</div>


				</div>
				<div class="card-body" style={{ position: 'relative', height: 350, }}>

					<div style={{ width: " calc( 100% - 300px )", height: 300 }}>
						<Chart 
							type="area"
							height={300}
							options={this.state.chart_options}
							series={
								this.state.currency === 'USD' ?
								this.state.usd_chart_series
								:
								this.state.eur_chart_series
							}
						/>

					</div>

					<div style={{position: 'absolute', top: 15, right: 15, height: 300, width: 300, }}>

						<Guess auth={this.props.auth} current={this.state.current} guess={this.props.guess} />

					</div>

				</div>
			</div>
		)
	}
}

export default BTCChart;