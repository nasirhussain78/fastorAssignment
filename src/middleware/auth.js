import jwt from "jsonwebtoken"


//Authentication ✅
const authentication = (req, res, next) => {
    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(400).send({ status: false, message: "token must be present" });
        let decodedToken = jwt.verify(token, "fastor");
        if (!decodedToken) return res.status(401).send("token invalid")
        next()
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
    
}

export default authentication;