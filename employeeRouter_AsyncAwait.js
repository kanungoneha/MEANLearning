const router = require("express").Router();
const DB = require("./DatabaseAwait");
const LokiCache= require("./lokicache")
//const DBP = require("./DB_Promises");
const url = "mongodb://localhost:27017/"
const dbName = "employees";
const AJV = require("ajv")
const AJVValidator = new AJV()
const validateAddEmployee = require("./EmployeeSchema").postSchema;
const validateUpdateEmployee = require("./EmployeeSchema").putSchema;
const EmployeeHandler= require("./EmployeeHandler");
class EmployeeRouter {
    static get() {
 /*router.get("/get", async (req, res) => {
            try {
                const docs = await new DB(url).read({
                    db: dbName,
                    collection: "employeedetails",
                    criteria: {  },
                    projection: { "_id": 0 }
                })
                res.status(200).send(doc)
            } catch (err) {
                res.status(500).send(`${err.message}-${err.stack}`)
            }
        })*/

        
        router.post("/new", async (req, res) => {
            try {
                const result=await EmployeeHandler.create(req.body.payLoad)
                res.send(result)
            } catch (err) {
            	console.log(`${err.message}-${err.stack}`)
                res.status(500).send(err.message);
            }
        })

        router.put("/newUpdate",async(req,res)=>{
            try{
                const result = await EmployeeHandler.update(req.body);
                res.status(200).send(result);
            }catch(err){
                console.log(err.stack)
                res.status(500).send(err.message);
            }            
        })
        router.delete("/newDelete",async(req,res)=>{
            try{
                const result = await EmployeeHandler.delete(req.body.payLoad, req.body.criteria);
                res.status(200).send(result);
            }catch(err){
                console.log(err.stack)
                res.status(500).send(err.message);
            }            
        })

        router.delete("/:id",async(req,res)=>{
            try{
                const result = await EmployeeHandler.deleteByURLParams(req.params.id);
                res.status(200).send(result);
            }catch(err){
                console.log(err.stack)
                res.status(500).send(err.message);
            }            
        })

      
        router.get("/db", async (req, res) => {
            try {
                const docs = await new DB().read({
                    db: dbName,
                    collection: "empDetails",
                    criteria: {  },
                    projection: {  }
                })
                res.status(200).send(docs)
            } catch (err) {
                res.status(500).send(`${err.message}-${err.stack}`)
            }
    })
    router.get("/db/:id", async (req, res) => {
        try {
            const docs = await EmployeeHandler.getOneEmployee(req.params.id)
               
            res.status(200).send(docs)
        } catch (err) {
            res.status(500).send(`${err.message}-${err.stack}`)
        }
})
   router.get("/loki",(req,res)=>{
       try{
           const result =  LokiCache.get({collection:"empDetails",criteria:{},projection:{name:1}});
           res.status(200).send(result);
       }catch(err){
           console.log(err.stack)
           res.status(500).send(err.message);
       }            
   })

       
      
        return router;
    }
}
module.exports = EmployeeRouter;