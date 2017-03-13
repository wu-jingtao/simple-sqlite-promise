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

    async close() {
        return new Promise<void>((resolve, reject) => {
            this.db.close(err => {
                err ? reject(err) : resolve();
            })
        });
    }

    async run(sql: string, ...param: any[]) {
        return new Promise<void>((resolve, reject) => {
            this.db.run(sql, param, err => {
                err ? reject(err) : resolve();
            })
        });
    }
}
