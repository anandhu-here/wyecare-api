import type UserService from "../../services/UserService";
import StatusCodes from "../../constants/statusCodes";
import StringValues from "../../constants/strings";
import ApiError from "../../exceptions/ApiError";
import MailServiceHelper from "../../helpers/MailServiceHelper";
import MailTemplateHelper from "../../helpers/MailTemplateHelper";
import OtpServiceHelper from "../../helpers/OtpServiceHelper";
import type { IRequest, IResponse, INext } from "../../interfaces/core/express";
import Logger from "../../logger";
import User from "../../models/User";
import Validators from "../../utils/validator";
import { EHttpMethod } from "../../enums";
import type { ILoginBodyData } from "../../interfaces/bodyData";
import LocalConfig from "src/configs/LocalConfig";
import jwt from "jsonwebtoken";
import AuthToken from "src/models/AuthToken";

class LoginController {
  private readonly _userSvc: UserService;

  constructor(readonly userSvc: UserService) {
    this._userSvc = userSvc;
  }

  /**
   * @name sendLoginOtp
   * @description Perform send login otp action.
   * @param req IRequest
   * @param res IResponse
   * @param next INext
   * @returns Promise<any>
   */
  public sendLoginOtp = async (
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
      const { email }: ILoginBodyData = req.body;

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

      const _email = email?.toLowerCase().trim();

      const user = await User.findOne({ email: _email });

      if (!user) {
        return next(
          new ApiError(
            StringValues.EMAIL_NOT_REGISTERED,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      // Generating OTP
      const newOtp = await OtpServiceHelper.generateOtpFromEmail(user.email);

      if (!newOtp) {
        return next(
          new ApiError(StringValues.OTP_CREATE_ERROR, StatusCodes.BAD_REQUEST)
        );
      }

      const htmlMessage = await MailTemplateHelper.getOtpEmail(
        newOtp.otp,
        `${user.fname} ${user.lname}`
      );

      if (htmlMessage) {
        await MailServiceHelper.sendEmail({
          to: user.email,
          subject: "OTP For Login",
          htmlContent: htmlMessage,
        });
      }

      res.status(StatusCodes.OK);
      return res.json({
        success: true,
        message: StringValues.SUCCESS,
        otp: newOtp.otp,
      });
    } catch (error: any) {
      const errorMessage =
        error?.message || error || StringValues.SOMETHING_WENT_WRONG;

      Logger.error(errorMessage);

      res.status(StatusCodes.BAD_REQUEST);
      return res.json({
        success: false,
        error: errorMessage,
      });
    }
  };

  public checkUser = async (
    req: IRequest,
    res: IResponse,
    next: INext
  ): Promise<any> => {
    if (req.method !== EHttpMethod.GET) {
      return next(
        new ApiError(StringValues.INVALID_REQUEST_METHOD, StatusCodes.NOT_FOUND)
      );
    }

    Logger.info("Check User Start");

    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];

      if (!token) {
        return next(
          new ApiError(
            StringValues.BEARER_TOKEN_REQUIRED,
            StatusCodes.UNAUTHORIZED
          )
        );
      }
      Logger.info("Validation Start");
      Logger.info("Check Email Exists Start");

      const jwtSecret = LocalConfig.getConfig().JWT_SECRET!;

      if (!jwtSecret) throw new Error(StringValues.JWT_SECRET_NOT_FOUND);
      const decodedData = jwt.verify(token, jwtSecret) as { id: string };

      if (!decodedData || typeof decodedData === "string") {
        Logger.error(`JwtError :: An error occurred while verifying JwtToken`);
        throw new Error(StringValues.JWT_TOKEN_INVALID);
      }

      const authToken = await AuthToken.findOne({
        token: token,
        userId: decodedData.id,
      });

      if (!authToken) {
        Logger.error(`AuthToken :: Token not found`);
        throw new Error(StringValues.JWT_TOKEN_INVALID);
      }

      console.log(authToken, "authooo");

      const user = await User.findById(decodedData.id);

      if (!user) {
        Logger.error(`User :: User not found`);
        throw new Error(StringValues.USER_NOT_FOUND);
      }

      Logger.info(`AuthToken :: Token verified`);
      Logger.info("Check User End");

      res.status(StatusCodes.OK);

      const resData = {
        token: authToken.token,
        expiresAt: authToken.expiresAt,
      };
      return res.json({
        success: true,
        message: StringValues.SUCCESS,
        data: resData,
      });
    } catch (error: any) {
      const errorMessage =
        error?.message || error || StringValues.SOMETHING_WENT_WRONG;

      Logger.error(
        "LoginController: checkUser",
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
   * @name login
   * @description Perform login user action.
   * @param req IRequest
   * @param res IResponse
   * @param next INext
   * @returns Promise<any>
   */
  public login = async (
    req: IRequest,
    res: IResponse,
    next: INext
  ): Promise<any> => {
    if (req.method !== EHttpMethod.POST) {
      return next(
        new ApiError(StringValues.INVALID_REQUEST_METHOD, StatusCodes.NOT_FOUND)
      );
    }

    Logger.info("Login Start");

    try {
      const { email, password }: ILoginBodyData = req.body;

      Logger.info("Validation Start");

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

      Logger.info("Validation End");

      const _email = email?.toLowerCase().trim();
      const _password = password?.trim();

      Logger.info("Check Email Exists Start");

      const isEmailExists = await this._userSvc.checkIsEmailExistsExc(_email);
      Logger.info("Check Email Exists End");
      if (!isEmailExists) {
        return next(
          new ApiError(
            StringValues.EMAIL_NOT_REGISTERED,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      Logger.info("Find User Start");
      const user = await this._userSvc.findUserByEmailExc(_email);
      Logger.info("Find User End");

      Logger.info("Match Password Start");
      const isPasswordMatched = await user.matchPassword(_password);
      Logger.info("Match Password End");

      if (!isPasswordMatched) {
        return next(
          new ApiError(StringValues.INCORRECT_PASSWORD, StatusCodes.BAD_REQUEST)
        );
      }

      Logger.info("Get Token Start");
      const authToken = await user.getToken();
      Logger.info("Get Token End");

      const resData = {
        token: authToken.token,
        expiresAt: authToken.expiresAt,
      };

      Logger.info("Login End");

      res.status(StatusCodes.OK);
      return res.json({
        success: true,
        message: StringValues.SUCCESS,
        data: resData,
      });
    } catch (error: any) {
      const errorMessage =
        error?.message || error || StringValues.SOMETHING_WENT_WRONG;

      Logger.error(
        "LoginController: login",
        "errorInfo:" + JSON.stringify(error)
      );

      res.status(StatusCodes.BAD_REQUEST);
      return res.json({
        success: false,
        error: errorMessage,
      });
    }
  };
}

export default LoginController;
