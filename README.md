# js-portscanner

A Node.js command-line tool for scanning ports on a host.

## Overview

This Node.js script allows you to scan ports on a specified host using various options such as single port, list of ports, or a range of ports. It provides information about the status of each port (open, closed) and, if available, identifies the service running on that port.

## Requirements

- Node.js installed on your system

## Installation

To use the port scanner, clone this repository and install dependencies using npm:

```
git clone https://github.com/Zedster07/js-portscanner.git
cd js-portscanner
npm install -g
```

## Usage

You can run the port scanner using the following command:

```
node portscanner.js [options]
```

### Options

- `-t, --target [target ip]`: Specify the target IP address. Default is `127.0.0.1`.
- `-p, --port [port number]`: Specify the target port to scan. Default is `80`.
- `-pl, --ports-list [80,21,22]`: Specify a list of ports to scan, separated by commas.
- `-pr, --ports-range [1-1000]`: Specify a range of ports to scan, separated by a hyphen.

### Examples

1. Scan a single port:

```
node portscanner.js -t 127.0.0.1 -p 80
```

2. Scan a list of ports:

```
node portscanner.js -t 127.0.0.1 -pl 80,443,22
```

3. Scan a range of ports:

```
node portscanner.js -t 127.0.0.1 -pr 1-1000
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
