import Joi from "joi"

export default class UserValidator {
    private input: object
    
    constructor(input: object) {
        this.input = input
        if (input === null || input === undefined) throw new Error("Input is required")
    }

    private rules(): Joi.ObjectSchema {
        return Joi.object({
            first_name: Joi.string().required().messages({
                "any.required": "First name is required field",
                "string.base": "First name must be string",
                "string.empty": "First name cannot be empty"
            }),
            last_name: Joi.string().required().messages({
                "any.required": "Last name is required field",
                "string.base": "Last name must be string",
                "string.empty": "Last name cannot be empty"
            }),
            email: Joi.string().email().required().messages({
                "any.required": "Email address is a required field",
                "string.base": "Email address must be string",
                "string.empty": "Email address cannot be empty",
                "string.email": "Email field must be valid email address"
              }),
            password: Joi.string().min(6).max(18).required().messages({
                "any.required": "Password is a required filed"
            }),
            confirm_password: Joi.ref("password")
        })
    }

    public async validateAsync(): Promise<any> {
        const options = {
            abortEarly: false, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: true // remove unknown props
        };

        return await this.rules().validateAsync(this.input, options)
    }
}