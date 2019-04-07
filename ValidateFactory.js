const AJV = require("ajv")
const AJVValidator = new AJV()
const SchemaInvalidError=require("./error/SchemaInvalidError")
class ValidateFactory{
	static validate(schemaName,data){
		const schema=SCHEMAS[schemaName]
		const valid=AJVValidator.validate(schema,data)
		if (!valid) {
			throw new SchemaInvalidError(AJVValidator.errors)
		}else{
			return valid;
		}
	}
}
const SCHEMAS={
	"employeePostSchema":require("./EmployeeSchema").postSchema,
	"employeePutSchema":require("./EmployeeSchema").putSchema
}
module.exports=ValidateFactory

