const db = require("mongoose")



db.connect("mongodb://127.0.0.1:27017/mydatabase").then(()=>{
    console.log("connected to DB :")
}).catch((error)=>{
    console.log(error)
})



module.exports = db