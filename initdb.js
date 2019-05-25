const sqlite = require('sqlite3').verbose();

let db = new sqlite.Database('./db/database.db', function(err) {
  if (err)
    console.log(err.message);
  console.log('Connected to the database.');
});

db.run('CREATE TABLE testtable(data JSONB);');

db.close((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('Close the database connection.');
});
