import EmployeeModel from "../models/employee.js";
import PublicFormModel from "../models/publicForm.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const saltrounds = 10;


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}


const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}


class Controller {
    //1✅Register Employee
    async createEmployee(req, res) {
        try {
            const data = req.body;
            const { name, email, password, phone, lead, designation } = data;

            if (!isValidRequestBody(data)) {
                return res.status(400).send({ status: false, message: 'Please provide details' })
            }

            if (!isValid(name)) {
                return res.status(400).send({ status: false, message: 'name is required' })
            }
            //Email validation
            if (!isValid(email)) {
                return res.status(400).send({ status: false, message: 'Email is required' })
            }

            if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email))) {
                return res.status(400).send({ status: false, msg: "Please provide a valid email" })
            }

            const duplicateEmail = await EmployeeModel.findOne({ email });

            if (duplicateEmail) {
                return res.status(400).send({ status: false, message: `${email} email address is already registered` })
            }

            //Phone validation
            if (!isValid(phone)) {
                return res.status(400).send({ status: false, message: 'Phone number is required' })
            }
            const duplicatePhone = await EmployeeModel.findOne({ phone });
            if (duplicatePhone) {
                return res.status(400).send({ status: false, message: `${phone} phone number is already registered` })
            }

            if (!(/^([+]\d{2})?\d{10}$/.test(phone))) {
                return res.status(400).send({ status: false, msg: 'please provide a valid moblie Number' })
            }

            if (!isValid(password)) {
                return res.status(400).send({ status: false, message: 'password is required' })
            }

            let hashPassword = bcrypt.hashSync(password, saltrounds);

            const employeeData = { name, email, phone, password: hashPassword, lead, designation };

            const result = await EmployeeModel.create(employeeData);

            return res.status(201).send({ status: true, msg: "successfully created", data: result });

        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }


    //2✅ Public form api
    async createForm(req, res) {
        try {

            const data = req.body;
            const { name, email, interest, type, gender, employee } = data;

            if (!isValidRequestBody(data)) {
                return res.status(400).send({ status: false, message: 'Please provide details' })
            }
            if (!isValid(name)) {
                return res.status(400).send({ status: false, message: 'name is required' })
            }
            if (!isValid(email)) {
                return res.status(400).send({ status: false, message: 'email is required' })
            }
            if (!isValid(interest)) {
                return res.status(400).send({ status: false, message: 'interest is required' })
            }

            const result = await PublicFormModel.create(data);
            return res.status(201).send({ status: true, msg: "successfully created", data: result });

        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }


    //3✅ api to claim lead
    async claimLead(req, res) {
        try {
            let data = req.body;
            let { formId, employeeId } = data;
            let claim = await PublicFormModel.find();
            if (claim.isClaim) {
                return res.status(400).send("error")
            } else {
                await PublicFormModel.findOneAndUpdate(
                    { _id: formId },
                    { $set: { isClaim: true, employee: employeeId } }
                );

            }
            await EmployeeModel.findOneAndUpdate(
                { _id: employeeId },
                { $push: { lead: formId } }
            );

            return res.status(200).send({ status: true, msg: "successfully calimed", data: result });

        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }


    //4✅ fetch unclaimed leads
    async unclaimedLeads(req, res) {
        try {
            const result = await PublicFormModel.find({ isDeleted: false, isClaim: false });
            return res.status(200).send({ status: true, msg: "successfully", data: result });
        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }

    //5✅fetch claimed leads 
    async leadClaimByLoggedInUser(req, res) {
        try {
            let employeeId = req.query.id;
            let claim = await EmployeeModel.findById(employeeId).populate("lead");
            return res.status(200).send({ status: true, msg: "claimed leads", data: claim });
        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }

    //6✅ Login
    async loginEmployee(req, res) {
        try {
            let data = req.body
            if (!isValidRequestBody(data)) {
                return res.status(400).send({ status: false, message: 'Please provide employee details' })
            }
            const { email, password } = data

            if (!isValid(email)) {
                return res.status(400).send({ status: false, message: "email is required" })
            }
            if (!isValid(password)) {
                return res.status(400).send({ status: false, message: "passwords is required" })
            }

            if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email))) { return res.status(400).send({ status: false, message: "Please provide a valid email" }) }


            let employee = await EmployeeModel.findOne({ email });

            if (!employee)
                return res.status(404).send({
                    status: false,
                    msg: "Login failed! No employee found with the provided email.",
                });

            const isValidPassword = await bcrypt.compare(password, employee.password)

            if (!isValidPassword)
                return res.status(404).send({
                    status: false,
                    msg: "Login failed! Wrong password.",
                });

            //token 1 hour expire time
            let token = jwt.sign(
                {
                    employeeId: employee._id,
                },
                 "fastor",
                { expiresIn: "1h" }
            );
            res.status(200).setHeader("x-api-key", token);
            return res.status(201).send({ status: "LoggedIn", message: 'Success', TOKEN: token });
        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }
}

export default new Controller()

