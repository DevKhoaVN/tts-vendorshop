const AcessService = require("../service/access.service")
const {OK , CREATED} = require("../core/sucess.response")

class AccessController{
    signup = async (req, res, next) => {
          new CREATED ({
             message: "Regiserted OK",
             metadata : await AcessService.signUp(req.body)
          }).send(res)
    }

    login = async (req, res, next) => {
        new OK({
            message: "Login success",
            metadata : await AcessService.logIn(req.body)
      }).send(res)
    }

    logout = async (req, res, next) => {

        new OK({
            message: "Logout success",
            metadata: await AcessService.logOut(req.keyStore)
        }).send(res)
    }

    handleRefreshToken = async (req,res, next) => {
        new OK({
            message: "Refresh Token sccuess",
            metadata: await AcessService.handleRefreshToken(req.body)
        }).send(res)
    }
}

module.exports = new AccessController()