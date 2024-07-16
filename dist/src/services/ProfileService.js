"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
const User_1 = __importDefault(require("src/models/User"));
class ProfileService {
    getProfileExc = async (currentUser) => {
        try {
            return Promise.resolve(currentUser);
        }
        catch (error) {
            logger_1.default.error("ProfileService: getProfileExc", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
    async getLinkedUsers(userId, accountType) {
        try {
            console.log(accountType, "andi");
            const user = await User_1.default.findById(userId).exec();
            if (!user) {
                throw new Error("User not found");
            }
            let linkedUsers = user.linkedUsers;
            if (accountType) {
                linkedUsers = linkedUsers.filter((linkedUser) => linkedUser.accountType === accountType);
            }
            const populatedLinkedUsers = [];
            for (const linkedUser of linkedUsers) {
                if (linkedUser.accountType === accountType) {
                    const userIds = linkedUser.users;
                    const users = await User_1.default.find({ _id: { $in: userIds } })
                        .select("-password")
                        .exec();
                    populatedLinkedUsers.push({
                        accountType: linkedUser.accountType,
                        users: users,
                    });
                }
            }
            return populatedLinkedUsers;
        }
        catch (error) {
            console.error("Error getting linked users:", error);
            throw error;
        }
    }
    async updateAvailabilities(userId, dates) {
        try {
            const user = await User_1.default.findById(userId).exec();
            if (!user) {
                throw new Error("User not found");
            }
            if (!user.availabilities) {
                user.availabilities = {
                    dates: [],
                };
            }
            user.availabilities.dates = [
                ...new Set([...user.availabilities.dates, ...dates]),
            ];
            await user.save();
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async deleteAvailability(userId, date) {
        try {
            const user = await User_1.default.findById(userId).exec();
            if (!user) {
                throw new Error("User not found");
            }
            if (!user.availabilities) {
                return user;
            }
            user.availabilities.dates = user.availabilities.dates.filter((d) => d !== date);
            await user.save();
            return user;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = ProfileService;
//# sourceMappingURL=ProfileService.js.map