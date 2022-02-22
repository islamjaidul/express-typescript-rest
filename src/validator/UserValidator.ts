import Joi from "joi"

export default class UserValidator {
    private input: object
    
    constructor(input: object) {
        this.input = input
        if (input === null || input === undefined) throw new Error("Input is required")
    }

    private rules(): Joi.ObjectSchema {
        return Joi.object({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            email: Joi.string().email().required().messages({
                'any.required': `Email is a required field`
              }),
            password: Joi.string().min(6).max(18).required(),
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