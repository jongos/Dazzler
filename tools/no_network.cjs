// Verification-only guard. Blocks Node network APIs; not an OS process sandbox.
const denied = () => {
  throw new Error("Network disabled during offline verification");
};
for (const name of ["node:http", "node:https"]) {
  const mod = require(name);
  mod.request = mod.get = denied;
}
const net = require("node:net");
net.connect = net.createConnection = denied;
net.Socket.prototype.connect = denied;
require("node:tls").connect = denied;
require("node:dgram").createSocket = denied;
const dns = require("node:dns");
for (const key of Object.keys(dns))
  if (key === "lookup" || key.startsWith("resolve")) dns[key] = denied;
globalThis.fetch = denied;
globalThis.WebSocket = denied;
