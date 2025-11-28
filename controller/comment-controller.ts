const { OK } = require("../core/sucess.response")
const CommentService = require ("../service/comment.service")
class CheckoutController{
    createComment = async (req, res, next) => {
        new OK({
            message: "createComment success",
            metadata: await CommentService.createComment(req.body)
        }).send(res)
    }
    
    getComments = async (req, res, next) => {
          new OK({
            message: "get comments success",
            metadata: await CommentService.getComments(req.query)
        }).send(res)
    }
    deleteComment = async (req, res, next) => {
          new OK({
            message: "get comments success",
            metadata: await CommentService.deleteComment(req.body)
        }).send(res)
    }
    getComments = async (req, res, next) => {
          new OK({
            message: "get comments success",
            metadata: await CommentService.updateComment(req.body)
        }).send(res)
    }

}

module.exports = new CheckoutController