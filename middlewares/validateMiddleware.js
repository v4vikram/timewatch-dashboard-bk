export function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const formattedErrors = {};
            error.details.forEach(err => {
                const field = err.path[0]; // Joi gives ["fieldName"]
                formattedErrors[field] = err.message;
            });

            return res.status(400).json({ errors: formattedErrors });
        }

        req.body = value;
        next();
    };
}
