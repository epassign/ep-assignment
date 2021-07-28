
class Signup extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<section class="vh-90" >
				<div class="container py-5 h-100">
					<div class="row d-flex justify-content-center align-items-center h-100">
						<div class="col-12 col-md-8 col-lg-6 col-xl-5">
							<div class="card shadow-2-strong" style={{ borderRadius: '1rem', backgroundColor: '#efefef', }}>
								<div class="card-body p-5">

									<h3 class="mb-4 text-center">Signup</h3>

									<h6 class="mb-4 text-center">Already have an account ? <a href="/login">Login</a></h6>

									<div class="form-outline mb-3">
										<label class="form-label" for="name">Name</label>
										<input type="text" id="name" class="form-control form-control-md" />
									</div>

									<div class="form-outline mb-3">
										<label class="form-label" for="username">Username</label>
										<input type="text" id="username" class="form-control form-control-md" />
									</div>

									<div class="form-outline mb-3">
										<label class="form-label" for="password">Password</label>
										<input type="password" id="password" class="form-control form-control-md" />
									</div>

									<div class="d-grid gap-2 mx-auto">
										<button class="btn btn-primary btn-md" type="submit">Create Account</button>
									</div>
									

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