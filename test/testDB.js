
const Database = require('../bin/Database').verbose();
const path = require('path');

(async function () {
    const db = await Database.connectDB(path.resolve(__dirname, './test.db'));

    const t1 = await db.run('create table [test](id text)');
    const t2 = await db.run('insert into test values(1)');
    const t3 = await db.run('insert into test values(2)');
    const t4 = await db.get('select * from test');
    const t5 = await db.all('select * from test');
    await db.exec(`
        create table gogo(name text);
        drop table gogo;
    `);
    const tn = await db.run('drop table [test]');

    db.onDatabaseError(function (err) { });

    await db.close();

    console.log('ok')
})()