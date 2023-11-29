const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");

let server;
const HOSTNAME = process.env.HOSTNAME
const PORT = process.env.PORT1
const DB_URI = process.env.MONGODB_URL;
mongoose
  .connect(DB_URI)
  .then(() => console.log("Connected to DB at", DB_URI))
  .catch((error) => console.log("Failed to connect to DB\n", error));

app.listen(PORT,  () => {
    console.log("Server Listening at", PORT);
  });
