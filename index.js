#!/usr/bin/env node
var net = require('net')
var Socket = net.Socket
const {Command} = require('commander');

class ScanPort {
  constructor(host, port, timeout=8000){
    this.host = host;
    this.port = port;
    this.services = {
      "80": "HTTP",
      "443": "HTTPS",
      "21": "FTP (Control)",
      "20": "FTP (Data)",
      "22": "SSH",
      "23": "Telnet",
      "25": "SMTP",
      "53": "DNS",
      "67": "DHCP (Server)",
      "68": "DHCP (Client)",
      "161": "SNMP",
      "162": "SNMP Trap",
      "3128": "HTTP Proxy (Squid)",
      "8080": "HTTP Proxy (Alternative)",
      "143": "IMAP",
      "993": "IMAPS",
      "110": "POP3",
      "995": "POP3S",
      "3306": "MySQL",
      "5432": "PostgreSQL",
      "3389": "RDP",
      "389": "LDAP",
      "123": "NTP",
      "445": "SMB",
      "548": "AFP",
      "465": "SMTPS",
      "8080": "HTTP Alt"
    }
    this.timeout = timeout;
    this.socket = new Socket();
    this.socket.on('connect', () => {
      this.status = 'open';
      this.socket?.destroy();
    })
    
    this.socket.setTimeout(this.timeout)
    this.socket.on('timeout',  () => {
      this.status = 'closed'
      // console.log('Timeout (' + this.timeout + 'ms) occurred waiting for ' + this.host + ':' + this.port + ' to be available')
      this.socket?.destroy()
    })

    this.socket.on('error', (exception) => {
      if (exception.code !== 'ECONNREFUSED') {
        this.error = exception
      } else {
        this.connectionRefused = true
      }
      this.status = 'closed'
    })
  
    this.socket.on('close', (exception) => {
      if (exception && !this.connectionRefused) { this.error = this.error || exception } else { this.error = null }
      if(this.status == 'open') {
        console.log(`- PORT ${this.port}/${this.services[this.port.toString() || "UNKNOWN"]} ${this.status}`);
      }
    })
    this.socket.connect(this.port, this.host)
  }
}



class PortScanner {
  constructor(host = '127.0.0.1', port = 80 , timeout = 400) {
    this.host = host;
    this.port = port;
    this.timeout = timeout;
    this.program = new Command();
  }

  start(){
    this.program
    .name('js-portscanner')
    .description('CLI to Scan a host ports')
    .version('1.0.0');
  
    this.program
    .option('-t, --target [target ip]', 'target ip address', '127.0.0.1')
    .option('-p, --port [port number]', 'target port', 80)
    .option('-pl, --ports-list [80,21,22]', 'target ports list', false)
    .option('-pr, --ports-range [1-1000]', 'target ports range', false).
    action((str,_) => {
      this.host = str.target;
      this.port = str.port;
      this.portsList = str.portsList;
      this.portsRange = str.portsRange;
    })
    
    this.program.parse(process.argv);
    
    if(this.portsList != false || this.portsRange != false) {
      if(this.portsList != false) {
        const list = this.portsList.split(',')
        for (let p of list) {
          new ScanPort(this.host , p)    
        }
      } else {
        const [start , end] = this.portsRange.split('-');
        for (let p = start; p <= end; p++) {
          // console.log('scanning ',p)
          new ScanPort(this.host , p)  
        }
      }
    } else {
      new ScanPort(this.host , this.port)
    }

    
    
  }
}

const scanner = new PortScanner()

scanner.start()


