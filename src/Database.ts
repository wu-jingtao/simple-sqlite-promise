/**
 * Created by 吴劲韬 on 2017/3/13.
 */

import * as sqlite3 from 'sqlite3';

class Database {

    static get OPEN_READONLY(): number {
        return sqlite3.OPEN_READONLY;
    }

    static get OPEN_READWRITE(): number {
        return sqlite3.OPEN_READWRITE;
    }

    static get OPEN_CREATE(): number {
        return sqlite3.OPEN_CREATE;
    }


    static verbose(): typeof Database {
        sqlite3.verbose();
        return Database;
    }

    /**
     * 连接到指定的sqlite数据库
     * @static
     * @param {string} filename sqlite数据库的文健路径
     * @param {number} [mode=Database.OPEN_CREATE | Database.OPEN_READWRITE] 连接模式
     * @param {boolean} [cached=false] 是否使用之前打开过的连接
     * @returns 
     * 
     * @memberOf Database
     */
    static async connectDB(filename: string, mode: number = Database.OPEN_CREATE | Database.OPEN_READWRITE, cached: boolean = false) {
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

    // sqlite数据库连接
    private db: sqlite3.Database;

    private constructor(db: sqlite3.Database) {
        this.db = db;
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
            this.db.close(err => {
                err ? reject(err) : resolve();
            })
        });
    }

    /**
     * 执行sql语句，不返回sql执行结果。如果执行的是INSERT操作则返回插入id：lastID，如果是UPDATE或DELETE 则会返回受影响的行数changes
     * 
     * @param {string} sql 执行的sql语句
     * @param {any} param 如果sql中使用了占位符，则可在这传递参数
     * @returns {Promise<{ lastID?: string, changes?: number }>} 
     * 
     * @memberOf Database
     */
    run(sql: string, param: any): Promise<{ lastID?: string, changes?: number }> {
        return new Promise((resolve, reject) => {
            this.db.run(sql, param, function (err) {
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

    
}
