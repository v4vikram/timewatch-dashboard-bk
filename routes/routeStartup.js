import productRoutes from "./productRoutes.js";
import formRoutes from "./formRoutes.js";
import blogRoutes from "./blogRoutes.js";
import authRoutes from "./authRoutes.js";
import postRoutes from "./postRoutes.js";


const routeStartup = (app) => {

    // product routes
    app.use("/api/product", productRoutes);
    // form routes
    app.use("/api/form", formRoutes);
    // blog routes
    app.use("/api/blog", blogRoutes);

    // auth
    app.use("/api/auth", authRoutes);

    // post
    // app.use("/api/post", postRoutes);
    

}

export default routeStartup;