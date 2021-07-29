# ep-assignment

EP-assesment serverless is built using the following AWS technologies

Frontend
- webpack 
- React 
- Bootstrap 5 
- ReactApexCharts 

Backend
- Cloudformation 
- S3 
- Lambda 
- Step Functions
- Api Gateway 
- DynamoDB

Tasks
- Cron fetch BTC rate every minute 
- - collects both USD and EUR rates
- - uses 2 API providers, if API1 fails will retry with API2
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
