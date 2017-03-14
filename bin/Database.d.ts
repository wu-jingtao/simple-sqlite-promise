declare class Database {
    static readonly OPEN_READONLY: number;
    static readonly OPEN_READWRITE: number;
    static readonly OPEN_CREATE: number;
    static verbose(): typeof Database;
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
    static connectDB(filename: string, mode?: number, cached?: boolean): Promise<Database>;
    private db;
    private constructor(db);
    /**
     * 关闭数据库连接
     *
     * @returns {Promise<void>}
     *
     * @memberOf Database
     */
    close(): Promise<void>;
    /**
     * 当有未捕获到的数据库错误时触发
     *
     * @param {(err:Error)=>void} callback 回调函数
     *
     * @memberOf Database
     */
    onDatabaseError(callback: (err: Error) => void): void;
    /**
     * 执行单条sql语句，不返回sql执行结果。如果执行的是INSERT操作则返回插入id lastID，如果是UPDATE或DELETE 则会返回受影响的行数changes
     *
     * @param {string} sql 执行的sql语句
     * @param {any} param 如果sql中使用了占位符，则可在这传递参数
     * @returns {Promise<{ lastID?: string, changes?: number }>}
     *
     * @memberOf Database
     */
    run(sql: string, param: any): Promise<{
        lastID?: string;
        changes?: number;
    }>;
}
export = Database;
