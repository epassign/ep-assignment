
class Signup extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<section class="vh-100" >
				<div class="container py-5 h-100">
					<div class="row d-flex justify-content-center align-items-center h-100">
						<div class="col-12 col-md-8 col-lg-6 col-xl-5">
							<div class="card shadow-2-strong" style={{ borderRadius: '1rem', backgroundColor: '#efefef', }}>
								<div class="card-body p-5">

									<h3 class="mb-4 text-center">Signup</h3>

									<h6 class="mb-4 text-center">Already have an account ? <a href="/login">Login</a></h6>

									<div class="form-outline mb-3">
										<label class="form-label" for="typeEmailX">Name</label>
										<input type="text" id="typeEmailX" class="form-control form-control-lg" />
									</div>

									<div class="form-outline mb-3">
										<label class="form-label" for="typeEmailX">Email</label>
										<input type="email" id="typeEmailX" class="form-control form-control-lg" />
									</div>

									<div class="form-outline mb-3">
										<label class="form-label" for="typePasswordX">Password</label>
										<input type="password" id="typePasswordX" class="form-control form-control-lg" />
									</div>

									<div class="form-outline mb-3 text-center">
										<button class="btn btn-primary btn-lg btn-block" type="submit">Create Account</button>
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