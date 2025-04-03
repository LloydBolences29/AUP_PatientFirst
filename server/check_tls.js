const tls = require("tls");

console.log("Supported TLS versions:", tls.DEFAULT_MIN_VERSION, "to", tls.DEFAULT_MAX_VERSION);
