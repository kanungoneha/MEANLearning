(async function(){
try{
const express=require("express")
const bodyParser = require('body-parser')
const cors=require("cors") // to avoid cross rsoursing sharing isssue talk any typ eof protocol
const app=express() //default function in side express.js on node module>express
app.use(cors())
const lokiStartup=require("./ServerStartup.js")

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
app.listen(8000)
console.log("server started..")
/*app.get("/",(req,res)=>{

    setTimeout(()=>res.send("hi neha"),5000)
//res.send("hi") //will be the last line 

})*/

await lokiStartup.loadLoki();
const EmployeeRouterLoki=require("./employeeRouter_AsyncAwait.js")
app.use("/employeeLoki",EmployeeRouterLoki.get())
}
catch(err){
console.log(`${err.message}-${err.stack}`)

}

})()
