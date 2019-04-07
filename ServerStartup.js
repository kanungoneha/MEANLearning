const EmpHandler= require("./EmployeeHandler")
const LokiCache= require("./lokicache")
class ServerStartup{
static async loadLoki(){
try{

    console.log("Loki is loading")
   const employees= await EmpHandler.getAllEmployee()
   LokiCache.load({"collection":"empDetails","data":employees})

}
catch(err){
    throw err;
}
}
}

module.exports=ServerStartup