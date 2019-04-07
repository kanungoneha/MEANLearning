const loki = require("lokijs")
const inMemoryDB = new loki('loki.json',{"env":"NODEJS","verbose":true})
class LokiCache{
    static load(loadParams){
        const collection = inMemoryDB.addCollection(loadParams.collection)
        collection.insert(loadParams.data)
    }
    static get(readParams){
        const collection = inMemoryDB.getCollection(readParams.collection)
        let documents = collection.find(readParams.criteria)
        if(readParams.projection){
            documents = documents.map(document=>{
                const newDoc = {}
                for (let key in readParams.projection){
                    if(readParams.projection[key] === 1)
                        newDoc[key] = document[key]
                }
                return newDoc
            })
        }
        return documents
    }
    static update(updateParams){
     //   const collection = inMemoryDB.getCollection(updateParams.collection)
       // let documents = collection.find(updateParams.criteria)
       // if(updateParams.criteria){


       // }
       const collection = inMemoryDB.getCollection(updateParams.collection)
       collection.updateWhere(updateParams.filterFunction,updateParams.updateFunction)
      // console.log(`${updateParams.filterFunction.item}-${updateParams.updateFunction}`)
       return "done"
    }
    static getDocument(readOneParams){
        const documents = LokiCache.get(readOneParams)
        return documents[0]
    }
    static drain(targetCollection){
        const collection = inMemoryDB.getCollection(targetCollection)
        collection.clear()
    }
}
module.exports = LokiCache