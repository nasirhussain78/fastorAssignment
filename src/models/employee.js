import mongoose from "mongoose"

const employeeSchema = new mongoose.Schema({
   
    name: {
        type: String,
        require:true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    lead: [
        { 
            type:mongoose.Schema.Types.ObjectId,
            ref: "PublicForm"
        }
    ],
    designation : {
        type: String
    },
    isActive : {
        type: Boolean,
        default: true

    }
}, { timestamps: true })




export default mongoose.model('Employee', employeeSchema)