/**
 * Created by 吴劲韬 on 2017/3/13.
 */

import * as sqlite3 from 'sqlite3';

class SPDatabase {

    static get OPEN_READONLY(): number {
        return sqlite3.OPEN_READONLY;
    }

    static get OPEN_READWRITE(): number {
        return sqlite3.OPEN_READWRITE;
    }

    static get OPEN_CREATE(): number {
        return sqlite3.OPEN_CREATE;
    }

    static verbose(): void {
        sqlite3.verbose();
    }

    private db: Promise<sqlite3.Database>;

    constructor(filename: string, mode: number = SPDatabase.OPEN_CREATE | SPDatabase.OPEN_READWRITE, cached: boolean = false) {
        this.db = new Promise((resolve, reject) => {
            if (cached) {
                const db = sqlite3.cached.Database(filename, mode, err => err === null ? resolve(db) : reject(err));
            } else {
                const db = new sqlite3.Database(filename, mode, err => err === null ? resolve(db) : reject(err));
            }
        });
    }
}