var admin = require("firebase-admin");

var serviceAccount = require("./clickerkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
db=admin.firestore();


const express = require("express")
var cors = require("cors")
const app = express()
const nodemailer = require("nodemailer")


let ref = db.collection("OTP");
require('dotenv').config();






app.use(cors({
  origin: '*',
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));
const PORT = process.env.PORT || 5000



app.use(express.json())
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'gj7097@srmist.edu.in',
      pass: 'Indu1971$'
  }
});
function generateOtp(email){
    var text = "";
    var possible = "0123456789";
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
   ref.add({
       Email:email,
       onetimepassword:text
   })
   return text;
}

app.get("/",(req,res)=>{
  res.send("Express app")
})


app.post("/send", (req, res) => {
 res.header("Access-Control-Allow-Origin","*");
 res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept")
const { email } = req.body
let text=generateOtp(email);
console.log(email)
transporter.sendMail({
to:email,
from: "gj7097@srmist.edu.in",
subject:"Clicker Game OTP",
html:`<h3>Dear user,</h3>
<p>This is your one time password:</p>
<p>${text}</p>`
}).then(resp => {
res.json({resp})
})
.catch(err => {
console.log(err)
})
})
app.listen(PORT,()=>{
console.log("server is running on",PORT)
})


