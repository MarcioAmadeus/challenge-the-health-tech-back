import { Joi } from "express-validation";

export const RegisterValidation = Joi.object({
    firt_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    passwordconfirm: Joi.string().required()
});