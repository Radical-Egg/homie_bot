const datab = require(__dirname + '/modules/database.js')
let egg = [{ "user": "egg", "wallet": 200 }, { "user": "gogo", "wallet": 500 }]

let egg_change = { "user": "derp", "wallet": 5800 }

const db = new datab()

db.create(egg)
//let t = db.retreive("egg")

//db.update(egg_change)
//db.delete("egg")
db.printTable()




/*
reteive example
let test = t.then((key) => { return key })


console.log(test)
*/