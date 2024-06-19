import type ProfileService from "../../services/ProfileService";
import StatusCodes from "../../constants/statusCodes";
import StringValues from "../../constants/strings";
import ApiError from "../../exceptions/ApiError";
import MailServiceHelper from "../../helpers/MailServiceHelper";
import EmailTemplateHelper from "../../helpers/MailTemplateHelper";
import OtpServiceHelper from "../../helpers/OtpServiceHelper";
import type { IRegisterBodyData } from "../../interfaces/bodyData";
import type { IRequest, IResponse, INext } from "../../interfaces/core/express";
import type { IUser } from "../../interfaces/entities/user";
import Logger from "../../logger";
import type UserService from "../../services/UserService";
import Validators from "../../utils/validator";
import { EHttpMethod } from "../../enums";
import type ShiftService from "src/services/ShiftService";
import type { IUserShiftType } from "src/interfaces/entities/shift-types";
import type UserShiftTypeService from "src/services/ShiftTypeService";
import { Types, type ObjectId } from "mongoose";

class RegisterController {
  private readonly _userSvc: UserService;
  private readonly _profileSvc: ProfileService;
  private readonly _shiftSvc: ShiftService;

  constructor(
    readonly userSvc: UserService,
    readonly profileSvc: ProfileService,
    readonly shiftSvc: ShiftService
  ) {
    this._userSvc = userSvc;
    this._profileSvc = profileSvc;
    this._shiftSvc = shiftSvc;
  }

