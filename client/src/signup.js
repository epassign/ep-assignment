
import { api_put } from './common';
import Cookies from 'js-cookie';

class Signup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			username: '',
			password: '',
		}
	}

	submit(e) {

		e.preventDefault()

		this.setState({ err: undefined })
		api_put('/v1/account', {
			name: this.state.name,
			username: this.state.username,
			password: this.state.password,
		}, ( err, data ) => {
			if (err)
				return this.setState({ err: err.errorMessage || err.errorCode })

			// save cookie and redirect
			Cookies.set('sid', data.session_id, { path: '/', expires: 30 });
			location.href = "/"

		})
	}

	render() {
		return (
			<section class="vh-90" >
				<div class="container py-5 h-100">
					<div class="row d-flex justify-content-center align-items-center h-100">
						<div class="col-12 col-md-8 col-lg-6 col-xl-5">
							<div class="card shadow-2-strong" style={{ borderRadius: '1rem', backgroundColor: '#efefef', }}>
								<div class="card-body p-5">

									<form onSubmit={this.submit.bind(this)}>

										<h3 class="mb-4 text-center">Signup</h3>

										<h6 class="mb-4 text-center">Already have an account ? <a href="/login">Login</a></h6>

										<div class="form-outline mb-3">
											<label class="form-label" for="name">Full Name</label>
											<input type="text" id="name" class="form-control form-control-md" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value }) } style={{ textTransform: 'capitalize' }} />
										</div>

										<div class="form-outline mb-3">
											<label class="form-label" for="username">Desired Username</label>
											<input type="text" id="username" class="form-control form-control-md" value={this.state.username} onChange={(e) => this.setState({ username: e.target.value }) } style={{ textTransform: 'lowercase' }} />
										</div>

										<div class="form-outline mb-3">
											<label class="form-label" for="password">Password</label>
											<input type="password" id="password" class="form-control form-control-md" value={this.state.password} onChange={(e) => this.setState({ password: e.target.value }) } />
										</div>

										<div class="d-grid mx-auto" style={{height: '32px', }}>
											<div class="err text-center" style={{fontSize: '10px', color: 'red', lineHeight: '32px', }}>
											{ this.state.err }
											</div>
										</div>

										<div class="d-grid gap-2 mx-auto">
											<button class="btn btn-primary btn-md" type="submit" onClick={this.submit.bind(this)}>Create Account</button>
										</div>
									</form>

								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		)
	}
}

export default Signup