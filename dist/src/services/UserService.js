"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
const User_1 = __importDefault(require("../models/User"));
class UserService {
    createUserExc = async (_user) => {
        try {
            const user = await User_1.default.create(_user);
            return Promise.resolve(user);
        }
        catch (error) {
            logger_1.default.error("UserService: createUserExc", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
    searchUsersExc = async (accountType, companyName) => {
        try {
            let query = {};
            if (accountType) {
                query.accountType = accountType;
            }
            if (companyName) {
                const searchRegex = new RegExp(companyName.replace(/\s+/g, "|"), "i");
                query.$or = [
                    { "company.name": { $regex: searchRegex } },
                    { fname: { $regex: searchRegex } },
                    { lname: { $regex: searchRegex } },
                ];
            }
            const users = await User_1.default.find(query).select("_id fname lname email company.name company.address");
            return Promise.resolve(users);
        }
        catch (error) {
            logger_1.default.error("UserSearchService: searchUsersExc", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
    findUserByIdExc = async (_userId) => {
        try {
            const user = await User_1.default.findById(_userId);
            return Promise.resolve(user);
        }
        catch (error) {
            logger_1.default.error("UserService: findUserByIdExc", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
    findUserByEmailExc = async (_email) => {
        try {
            const user = await User_1.default.findOne({ email: _email }).populate("company");
            return Promise.resolve(user);
        }
        catch (error) {
            logger_1.default.error("UserService: findUserByEmailExc", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
    getUsers = async (userType) => {
        try {
            const users = await User_1.default.find({
                accountType: userType,
            }).select("_id fname lname company.name company.address");
            return Promise.resolve(users);
        }
        catch (error) {
            logger_1.default.error("UserService: getUsers", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
    checkIsEmailExistsExc = async (_email) => {
        try {
            const user = await User_1.default.findOne({ email: _email });
            if (!user) {
                return Promise.resolve(false);
            }
            return Promise.resolve(true);
        }
        catch (error) {
            logger_1.default.error("UserService: checkIsEmailExistsExc", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
    checkIsUsernameExistsExc = async (_username) => {
        try {
            const user = await User_1.default.findOne({ username: _username });
            if (!user) {
                return Promise.resolve(false);
            }
            return Promise.resolve(true);
        }
        catch (error) {
            logger_1.default.error("UserService: checkIsUsernameExistsExc", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
    checkIsPhoneExistsExc = async (_phone) => {
        try {
            const user = await User_1.default.findOne({ phone: _phone });
            if (!user) {
                return Promise.resolve(false);
            }
            return Promise.resolve(true);
        }
        catch (error) {
            logger_1.default.error("UserService: checkIsEmailExistsExc", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
    async updateUser(userId, updateData) {
        try {
            const updatedUser = await User_1.default.findByIdAndUpdate(userId, updateData, {
                new: true,
                runValidators: true,
            }).exec();
            if (!updatedUser) {
                throw new Error("User not found");
            }
            return updatedUser;
        }
        catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }
    async removeLinkedUser(userId, linkedUserType, linkedUserId) {
        try {
            const user = await User_1.default.findById(userId).exec();
            if (!user) {
                throw new Error("User not found");
            }
            const linkedUserIndex = user.linkedUsers.findIndex((linkedUser) => linkedUser.accountType === linkedUserType &&
                linkedUser.users.some((userId) => userId.toString() === linkedUserId));
            if (linkedUserIndex !== -1) {
                user.linkedUsers[linkedUserIndex].users = user.linkedUsers[linkedUserIndex].users.filter((userId) => userId.toString() !== linkedUserId);
                if (user.linkedUsers[linkedUserIndex].users.length === 0) {
                    user.linkedUsers.splice(linkedUserIndex, 1);
                }
                await user.save();
            }
            return user;
        }
        catch (error) {
            console.error("Error removing linked user:", error);
            throw error;
        }
    }
}
exports.default = UserService;
//# sourceMappingURL=UserService.js.map