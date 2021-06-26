require('dotenv').config();
const bot = require(__dirname + '/modules/homie.js')


// create new bot
const homie = new bot()


//homie.giveTo()
homie.getMyBalance()
homie.listenForMessages()

homie.db.printTable()
homie.connect()






//const db = new datab()

//db.create(egg)
//let t = db.retreive("egg")

//db.update(egg_change)
//db.delete("egg")
//db.printTable()




/*
reteive example
let test = t.then((key) => { return key })


console.log(test)
*/