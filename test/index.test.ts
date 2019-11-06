import fs from 'fs';
import path from 'path';
import expect from 'expect.js';
import Database from '../src/Database';

const dbPath = path.resolve(__dirname, './test.db');

it('测试创建数据库链接', async function () {
    await Database.connectDB(dbPath);
    await Database.connectDB(dbPath, Database.OPEN_READWRITE);
    await Database.connectDB(dbPath, Database.OPEN_READONLY, true);
});

describe('测试数据库操作', function () {

    let db: Database;

    before(async function () {
        await fs.promises.unlink(dbPath).catch(() => { });
        db = await Database.connectDB(dbPath);
        db.on('trace', sql => console.log(sql));
        db.on('error', err => console.error(err));
    });

    after(async function () {
        await db.close();
        await fs.promises.unlink(dbPath).catch(() => { });
    });

    it('测试 run', async function () {
        expect(await db.run('create table [test](id text,name text)')).to.eql({ changes: 0, lastID: 0 });
        expect(await db.run('insert into test values(?,?)', 1, 'test')).to.eql({ changes: 1, lastID: 1 });
        expect(await db.run('insert into test values($id,$name)', { $id: 2, $name: 'test2' })).to.eql({ changes: 1, lastID: 2 });
        expect(await db.run('insert into test values(?,?)', [3, 'test'])).to.eql({ changes: 1, lastID: 3 });
        expect(await db.run('insert into test values(?,?)', true, false)).to.eql({ changes: 1, lastID: 4 });
        expect(await db.run('insert into test values(?,?)', null, undefined)).to.eql({ changes: 1, lastID: 5 });
    });

    it('测试 get', async function () {
        expect(await db.get('select * from test')).to.eql({ id: 1, name: 'test' });
        expect(await db.get('select * from test where id = ?', 2)).to.eql({ id: 2, name: 'test2' });
        expect(await db.get('select * from test where id = ?', 111)).to.be(undefined);
    });

    it('测试 all', async function () {
        expect(await db.all('select * from test where name = ?', 'test')).to.eql([
            { id: 1, name: 'test' },
            { id: 3, name: 'test' }
        ]);
    });

    it('测试 exec', async function () {
        await db.exec(`
            create table gogo(name text);
            drop table gogo;
        `);

        expect(await db.get('select * from sqlite_master where tbl_name = ?', 'gogo')).to.be(undefined);
    });
});