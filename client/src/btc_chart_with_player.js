
import Chart from "react-apexcharts";
import Guess from './guess';

import { api_get } from './common';

class BTCChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
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
			chart_series: [
				{
					data: []
				}
			],
		}
	}

	componentDidMount() {
		api_get('/v1/history', ( err, data ) => {
			if (err)
				return;

			this.setState({
				chart_series: [
					{
						data: data.history.usd
					}
				],
				current: data.current,
			})
		})
	}

	render() {
		return (
			<div class="card">
				<div class="card-header">
					BTC/USD
				</div>
				<div class="card-body" style={{ position: 'relative', height: 350, }}>

					<div style={{ width: " calc( 100% - 300px )", height: 300 }}>
						<Chart 
							type="area"
							height={300}
							options={this.state.chart_options}
							series={this.state.chart_series}
						/>

					</div>

					<div style={{position: 'absolute', top: 15, right: 15, height: 300, width: 300, border: '1px solid #ccc' }}>

						<Guess auth={this.props.auth} current={this.state.current} guess={this.props.guess} />

					</div>

				</div>
			</div>
		)
	}
}

export default BTCChart;