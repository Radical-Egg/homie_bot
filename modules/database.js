const sqlite3 = require('sqlite3').verbose();



class Database {
    constructor() {
        this.db = new sqlite3.Database('/home/egg/data/homie_bot/coin.db', (err) => {
            if (err) {
                console.error(err.message)
            }
            // console.log("connected to the database") log this later
        })
    }
    createTable(tableName, tableAttributes) {
        let sqlCommand = "CREATE TABLE IF NOT EXISTS " + tableName + "("

        tableAttributes.forEach(element => {
            sqlCommand += element['id'] + " " + element['type'] + ","
        });
        sqlCommand = sqlCommand.slice(0, -1) + ')'

        try {
            this.db.run(sqlCommand);
        }
        catch (err) { console.error(err) }
    }
    printAllTables() {
        this.db.all('SELECT name FROM sqlite_master WHERE type="table"', (err, tables) => {
            tables ? console.log(tables) : console.log(err)
        })
    }
}

class Coins extends Database {
    constructor() {
        super()
        this.coin_table =
            [
                { "id": "user", 'type': 'UNIQUE' },
                { "id": "wallet", 'type': "INT" }
            ]
        this.table = "wallet"

    }
    // insert data into the database
    create(data) {
        this.db.serialize(() => {
            // check that the table exists and create it if not
            this.createTable(this.table, this.coin_table)
            this.handleCreate(data)
        })
    }
    handleCreate(data) {
        let sqlCommand = `INSERT OR IGNORE INTO ${this.table} VALUES (?,?)`


        let insert = this.db.prepare(sqlCommand)


        try {
            insert.run(data['user'], data['wallet'])
            console.log("Entry has been created or already exists for " + data['user'])
        } catch (error) {
            console.log(error.message)
            console.log(`Cannot insert this user because it already exists
                 \n if your need to update values - use update function `)
        }

        insert.finalize()
    }
    // can access this in the main by doing
    // let user = db.retreive(key).then((key) => {do whatever with key})
    retreive = (key) => {
        return new Promise((resolve, reject) => {
            let sqlCommand = `SELECT * FROM ${this.table} WHERE user = ?`

            this.db.get(sqlCommand, key, (err, rows) => {
                if (err || rows === undefined) {
                    reject()
                }
                resolve(rows)
            })
        })
    }
    // TODO - updating is working but we need to log our updates to somewhere
    handleUpdate = (userObject, amount) => {
        this.retreive(userObject.user).then((user) => {
            let sqlCommand = `UPDATE ${this.table} SET wallet = ? WHERE user = ?`

            user.wallet += amount

            this.db.run(sqlCommand, [user.wallet, user.user], function (err) {
                if (err) {
                    return console.error(err.message)
                }
                console.log(`Row(s) updated: ${this.changes}`);
                console.log(`${user.user} : ${user.wallet}`)
            })
        }).catch(() => {
            console.log("Unable to update entry - could not locate in database")
        }
        )
    }
    update(userObject) {
        this.db.serialize(() => {
            this.create(userObject)
            this.db.serialize(() => {
                this.handleUpdate(userObject)
            })
        })
    }
    delete = (key) => {
        this.retreive(key).then((user) => {
            let sqlCommand = `DELETE FROM ${this.table} WHERE user = ?`

            this.db.run(sqlCommand, key, function (err) {
                if (err) {
                    return console.error(err.message)
                }
                console.log(`row deleted ${this.changes}`)
            })
        }).catch(() => {
            console.log("Entry does not exist in DB cannot delete")
        })

    }

    printTable() {
        this.db.each(`SELECT user, wallet FROM ${this.table}`, (err, row) => {
            console.log(`User ID: ${row.user} : Wallet Amount: ${row.wallet}`)
        })
    }
}
module.exports = Coins