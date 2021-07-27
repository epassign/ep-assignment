#/bin/bash

. ./sync-credentials


echo " "
cmd="aws s3 sync ./dist s3://cdn-ep-assesment --acl public-read --delete "
$cmd