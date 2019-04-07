const ValidateFactory = require("./ValidateFactory");
const Database = require("./DatabaseAwait")
const EMPLOYEE_POST_SCHEMA = "employeePostSchema";
const EMPLOYEE_DELETE_SCHEMA = "employeedeleteSchema";
const lokicache = require('./lokicache')
const ObjectID = require('mongodb').ObjectID
const EMPLOYEE_PUT_SCHEMA = "employeePutSchema";
class EmployeeHandler {
    static async create(employee) {
        try {
            ValidateFactory.validate(EMPLOYEE_POST_SCHEMA, employee)
            return await new Employee().create(employee)
        } catch (err) {
            throw err;
        }
    }
    // static async update(employee,criteria){
    // try{
    //    ValidateFactory.validate(EMPLOYEE_POST_SCHEMA,employee)
    //    return await new Employee().update(employee,criteria)
    //  }catch(err){
    //     throw err;
    //  }
    //  try{ 
    //	ValidateFactory.validate(EMPLOYEE_PUT_SCHEMA,reqBody.payLoad)
    //	new Employee().updateEmployeeInCache({
    //	criteria:{
    //	name:reqBody.criteria.name,
    //	_id:reqBody.criteria._id
    //},
    //payLoad:reqBody.payLoad
    //	})
    //	return await new Employee().update(reqBody)
    //}catch(err){
    //	throw err;
    //}
    //}
    static async update(reqBody) {
        try {
            ValidateFactory.validate(EMPLOYEE_PUT_SCHEMA, reqBody)
            /*new Employee().updateEmployeeInCache({
                criteria:{
                    name:reqBody.criteria.name,
                    _id:reqBody.criteria._id
                },
                payLoad:reqBody.payLoad
            })*/
            return await new Employee().updateEmployeeInDatabase(reqBody)
        } catch (err) {
            throw err;
        }
    }

    //static async insert(reqBody){
    //  try{ 
    //    ValidateFactory.validate(EMPLOYEE_POST_SCHEMA,reqBody)
    //   console.log(reqBody)
    //    const insertedEmployee = await new Employee().insert(reqBody)
    //  console.log(`insertedEmployee is ${JSON.stringify(insertedEmployee,null,2)}`)
    //   const employeeId = new ObjectID(insertedEmployee.insertedIds["0"])
    //    reqBody._id = employeeId
    //    new Employee().insertEmployeeInCache({payLoad:reqBody})
    //    return 
    //}catch(err){
    //     console.log(`${err}`);
    //     throw err

    //}
    //}
    static async insert(reqBody) {
        try {
            ValidateFactory.validate(EMPLOYEE_POST_SCHEMA, reqBody)
            console.log(reqBody)
            const insertedEmployee = await new Employee().insertEmployeeInDatabase(reqBody)
            console.log(`insertedEmployee is ${JSON.stringify(insertedEmployee,null,2)}`)
            const employeeId = new ObjectID(insertedEmployee.insertedIds["0"])
            reqBody._id = employeeId
            new Employee().insertEmployeeInCache({
                payLoad: reqBody
            })
            return
        } catch (err) {
            console.log(`${err}`);
            throw err

        }
    }
    static async delete(employee) {
        try {
            ValidateFactory.validate(EMPLOYEE_DELETE_SCHEMA, employee)
            return await new Employee().delete(employee)
        } catch (e) {
            throw e;
        }
    }
    static async deleteByURLParams(employeeId){
       try{
        return await new Employee().delete(employeeId)
       }catch(e){

       }
    }

    //static async delete(employee,criteria){
    // try{
    //  ValidateFactory.validate(EMPLOYEE_POST_SCHEMA,employee)
    // return await new Employee().delete(employee,criteria)
    //  }catch(err){
    //   throw err;
    // }
    // }
    static async getAllEmployee(employee) {
        try {
            return await new Employee().getAllemployees(employee)
        } catch (err) {
            throw err;
        }
    }
    static async getOneEmployee(id){
        try{
            return await new Employee().getOneEmployee(id)
        }catch(err){
            throw err;
        }
    }

}

    class Employee {
        constructor() {
            this.collection = "empDetails"
            this.db = new Database()
        }
        async create(employee) {
            try {
                return await this.db.insert({
                    "collection": this.collection,
                    "payload": employee
                })
            } catch (e) {
                // statements
                throw e;
            }
        }
        //async update(employee,criteria){
        //try {
        //	return await this.db.update({"collection":this.collection,"payload":employee,"criteria":criteria})
        //} catch(e) {
        // statements
        //	throw e;
        //}
        //try{
        //return await this.db.update({"collection":this.collection,
        //"criteria":{
        //  "_id": new ObjectID(reqBody.criteria._id),
        // "name": reqBody.criteria.name
        // },
        // dataToBeUpdated:{
        //"$set":reqBody.payLoad
        // }})
        // }catch(e){
        //   throw e
        // }
        // }


        async delete(employeeId){
        	try {
        		return await this.db.delete({"collection":this.collection,"criteria":{_id:new ObjectID(employeeId)}})
        	} catch(e) {
        statements
        		throw e;
        	}
        }

        async updateEmployeeInDatabase(reqBody) {
            try {
                return await this.db.update({
                    "collection": this.collection,
                    "criteria": {
                        "_id": new ObjectID(reqBody.criteria._id)
                    },
                    payload: reqBody.payLoad
                })
            } catch (e) {
                throw e
            }
        }
        async insertEmployeeInDatabase(reqBody) {
            try {
                return await this.db.insert({
                    "collection": this.collection,
                    dataToBeInserted: reqBody
                })
            } catch (e) {
                throw e
            }
        }
        updateEmployeeInCache(updateParams) {
            try {
                console.log(`updateParams is ${JSON.stringify(updateParams,null,2)}`)
                const docs = lokicache.update({
                    "collection": "empdetails",
                    "filterFunction": item => {
                        if (item.name === updateParams.criteria.name &&
                            item._id == updateParams.criteria._id) {
                            console.log(`item is:${item}`)
                            return true
                        } else {
                            return false
                        }
                    },
                    "updateFunction": function (item) {

                        item.name = updateParams.payLoad.name
                        item.surname = updateParams.payLoad.surname
                        item.age = updateParams.payLoad.age
                        console.log(`item is :${item}`)
                        return item
                    }

                })
            } catch (e) {
                throw e
            }
        }
        insertEmployeeInCache(insertParams) {
            try {
                const docs = lokicache.load({
                    "collection": "empdetails",
                    "data": insertParams.payLoad
                })
            } catch (e) {
                throw e
            }
        }
        async getAllemployees(employee) {
            try {

                return await this.db.read({
                    "collection": this.collection,
                    "payload": employee
                })
            } catch (err) {
                throw err;

            }

        }
        async getOneEmployee(id) {
            try {
                const criteria = {
                    "_id": new ObjectID(id)
                }
                const employee = await this.db.read({
                    collection: this.collection,
                    criteria: criteria,
                    projection: {}
                })
                return employee
            } catch (err) {
                throw err;
            }
        }
    }

    module.exports = EmployeeHandler