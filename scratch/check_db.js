const net = require('net');

const check = (host, port) => {
  const socket = new net.Socket();
  socket.setTimeout(5000);
  socket.on('connect', () => {
    console.log(`Connected to ${host}:${port}`);
    socket.destroy();
  }).on('timeout', () => {
    console.log(`Timeout connecting to ${host}:${port}`);
    socket.destroy();
  }).on('error', (err) => {
    console.log(`Error connecting to ${host}:${port}: ${err.message}`);
  }).connect(port, host);
};

check('108.128.216.176', 5432);
check('108.128.216.176', 6543);
