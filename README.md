<!-- $ mkdir -p  config models controllers routes middleware services utils tests/unit tests/integration && touch .env .gitignore app.js config/db.js config/config.js models/user.js models/product.js controllers/userController.js controllers/productController.js routes/userRoutes.js routes/productRoutes.js middleware/authMiddleware.js middleware/errorHandler.js services/userService.js utils/validation.js -->

Here’s my backend setup for reference:
- Installed npm packages: bcrypt, cors, dayjs, dotenv, express, express-async-handler, helmet, joi, jsonwebtoken, mongoose, morgan, multer, nodemailer
- Folder structure:
(src/config, src/middlewares, src/routes, src/controllers, src/models, src/utils, src/validations, src/app.js, src/server.js)
- Using MongoDB, JWT, Joi validation, Multer, Nodemailer
Continue from here.




PS E:\web2\next\backend> gcloud run services update timewatch-dashboard-bk `
>>   --service-account timewatch-dashboard-storage@second-height-468706-s4.iam.gserviceaccount.com `
>>   --project second-height-468706-s4 `
>>   --region europe-west1
