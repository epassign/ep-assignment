# ep-assignment




> Build a web app that allows users to make guesses on whether the market price of Bitcoin (BTC/USD) will be higher or lower after one minute.  
> 
> Rules:  
> - The player can at all times see their current score and the latest available BTC price in USD  
> - The player can choose to enter a guess of either “up” or “down“  
> - After a guess is entered the player cannot make new guesses until the existing guess is resolved  
> - The guess is resolved when the price changes and at least 60 seconds have passed since the guess was made  
> - If the guess is correct (up = price went higher, down = price went lower), the user gets 1 point added to their score. If the guess is incorrect, the user loses 1 point.  
> - Players can only make one guess at a time  
> - New players start with a score of 0  
> Solution requirements:  
> - The guesses should be resolved fairly using BTC price data from any available 3rd party API  
> - The score of each player should be persisted in a backend data store (AWS services preferred)  
> - Optional: Players should be able to close their browser and return back to see their score and continue to make more guesses  


#### Implementation

Implementation build using  AWS technologies and is 100% serverless ( no EC2 instances )

Frontend
- React 
- Bootstrap 5 ( for quick UI )
- ReactApexCharts 
- - used to display BTC rate chart 
- - :warning: unfortunately apexcharts adds a significant 500+ KB uncompressed to the bundle :warning: 
- webpack 
- - builds a bundle for the frontend that is later uploaded to S3
- - bundle without apexcharts is around 40KB uncompressed


Backend
- NodeJS
- - Backend uses NodeJS 14.x 

- Cloudformation 
- - All resources used in this project are defined in Cloudformation template, see `cloudformation` folder 
- - Exports IAM Key/Secret used for GithubActions ( Github to S3) and to sync bundle to S3

- S3 
- - bucket for static resources
- - - mainly used to store static images, javascript and css bundle ( used together wit Cloudfront )
- - bucket for lambda zip artifacts
- - - on .zip upload it updates the lambda function corresponding to that function 
- Cloudfront
- - serves static content from S3 bucket
- - :warning: is configured not to cache for this project, it forwards every request to S3 endpoint :warning: 

- Lambda 
- - dependencies
- - - `npm i async`
- - - `npm i request` ( used to make BTC api calls)
- - - `npm i bcryptjs` ( hashes and verifies user's password )
- - - `npm i cookie` ( parses cookies from the client )

- Step Functions 
- - Guess resolver 
- - - runs for every guess
- - - uses **Step Functions** (more precise) instead of ~~SQS~~ (cheaper)
- - - sleeps 60s when entering
- - - sleeps 30s if rate did not change
- - - updates database using transaction
- - - - increase decrease user's coins
- - - - unlocks user from Guessing again when current guess is resolved
- - - - updates the guess ( there's a record for each guess )
- - - ~~exit and terminate guess if btc rate did not change (might be problem with BTC API)~~ protection mechanism
 
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
- - Users Table ( Primary key on user_id so user can change his username later )
- - Sessions Table
- - BTC History Table - every minute cron will insert a record with BTC rates for the minute, old values do not expire 
- - Guess-es table - history of all the guesses made by every user, partitioned by user id

- Cloudwatch Events 
- fetch BTC rate every minute 
- - collects both USD and EUR rates
- - uses 2 API providers, if `blockchain.info` fails will retry with `api.coindesk.com` 
- - runs once every minute ( minim for cloudwatch events and also APIS update rates every minute too )
- - save it to **DynamoDB** ~~Cloudwatch Metrics~~  ~~AWS Timestream~~ 

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
