require("dotenv").config();
const axios = require("axios");

module.exports = (req, res, next) => {
  try {
      const token = req.headers.authorization.split(" ")[1];
      console.log(token);
    httpRequestIsAuth(token).then((data) => {
      console.log(data);
      if (data?.isAuth) {
        next();
      } else {
        res.status(400).json({ message: "Vous n'êtes pas connecté" });
      }
    });
  } catch (error) {
    res.status(400).json({ message: "Vous n'êtes pas connecté" });
  }
};

async function httpRequestIsAuth(token) {
  try {
    const URL = "http://localhost:4002/auth/verify";
    const response = await axios.post(
      URL,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
