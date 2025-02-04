import Joi, {object} from "joi";

export const signUpSchema = Joi.object({
    email: Joi.string()
      .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "io", "ai"] },
      }),
    firstName: Joi.string().alphanum().min(3).max(30).required(),
    lastName: Joi.string().alphanum().min(3).max(30).required(),
    role: Joi.string(),
    password: Joi.string()
      .min(4)
      .max(60)
      .pattern(
        new RegExp("^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:'\"<>,./?|`~]*$")
      )
      .messages({
        "string.pattern.base":
          "Password must contain only alphanumeric and special characters",
      })
      .required(),
    userName: Joi.string().min(4).max(60).alphanum().required(),
   
  });

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .pattern(/^[^\s@]+@[^\s@]+\.(com|net|io|ai)$/)
    .messages({
      "string.email": 'The email must contain @ symbol and a valid domain',
      "string.pattern.base": 'The email domain must end with .com, .net, .io, or .ai',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(4)
    .max(60)
    .pattern(
      new RegExp("^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:'\"<>,./?|`~]*$")
    )
    .messages({
      "string.pattern.base":
        "Password must contain only alphanumeric and special characters",
    })
    .required(),
});