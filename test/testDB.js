
const Database = require('../bin/Database').verbose();
const path = require('path');

(async function () {
    const db = await Database.connectDB(path.resolve(__dirname, './test.db'));

    db.on('trace', function (sql) { //output executed sql
        console.log(sql);
    });

    db.on('error', function (err) {
        console.error(err);
    });

    const t1 = await db.run('create table [test](id text,name text)');
    const t2 = await db.run('insert into test values(?,?)', 1, 'test');
    const t3 = await db.run('insert into test values($id,$name)', { $id: 2, $name: 'test2' });
    const t4 = await db.run('insert into test values(?,?)', [3, 'test']);
    const t5 = await db.run('insert into test values(?,?)', true, false);
    const t6 = await db.run('insert into test values(?,?)', null, undefined);
    const t7 = await db.get('select * from test');
    const t8 = await db.get('select * from test where id = ?', 111);
    const t9 = await db.get('select * from test where id = ?', 2);
    const t10 = await db.all('select * from test where name = ?', 'test');

    await db.exec(`
        create table gogo(name text);
        drop table gogo;
    `);

    const db2 = await Database.connectDB(path.resolve(__dirname, './test.db'), true);

    const t11 = await db2.get('select * from test where id = ?', 111);
    const t12 = await db2.all('select * from test where name = ?', 'test');

    await db.run('drop table [test]');
    await db.close();

    await db2.exec(`
        create table gogo2(name text);
        drop table gogo2;
    `);

    await db2.close();

    console.log('ok')
})()