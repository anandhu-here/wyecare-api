"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../enums");
const ApiError_1 = __importDefault(require("../../exceptions/ApiError"));
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const strings_1 = __importDefault(require("../../constants/strings"));
const logger_1 = __importDefault(require("../../logger"));
class ProfileController {
    profileSvc;
    userSvc;
    _userSvc;
    _profileSvc;
    constructor(profileSvc, userSvc) {
        this.profileSvc = profileSvc;
        this.userSvc = userSvc;
        this._profileSvc = profileSvc;
        this._userSvc = userSvc;
    }
    getProfileDetails = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.GET) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        try {
            const currentUser = req.currentUser;
            const token = req.token;
            return res.status(statusCodes_1.default.OK).json({
                success: true,
                message: strings_1.default.SUCCESS,
                token: token,
                data: {
                    ...currentUser,
                },
            });
        }
        catch (error) {
            const errorMessage = error?.message || error || strings_1.default.SOMETHING_WENT_WRONG;
            logger_1.default.error("ProfileController: getProfileDetails", "errorInfo:" + JSON.stringify(error));
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: errorMessage,
            });
        }
    };
    getLinkedUsers = async (req, res) => {
        try {
            const currentUser = req.currentUser;
            const { accountType } = req.params;
            const linkedUsers = await this._profileSvc.getLinkedUsers(currentUser._id, accountType);
            return res.status(statusCodes_1.default.OK).json({
                success: true,
                message: "Linked users retrieved successfully",
                data: linkedUsers,
            });
        }
        catch (error) {
            const errorMessage = error?.message || error || strings_1.default.SOMETHING_WENT_WRONG;
            logger_1.default.error("UserController: getLinkedUsers", "errorInfo:" + JSON.stringify(error));
            return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: errorMessage,
            });
        }
    };
    updateAvailabilities = async (req, res) => {
        try {
            const currentUser = req.currentUser;
            const { dates } = req.body;
            if (!Array.isArray(dates) || dates.length === 0) {
                res
                    .status(statusCodes_1.default.BAD_REQUEST)
                    .json({ message: "Dates array is required and cannot be empty" });
                return;
            }
            const updatedUser = await this._profileSvc.updateAvailabilities(currentUser._id, dates);
            res.status(statusCodes_1.default.OK).json(updatedUser);
        }
        catch (error) {
            console.error("Error updating availabilities:", error);
            res
                .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: strings_1.default.INTERNAL_SERVER_ERROR });
        }
    };
    deleteAvailability = async (req, res) => {
        try {
            const currentUser = req.currentUser;
            const { date } = req.params;
            const updatedUser = await this._profileSvc.deleteAvailability(currentUser._id, date);
            res.status(statusCodes_1.default.OK).json(updatedUser);
        }
        catch (error) {
            console.error("Error deleting availability:", error);
            res
                .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: strings_1.default.INTERNAL_SERVER_ERROR });
        }
    };
    searchUsers = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.GET) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        try {
            const { accountType } = req.params;
            let { companyName } = req.query;
            if (!accountType && !companyName) {
                return next(new ApiError_1.default(strings_1.default.SEARCH_CRITERIA_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (companyName === undefined || companyName === "") {
                return res.status(statusCodes_1.default.OK).json({
                    success: true,
                    message: strings_1.default.SUCCESS,
                    data: [],
                });
            }
            if (typeof companyName === "string") {
                companyName = companyName.replace(/^['"]|['"]$/g, "");
            }
            const users = await this._userSvc.searchUsersExc(accountType, companyName);
            res.status(statusCodes_1.default.OK);
            return res.json({
                success: true,
                message: strings_1.default.SUCCESS,
                data: users,
            });
        }
        catch (error) {
            const errorMessage = error?.message || error || strings_1.default.SOMETHING_WENT_WRONG;
            logger_1.default.error("UserSearchController: searchUsers", "errorInfo:" + JSON.stringify(error));
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: errorMessage,
            });
        }
    };
    getUsers = async (req, res) => {
        try {
            const accountType = req.params.userType;
            if (accountType === undefined || accountType === "null") {
                return res.status(statusCodes_1.default.OK).json({
                    success: true,
                    message: strings_1.default.SUCCESS,
                    data: [],
                });
            }
            const users = await this._userSvc.getUsers(accountType);
            return res.status(statusCodes_1.default.OK).json({
                success: true,
                message: strings_1.default.SUCCESS,
                data: users,
            });
        }
        catch (error) {
            const errorMessage = error?.message || error || strings_1.default.SOMETHING_WENT_WRONG;
            logger_1.default.error("UserController: getUsers", "errorInfo:" + JSON.stringify(error));
            return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: errorMessage,
            });
        }
    };
}
exports.default = ProfileController;
//# sourceMappingURL=ProfileController.js.map