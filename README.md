# About

This lambda function provides the API for insert metrics.

# Design

## Metric Model

```
{
    tag: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['count', 'time', 'error', 'msg']
    },
    appName: String,
    appVersion: String,
    createTime: {type: Date, default: Date.now},
    count: Number,  //count type
    time: Number,  //time type, in miliseconds
    message: String,  // error and msg type
    hostname: String,       //ip address that generate this error
    device: {
        model: String,
        brand: String,
        serial: String,
    },
    "os": {
        os_name: String,
        sdk_int: Number,
        os_type: String,
        fingerprint: String,
    }
}
```

- tag: [AppName|ServiceName|LambdaName]:[Function name]:[Error|Count|Time:Message]
- type: enum
- appName: AppName, service name or lambda name
- appVersion: version of the app
- count: used for count metric
- time: used for time metric in milliseconds
- message: used for message metric
- hostname: for service name, which host it is
- device: mobile device info
- os: mobile operating system info

# Test
## Use Lambda Local to Test

```
lambda-local -l build/app.js -e test/event.json -E {\"MONGODB_ATLAS_CLUSTER_URI\":\"uri\"\,\"MONGODB_NAME\":\"CloudAPIs\"}
```

# Deploy

Set the variables:

- MONGODB_ATLAS_CLUSTER_URI: mongodb cluster uri 
- MONGODB_NAME: mongodb name