const MemoryDB = require("sharedb").MemoryDB;
const racer = require("racer");

const racerSchema = require("../lib");
const racerSchemaOptions = require("./options");

const backend = racer.createBackend({ db: new MemoryDB() });
const model = backend.createModel();

racerSchema(backend, racerSchemaOptions);

module.exports = model;
