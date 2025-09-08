# Instructions
These instructions will allow you to run AdonisJS commands as Docker Image based Lambda on AWS.

## Copy Files
You will need to copy `docker.ts`, `Dockerfile-lambda`, and `tsconfig.lambda.json` to 
the root directory of your AdonisJS application.

## Add scripts to your package.json
To make it easier I added commands to my `package.json`, one to build the docker image, one to
run and one to do both.
```
"docker:build": "docker buildx build -f Dockerfile-lambda --platform linux/amd64 --provenance=false -t adonisLambda-sqs:test .",
"docker:run": "docker run --env-file .env --platform linux/amd64 -p 9000:8080 adonisLambda-sqs:test",
"docker:all": "pnpm docker:build && pnpm docker:run"
```

## How to Use
Simply make sure you pass in the event an object with a property named `args`. These `args` should be
an array of strings that would be the command arguments. For example if you normally enter in:
```shell
node ace command:lambdaFunction arguement1
```
Make sure the event you send to the handler has something like this:
```js
{
    "args": ["command:lambdaFunction","arguement1"]
}
```

## Testing
To test you can run `docker:all`, then open another shell use a command like these:

Powershell
```shell
Invoke-WebRequest -Uri "http://localhost:9000/2015-03-31/functions/function/invocations" -Method Post -Body '{"args": ["command:lambdaFunction","arguement1"]}' -ContentType "application/json"
```
Curl
```shell
curl "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"args": ["command:lambdaFunction","arguement1"]}'
```