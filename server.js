require("dotenv").config();
const db = require("./config/db");
const app = require("./app");

require("./models/User");

const PORT = process.env.PORT || 9900;

db.authenticate()
  .then(() => {
    console.log("Database connected successfuly");
    db.sync();
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`server started on ${PORT} port`);
});
