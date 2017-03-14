
const Database = require('../bin/Database');
const path = require('path');

Database.connectDB(path.resolve(__dirname,'./test.db')).then(function (db) {
    db.close();
});