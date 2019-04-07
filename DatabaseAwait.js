const MongoClient = require("mongodb").MongoClient
class DatabaseAwait {
    constructor() {
        async function connect() {
            try {
                //const conn = await MongoClient.connect("mongodb://localhost:27017", {
                    const conn = await MongoClient.connect("mongodb+srv://neha:I7ttkEJ7Mp0Du0bE@nehaasterixmongodb-od5ba.mongodb.net/test?retryWrites=true", {
                    useNewUrlParser: true
                })
                return conn
            } catch (e) {
                throw e
            }
        }
        this.read = async function (readParams) {
            try {
                console.log(`Database read query ${JSON.stringify(readParams,null,2)}`)
                const connection = await connect()
                const db = connection.db("employeedb")
                const collection = db.collection(readParams.collection)
                const docs = await collection.find(readParams.criteria).project(readParams.projection).toArray()
                return docs
            } catch (e) {
                throw e
            }


        }
        this.insert = async function (insertParams) {
            try {
                console.log(`Database insert query ${JSON.stringify(insertParams,null,2)}`)
                const connection = await connect()
                const db = connection.db("employeedb")
                const collection = db.collection(insertParams.collection)
                const docs = await collection.insertOne(insertParams.payload)
                return docs
            } catch (e) {
                throw e
            }

        }
        this.update = async function (updateParams) {
            try {
                console.log(`Database insert query ${JSON.stringify(updateParams,null,2)}`)
                const connection = await connect()
                const db = connection.db("employeedb")
                const collection = db.collection(updateParams.collection)
                const docs = await collection.updateOne(updateParams.criteria, {
                    $set: updateParams.payload
                })
                return docs
            } catch (e) {
                throw e

            }



        }
        this.delete = async function (deleteParams) {
            try {

                const connection = await connect()
                const db = connection.db("employeedb")
                const collection = db.collection(deleteParams.collection)
                const docs = await collection.deleteOne(deleteParams.criteria)
                return docs
            } catch (e) {

                throw e
            }

        }
        this.readOne = async function (readOneParams) {
            try {
                const connection = await connect()
                const db = connection.db("employeedb")
                const collection = db.collection(readOneParams.collection)
                const doc = await collection.findOne(readOneParams.criteria, readOneParams.projection)
                return doc
            } catch (e) {
                throw e
            }


        }


    }

}
module.exports = DatabaseAwait