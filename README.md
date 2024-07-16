# Load Tester

A general-purpose HTTP load-testing and benchmarking library written in TypeScript.

## Features

- URL Input: Takes an HTTP address as input.
- Queries Per Second (QPS): Supports a --qps flag to generate requests at a given fixed QPS.
- Concurrency: Allows multiple concurrent requests using the --concurrency flag.
- Configurable HTTP Methods: Supports different HTTP methods (GET, POST, etc.) with the --method flag.
- Custom Headers: Allows setting custom headers for requests using the --header flag.
- Request Payloads: Allows setting custom request payloads for methods like POST using the --data flag.
- Duration: Runs the load test for a specified duration using the --duration flag.
- Detailed Metrics Reporting:
- Reports total requests, successful requests, and error rates.
- Calculates and reports average, minimum, maximum, and standard deviation of latencies.
- Dockerization: Provides a Dockerfile to build and run the load tester in a containerized environment.

## Setup

1. Clone the repository:

```
git clone <repository-url>
cd load-tester
```
2. Install the dependencies:
```
npm install
```

3. Build the Docker image:
```
docker build -t load-tester .
```
## Usage
Running the Load Test
To run the load test, use the following command:

```
docker run --rm load-tester --url http://example.com --qps 20 --concurrency 5 --method POST --header "Content-Type: application/json" --data '{"key":"value"}' --duration 30
```
Command Line Options:
- -u, --url <url>: URL to load test (required)
- -q, --qps <qps>: Queries per second (required)
- -c, --concurrency <concurrency>: Number of concurrent requests (default: 1)
- -m, --method <method>: HTTP method to use (default: GET)
- -H, --header <headers...>: Custom headers
- -d, --data <data>: Request payload
- -t, --duration <duration>: Test duration in seconds (default: 30)

Example Commands
Test with 10 QPS, 1 concurrency, GET method:

```
docker run --rm load-tester --url http://example.com --qps 10
```

Test with 20 QPS, 5 concurrency, POST method, custom headers, and payload:
```
docker run --rm load-tester --url http://example.com --qps 20 --concurrency 5 --method POST --header "Content-Type: application/json" --data '{"key":"value"}' --duration 30
```

## Running Tests
To run the unit tests, use the following command:
```
npm test
```