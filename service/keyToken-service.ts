import keytokenModel from "../model/keytoken.model";

export default class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken}) => {
        console.log("dang o day")
        try {

            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey: publicKey,
            //     privateKey: privateKey
            // });

            const filter = { user: userId } 
            const update = { publicKey , privateKey , refreshTokenUsed: [], refreshToken }
            const options = {upsert: true , new: true}

            const tokens =  await keytokenModel.findOneAndUpdate(filter, update , options)
            return tokens ? tokens : null;
        } catch (error) {
            console.log("Error exporting key:", error);
            return error;
        }
    }

    static findUserById = async (userId) => {
        return  await keytokenModel.findOne({user: userId}).lean();
    }
    static removeKeyById = async (userId) => {
        return await keytokenModel.deleteOne({user: userId})
    }

    static findRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({refreshTokenUsed: {$in: [refreshToken]}}).lean();
    }

    static findRefreshToken= async (refreshToken) => {
        return await keytokenModel.findOne({refreshToken: refreshToken});
    }

    static deleteKeyById = async (userId) => {
        return await keytokenModel.deleteOne({user: userId})
    }
}

