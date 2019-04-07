class SchemaInvalidError extends Error{
	constructor(errors){
		super();
		this.message="Invalid schema";
		this.error=errors;
	}
}
module.exports=SchemaInvalidError