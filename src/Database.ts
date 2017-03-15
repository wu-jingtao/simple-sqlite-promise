/**
 * Created by 吴劲韬 on 2017/3/13.
 */
import sqlite3 = require('sqlite3');

class Database {

    /**启动模式*/
    static get OPEN_READONLY(): number {
        return sqlite3.OPEN_READONLY;
    }

    static get OPEN_READWRITE(): number {
        return sqlite3.OPEN_READWRITE;
    }

    static get OPEN_CREATE(): number {
        return sqlite3.OPEN_CREATE;
    }

    /**
     * 开启以显示更多的错误消息。注意！这会严重影响数据库的性能
     * 
     * @static
     * @returns {typeof Database} 
     * 
     * @memberOf Database
     */
    static verbose(): typeof Database {
        sqlite3.verbose();
        return Database;
    }

    /**
     * 根据文件路径异步打开sqlite数据库
     * 
     * @static
     * @param {string} filename sqlite数据库的文健路径
     * @param {number} [mode=Database.OPEN_CREATE | Database.OPEN_READWRITE] 连接模式
     * @param {boolean} [cached=false] 是否使用之前打开过的连接
     * @returns {Promise<Database>} 返回数据库对象
     * 
     * @memberOf Database
     */
    static connectDB(filename: string, mode: number = Database.OPEN_CREATE | Database.OPEN_READWRITE, cached: boolean = false) {
        return new Promise<Database>(function (resolve, reject) {
            if (cached) {
                const db = sqlite3.cached.Database(filename, mode, function (err) {
                    err ? reject(err) : resolve(new Database(db));
                });
            }
            const db = new sqlite3.Database(filename, mode, function (err) {
                err ? reject(err) : resolve(new Database(db));
            });
        });
    }

    /**原始的sqlite3数据库连接*/
    private _db: sqlite3.Database;

    private constructor(db: sqlite3.Database) {
        this._db = db;
    }

    /**
     * 关闭数据库连接
     * 
     * @returns {Promise<void>} 
     * 
     * @memberOf Database
     */
    close(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._db.close(err => {
                err ? reject(err) : resolve();
            })
        });
    }

    /**
     * 当有未捕获到的数据库错误时触发
     * 
     * @param {(err:Error)=>void} callback 回调函数
     * 
     * @memberOf Database
     */
    onDatabaseError(callback: (err: Error) => void): void {
        this._db.on('error', callback);
    }

    /**
     * 执行"单条"sql语句(多条语句只执行第一条)，不返回sql执行结果。如果执行的是INSERT操作则返回插入id lastID，如果是UPDATE或DELETE 则会返回受影响的行数changes
     * 
     * @param {string} sql 执行的sql语句
     * @param {any} param 如果sql中使用了占位符，则可在这传递参数
     * @returns {Promise<{ lastID?: number, changes?: number }>} 
     * 
     * @memberOf Database
     */
    run(sql: string, param: any): Promise<{ lastID?: number, changes?: number }> {
        return new Promise((resolve, reject) => {
            this._db.run(sql, param, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        lastID: this.lastID,
                        changes: this.changes
                    });
                }
            });
        });
    }

    /**
     * 执行一条sql查询，返回第一行结果。结果按照{列名：值}键值对的形式返回。如果查询结果为空则返回空
     * 
     * @param {string} sql sql查询语句
     * @param {*} param 如果sql中使用了占位符，则可在这传递参数
     * @returns {Promise<any>} 查询返回的结果
     * 
     * @memberOf Database
     */
    get(sql: string, param: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._db.get(sql, param, function (err: Error, row: any) {
                err == null ? resolve(row) : reject(err);
            })
        });
    }

    /**
     * 执行一条sql查询，返回所有结果。结果按照{列名：值}键值对数组的形式返回。如果查询结果为空则返回空数组
     * 
     * @param {string} sql sql查询语句
     * @param {*} param 如果sql中使用了占位符，则可在这传递参数
     * @returns {Promise<any[]>} 查询返回的结果
     * 
     * @memberOf Database
     */
    all(sql: string, param: any): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this._db.all(sql, param, function (err: Error, rows: any[]) {
                err == null ? resolve(rows) : reject(err);
            })
        });
    }

    /**
     * 执行多条sql语句，不返回任何结果。如果其中一条sql语句执行失败，则后续的sql语句将不会被执行（可以利用事务包裹所有语句来确保执行结果与预料一致）。
     * 
     * @param {string} sql 要执行的sql语句
     * @returns {Promise<void>} 
     * 
     * @memberOf Database
     */
    exec(sql: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._db.exec(sql, function (err: Error) {
                err == null ? resolve() : reject(err);
            })
        });
    }
}

export = Database;