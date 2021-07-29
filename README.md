# ep-assignment

EP-assesment serverless is built using the following AWS technologies

> All resources used in this project are defined in Cloudformation template, see `cloudformation` folder  
> Backend uses NodeJS 14.x 



Frontend
- webpack 
- React 
- Bootstrap 5 
- ReactApexCharts 

Backend
- Cloudformation 
- S3 
- Lambda 
- - dependencies
- - - `npm i async`
- - - `npm i request` ( used to make BTC api calls)
- - - `npm i bcryptjs` ( hashes and verifies user's password )
- - - `npm i cookie` ( parses cookies from the client )
- Step Functions 
- Api Gateway 
- - Pages
- - - `GET /` - home page
- - - `GET /login` - login page, logs user in and redirects to /account
- - - `GET /signup` - signup page, registers the user ( no email verification made ) then redirects to /account
- - - `GET /account` - account page, checks cookie and redirects to /login if no valid session found
- - API ( HTTP regional API )
- - - `PUT /v1/account` - account signup
- - - `PUT /v1/auth` - account login
- - - `GET /v1/auth` - get current login ( returns user and user's guess )
- - - `PUT /v1/guess` - submit a new guess
- - - `GET /v1/history` - get BTC rate history for the last 60 minus
- - - `GET /v1/recents` - get the most recent 10 guess ( includes only resolved guesses )
- - - `GET /v1/top` - returns a list of max 10 users sorted by their coin earings
- DynamoDB
- Cloudwatch Events 

Tasks
- Cron fetch BTC rate every minute 
- - collects both USD and EUR rates
- - uses 2 API providers, if `blockchain.info` fails will retry with `api.coindesk.com` 
- - runs once every minute ( minim for cloudwatch events and also APIS update rates every minute too )
- - save it to **DynamoDB** ~~Cloudwatch Metrics~~  ~~AWS Timestream~~ 
- Guess resolver runs for every guess
- - uses **Step Functions** (more precise) instead of ~~SQS~~ (cheaper)
- - sleeps 60s when entering
- - sleeps 30s if rate did not change
- - updates database using transaction
- - - increase decrease user's coins
- - - unlocks user from Guessing again when current guess is resolved
- - - updates the guess ( there's a record for each guess )
- - ~~exit and terminate guess if btc rate did not change (might be problem with BTC API)~~ protection mechanism

Pages
- [x] home page
- - btc price chart
- - leaderboard
- - recent guesses
- - guess component
- [x] signup
- - capitalize first letter in each workd for "Full Name"
- - auto lowercase for username
- - server validated name, username, password
- - form submits on ENTER key
- - form navigable by tabs ?
- - ~~clientside validation~~
- - ~~disabled form after submit~~
- - ~~form show loading~~

- [x] login
- - auto lowercase for username
- - form submits on ENTER key
- - ~~disabled form after submit~~
- - ~~form show loading~~

- [x] my account 
- - btc price chart
- - user's recent guesses 
- - guess component

- [ ] user's page
- - ~~accesible on /@username~~