  /**
   * @name sendRegisterOtp
   * @description Perform send register otp action.
   * @param req IRequest
   * @param res IResponse
   * @param next INext
   * @returns Promise<any>
   */
  public sendRegisterOtp = async (
    req: IRequest,
    res: IResponse,
    next: INext
  ): Promise<any> => {
    if (req.method !== EHttpMethod.POST) {
      return next(
        new ApiError(StringValues.INVALID_REQUEST_METHOD, StatusCodes.NOT_FOUND)
      );
    }

    try {
      const {
        fname,
        lname,
        email,
        password,
        confirmPassword,
        company,
      }: IRegisterBodyData = req.body;

      if (!fname) {
        return next(
          new ApiError(
            StringValues.FIRST_NAME_REQUIRED,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (!lname) {
        return next(
          new ApiError(StringValues.LAST_NAME_REQUIRED, StatusCodes.BAD_REQUEST)
        );
      }

      if (!email) {
        return next(
          new ApiError(StringValues.EMAIL_REQUIRED, StatusCodes.BAD_REQUEST)
        );
      }

      if (!Validators.validateEmail(email)) {
        return next(
          new ApiError(
            StringValues.INVALID_EMAIL_FORMAT,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      // if (!Validators.validateUsername(username)) {
      //   return next(
      //     new ApiError(
      //       StringValues.INVALID_USERNAME_FORMAT,
      //       StatusCodes.BAD_REQUEST
      //     )
      //   );
      // }

      if (!password) {
        return next(
          new ApiError(StringValues.PASSWORD_REQUIRED, StatusCodes.BAD_REQUEST)
        );
      }

      if (password.length < 8) {
        return next(
          new ApiError(
            StringValues.PASSWORD_MIN_LENGTH_ERROR,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (password.length > 32) {
        return next(
          new ApiError(
            StringValues.PASSWORD_MAX_LENGTH_ERROR,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (!confirmPassword) {
        return next(
          new ApiError(
            StringValues.CONFIRM_PASSWORD_REQUIRED,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (confirmPassword.length < 8) {
        return next(
          new ApiError(
            StringValues.CONFIRM_PASSWORD_MIN_LENGTH_ERROR,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (confirmPassword.length > 32) {
        return next(
          new ApiError(
            StringValues.CONFIRM_PASSWORD_MAX_LENGTH_ERROR,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (password.trim() !== confirmPassword.trim()) {
        return next(
          new ApiError(
            StringValues.PASSWORDS_DO_NOT_MATCH,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      const _fname = fname?.trim();
      const _lname = lname?.trim();
      const _email = email?.toLowerCase().trim();

      const isEmailExists = await this._userSvc.checkIsEmailExistsExc(_email);
      if (isEmailExists) {
        res.status(StatusCodes.BAD_REQUEST);
        return res.json({
          success: false,
          message: StringValues.EMAIL_ALREADY_REGISTERED,
          isEmailUsed: true,
        });
      }

      // Generating OTP
      const newOtp = await OtpServiceHelper.generateOtpFromEmail(_email);

      if (!newOtp) {
        return next(
          new ApiError(StringValues.OTP_CREATE_ERROR, StatusCodes.BAD_REQUEST)
        );
      }

      // Sending Email
      const htmlMessage = await EmailTemplateHelper.getOtpEmail(
        newOtp.otp,
        `${_fname} ${_lname}`
      );

      if (htmlMessage) {
        await MailServiceHelper.sendEmail({
          to: _email,
          subject: "OTP For Registration",
          htmlContent: htmlMessage,
        });
      }

      res.status(StatusCodes.OK);
      return res.json({
        success: true,
        message: StringValues.SUCCESS,
      });
    } catch (error: any) {
      const errorMessage =
        error?.message || error || StringValues.SOMETHING_WENT_WRONG;

      Logger.error(
        "RegisterController: sendRegisterOtp",
        "errorInfo:" + JSON.stringify(error)
      );

      res.status(StatusCodes.BAD_REQUEST);
      return res.json({
        success: false,
        error: errorMessage,
      });
    }
  };

  /**
   * @name registerUser
   * @description Perform register user action.
   * @param req IRequest
   * @param res IResponse
   * @param next INext
   * @returns Promise<any>
   */
  public register = async (
    req: IRequest,
    res: IResponse,
    next: INext
  ): Promise<any> => {
    if (req.method !== EHttpMethod.POST) {
      return next(
        new ApiError(StringValues.INVALID_REQUEST_METHOD, StatusCodes.NOT_FOUND)
      );
    }

    try {
      const {
        fname,
        lname,
        email,
        password,
        confirmPassword,
        accountType,
        company,
        availabilities,
        ...additionalData
      }: IRegisterBodyData & Partial<Record<string, any>> = req.body;

      const { linkedUserId, linkedUserType } = additionalData;

      if (!fname) {
        return next(
          new ApiError(
            StringValues.FIRST_NAME_REQUIRED,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (!lname) {
        return next(
          new ApiError(StringValues.LAST_NAME_REQUIRED, StatusCodes.BAD_REQUEST)
        );
      }

      if (!email) {
        return next(
          new ApiError(StringValues.EMAIL_REQUIRED, StatusCodes.BAD_REQUEST)
        );
      }

      if (!Validators.validateEmail(email)) {
        return next(
          new ApiError(
            StringValues.INVALID_EMAIL_FORMAT,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      // if (!Validators.validateUsername(username)) {
      //   return next(
      //     new ApiError(
      //       StringValues.INVALID_USERNAME_FORMAT,
      //       StatusCodes.BAD_REQUEST
      //     )
      //   );
      // }

      if (!password) {
        return next(
          new ApiError(StringValues.PASSWORD_REQUIRED, StatusCodes.BAD_REQUEST)
        );
      }

      if (password.length < 8) {
        return next(
          new ApiError(
            StringValues.PASSWORD_MIN_LENGTH_ERROR,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (password.length > 32) {
        return next(
          new ApiError(
            StringValues.PASSWORD_MAX_LENGTH_ERROR,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (!confirmPassword) {
        return next(
          new ApiError(
            StringValues.CONFIRM_PASSWORD_REQUIRED,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (confirmPassword.length < 8) {
        return next(
          new ApiError(
            StringValues.CONFIRM_PASSWORD_MIN_LENGTH_ERROR,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (confirmPassword.length > 32) {
        return next(
          new ApiError(
            StringValues.CONFIRM_PASSWORD_MAX_LENGTH_ERROR,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      if (password.trim() !== confirmPassword.trim()) {
        return next(
          new ApiError(
            StringValues.PASSWORDS_DO_NOT_MATCH,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      const _fname = fname?.trim();
      const _lname = lname?.trim();
      const _email = email?.toLowerCase().trim();

      const isEmailExists = await this._userSvc.checkIsEmailExistsExc(_email);
      if (isEmailExists) {
        res.status(StatusCodes.BAD_REQUEST);
        return res.json({
          success: false,
          message: StringValues.EMAIL_ALREADY_REGISTERED,
          isEmailUsed: true,
        });
      }

      const _currentDateTime = new Date(Date.now());

      // Create User
      const newUserData: IUser = {
        fname: _fname,
        lname: _lname,
        nameChangedAt: _currentDateTime,
        email: _email,
        isEmailVerified: true,
        emailChangedAt: _currentDateTime,
        accountType: accountType,
        company: company,
        availabilities: availabilities,
      };
      if (linkedUserId && linkedUserType) {
        newUserData.linkedUsers = [
          {
            accountType: linkedUserType,
            users: [linkedUserId],
          },
        ];
      }
      console.log("newUserData", newUserData);

      const newUser = await this._userSvc.createUserExc(newUserData);

      if (linkedUserId && linkedUserType) {
        const existingUser = await this._userSvc.findUserByIdExc(linkedUserId);

        if (existingUser) {
          // Check if the existingUser already has linkedUsers
          if (!existingUser.linkedUsers) {
            existingUser.linkedUsers = [];
          }

          // Check if the linkedUserType already exists in the linkedUsers array
          const existingLinkedUserType = existingUser.linkedUsers.find(
            (linkedUser) => linkedUser.accountType === newUserData.accountType
          );

          console.log("existingLinkedUserType", existingLinkedUserType);

          if (existingLinkedUserType) {
            existingLinkedUserType.users.push(newUser._id as ObjectId);
          } else {
            // If the linkedUserType doesn't exist, create a new entry in the linkedUsers array
            existingUser.linkedUsers.push({
              accountType: newUser.accountType,
              users: [newUser._id as ObjectId],
            });
          }

          // Save the updated existingUser
          await this._userSvc.updateUser(
            existingUser._id as string,
            existingUser
          );
        }
      }

      // Set Password
      await newUser.setPassword(password.trim());

      await this._profileSvc.getProfileExc(newUser);
      const authToken = await newUser.getToken();

      res.status(StatusCodes.CREATED);
      return res.json({
        success: true,
        message: StringValues.SUCCESS,
        data: {
          token: authToken.token,
          expiresAt: authToken.expiresAt,
        },
      });
    } catch (error: any) {
      const errorMessage =
        error?.message || error || StringValues.SOMETHING_WENT_WRONG;

      Logger.error(
        "RegisterController: register",
        "errorInfo:" + JSON.stringify(error)
      );

      res.status(StatusCodes.BAD_REQUEST);
      return res.json({
        success: false,
        error: errorMessage,
      });
    }
  };
  /**
   * @name linkUser
   * @description Link a user to the currently authenticated user.
   * @param req IRequest
   * @param res IResponse
   * @returns Promise<any>
   */
  public linkUser = async (req: IRequest, res: IResponse): Promise<any> => {
    try {
      const currentUser = req.currentUser;
      const { linkedUserId, linkedUserType } = req.body;

      if (!linkedUserId || !linkedUserType) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Linked user ID and type are required",
        });
      }

      const linkedUser = await this._userSvc.findUserByIdExc(linkedUserId);

      if (!linkedUser) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Linked user not found",
        });
      }

      // Check if the currentUser already has linkedUsers
      if (!currentUser.linkedUsers) {
        currentUser.linkedUsers = [];
      }

      // Check if the linkedUserType already exists in the currentUser's linkedUsers array
      const existingLinkedUserType = currentUser.linkedUsers.find(
        (linkedUser) => linkedUser.accountType === linkedUserType
      );

      if (existingLinkedUserType) {
        // If the linkedUserType already exists, check if the linkedUser is already linked
        const isAlreadyLinked = existingLinkedUserType.users.some(
          (userId) => userId.toString() === linkedUserId
        );

        if (isAlreadyLinked) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "User is already linked",
          });
        }

        existingLinkedUserType.users.push(linkedUserId);
      } else {
        // If the linkedUserType doesn't exist, create a new entry in the currentUser's linkedUsers array
        currentUser.linkedUsers.push({
          accountType: linkedUserType,
          users: [linkedUserId],
        });
      }

      // Save the updated currentUser
      await this._userSvc.updateUser(currentUser._id as string, currentUser);

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "User linked successfully",
      });
    } catch (error: any) {
      const errorMessage =
        error?.message || error || StringValues.SOMETHING_WENT_WRONG;

      Logger.error(
        "UserController: linkUser",
        "errorInfo:" + JSON.stringify(error)
      );

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: errorMessage,
      });
    }
  };
  /**
   * @name removeLinkedUser
   * @description Remove a linked user from the currently authenticated user.
   * @param req IRequest
   * @param res IResponse
   * @returns Promise<any>
   */
  public removeLinkedUser = async (
    req: IRequest,
    res: IResponse
  ): Promise<any> => {
    try {
      const currentUser = req.currentUser;
      const { linkedUserType, linkedUserId } = req.body;

      if (!linkedUserType || !linkedUserId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Linked user type and ID are required",
        });
      }

      const updatedUser = await this._userSvc.removeLinkedUser(
        currentUser._id as string,
        linkedUserType,
        linkedUserId
      );

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Linked user removed successfully",
        data: updatedUser,
      });
    } catch (error: any) {
      const errorMessage =
        error?.message || error || StringValues.SOMETHING_WENT_WRONG;

      Logger.error(
        "UserController: removeLinkedUser",
        "errorInfo:" + JSON.stringify(error)
      );

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: errorMessage,
      });
    }
  };
}

export default RegisterController;
