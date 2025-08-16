import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    email: String,
    location: String,
    message: String
}, { timestamps: true });



export const FormModel = mongoose.model("Form", formSchema);

