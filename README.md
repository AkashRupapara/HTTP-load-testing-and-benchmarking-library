# HTTP Load Testing and Benchmarking Library

This TypeScript library facilitates HTTP load testing and benchmarking for web applications or APIs. It allows you to simulate various levels of load, collect performance metrics, and analyze server response under different conditions.

## Features

- **HTTP Request Handling**: Send HTTP requests (`GET`, `POST`, etc.) to a specified URL.
- **Concurrency Control**: Control the rate of requests per second (`--qps` flag).
- **Metrics Reporting**: Collect metrics such as response times, error rates, and throughput.
- **Multi-User Support**: Simulate multiple users concurrently with unique identifiers.
- **Dynamic Configuration**: Configure tests via command-line or configuration files (`--config`).
- **Error Handling**: Differentiate between Axios-specific errors and system errors.
- **CLI Integration**: Execute tests via command-line interface with various options (`--output json`).
- **Dockerization**: Build Docker image for containerized deployment.

## Installation

To install the library, clone the repository and install dependencies:

```bash
git clone https://github.com/your/repository.git
cd repository
npm install
