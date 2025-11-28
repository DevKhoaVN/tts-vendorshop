import AcessService from "../service/access-service"
import {OK, CREATED} from "../core/sucess.response"
import {Response, Request,NextFunction} from "express"

class AccessController{
    signup = async (req:Request, res: Response, next: NextFunction) => {
          new CREATED ({
             message: "Regiserted OK",
             metadata : await AcessService.signUp(req.body)
          }).send(res)
    }

    login = async (req:Request, res: Response, next: NextFunction) => {
        new OK({
            message: "Login success",
            metadata : await AcessService.logIn(req.body)
      }).send(res)
    }

    logout = async (req:Request, res: Response, next: NextFunction) => {

        new OK({
            message: "Logout success",
            metadata: await AcessService.logOut(req.body)
        }).send(res)
    }

    handleRefreshToken = async (req:Request, res: Response, next: NextFunction) =>{
         new OK({
            message: "Refresh Token sccuess",
            metadata: await AcessService.handleRefreshToken(req.body)
        }).send(res)
    }
       
}

export default new AccessController()


