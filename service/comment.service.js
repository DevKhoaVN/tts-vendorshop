
const { comment, comment } = require("../model/comment.model");
const { NotFoundError } = require("../core/error.response");
const { findProductById } = require("../model/repository/product.repo");

class CommentService{
    static async createComment({
        productId, userId, content, parentCommentId = null
    }){
         //tao comment
         const newComment = new comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
         })

         let rightValue 
         if(parentCommentId){
          //reply parent
          const parentComment = await comment.findById(parentCommentId)
          if(!parentComment) throw new NotFoundError('Comment not found')

          rightValue = parentComment.comment_right

          await comment.updateMany({
            comment_productId: productId,
            comment_right: {$gte: rightValue}
          }, {$inc: {comment_right: 2}})

          await comment.updateMany({
            comment_productId: productId,
            comment_left: {$gt: rightValue}
          }, {$inc: {comment_left: 2}})
         }else{
            
            const maxRightValue = await comment.findOne({
                comment_productId: productId,
            }, 'comment_right', {sort: {comment_right: -1}})

            if(maxRightValue){
                rightValue = maxRightValue.right + 1
            }else{
                rightValue = 1
            }
         }

         //chen comment
         newComment.comment_left = rightValue
         newComment.comment_right = rightValue + 1

         // save
         await newComment.save()
         return newComment
    }

    static async getComments({
        productId, parentCommentId = null,limit =  50,offset = 0
    }){
        if(parentCommentId){
            const parent = await comment.findById(productId)
            if(!parent) throw new NotFoundError('comment not found')

             const comments = await comment.find({
                comment_productId: productId,
                comment_left: {$gt: parent.comment_left},
                comment_right: {$lte: parent.comment_right}
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({
                comment_left:1
            })

            return comments
        }

        const comments = await comment.find({
            comment_productId: productId,
            comment_parentId: parentCommentId
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1
        }).sort({
            comment_left:1
        })

         return comments
    }

    static async deleteComment({productId, coment_Id}){
        const foundProduct = await findProductById(productId)
        if(!foundProduct) throw new NotFoundError("product not found")

        const comments = await comment.findById(coment_Id)
        if(!comments) throw new NotFoundError("Commment not found")
        
        const rightValue = comments.comment_right
        const leftValue = comments.comment_left

        const width = rightValue - leftValue + 1

        // xoa comment
         await comment.deleteMany({
            comment_productId: productId,
            comment_left: {$gte: leftValue} ,
            comment_right: {$lte: rightValue}
        })

        // update trai
        await comment.updateMany({
            comment_productId: productId,
            comment_left: {$gt: rightValue}
        },{
            $inc:{
                comment_left: -width
            }
        })

        // update phai
        await comment.updateMany({
            comment_productId: productId,
            comment_right: {$gt: rightValue}
        },{
            $inc:{
                right: -width
            }
        })

        return true

    }

    static async updateComment({productId, comment_Id, content}){
        const foundProduct = await findProductById(productId)
        if(!foundProduct) throw new NotFoundError("not found product")

        const comments = await comment.findByIdAndUpdate(comment_Id, {
            comment_content: content
        }, {upsert: true, new: true})

        return comments
    }
}

module.exports = CommentService