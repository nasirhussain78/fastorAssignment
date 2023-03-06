import mongoose from "mongoose"

const publicFormSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    interest: {
        type: String,
        require: true
    },
    type: {
        type: String
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    isClaim: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


export default mongoose.model('PublicForm', publicFormSchema)