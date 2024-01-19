const User = require("../models/userModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// module.exports.Verification = (req, res) => {
//   const token = req.cookies.token
//   if (!token) {
//     return res.json({ status: false })
//   }
//   jwt.verify(token, process.env.JWT_SECRET_KEY , async (err, data) => {
//     if (err) {
//      return res.json({ status: false })
//     } else {
//       const user = await User.findById(data.id)
//       console.log(user,'[[[[[[[[[[[[[');
//       if (user) return res.json({ status: true, user: user.userName })
//       else return res.json({ status: false })
//     }
//   })
// }

module.exports = (req, res, next) => {
    try { const token = req.headers.authorization.split(" ")[1];
   const decodedToken = jwt.verify(
     token,
     process.env.JWT_SECRET_KEY 
  ); req.userData = {
           email: decodedToken.email,
           userId: decodedToken.userId 
     };    next();
    } catch (error) {
      res.status(401).json({ message: "Auth failed!" });
    }
  };