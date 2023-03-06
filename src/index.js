import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import route from './routes/routes.js'
const app = express()

dotenv.config()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/',route);


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
})
  .then(() => console.log("MongoDb connected"))
  .catch(err => console.log(err))


app.listen(process.env.PORT || 3000, function () {
  console.log('Express app running on port ' + (process.env.PORT || 3000))
});