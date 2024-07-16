"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StringValues {
    static INVITATION_CANCELLED_SUCCESS = "Invitation cancelled successfully";
    static INVITATIONS_FETCHED_SUCCESS = "Invitations fetched successfully";
    static UNAUTHORIZED_TO_CANCEL_INVITATION = "Unauthorized to cancel this invitation";
    static INVITATION_ALREADY_PROCESSED = "Invitation is already processed";
    static INVITATION_SENT_SUCCESS;
    static INVITATION_ACCEPTED_SUCCESS;
    static INVITATION_REJECTED_SUCCESS;
    static RECEIVER_ID_REQUIRED;
    static INVITATION_ID_REQUIRED;
    static SENDER_NOT_FOUND;
    static RECEIVER_NOT_FOUND;
    static INVITATION_NOT_FOUND;
    static UNAUTHORIZED_TO_ACCEPT_INVITATION;
    static UNAUTHORIZED_TO_REJECT_INVITATION;
    static INVITATION_NO_LONGER_PENDING;
    static SEARCH_CRITERIA_REQUIRED = "Search criteria is required";
    static SHIFT_TYPE_REQUIRED = "Shift type is required";
    static INVALID_REQUEST_BODY = "Invalid request body";
    static USER_SHIFT_TYPE_NOT_FOUND = "User shift type not found";
    static SHIFT_NAME_REQUIRED = "Shift name is required";
    static SHIFT_START_END_TIME_REQUIRED = "Shift start and end time is required";
    static EMAIL_REQUIRED = "Email is required";
    static EMAIL_OR_USERNAME_REQUIRED = "Either email or username is required";
    static EMAIL_NOT_REGISTERED = "Email is not registered";
    static EMAIL_ALREADY_REGISTERED = "Email is already registered";
    static INCORRECT_USERNAME = "Username is incorrect";
    static USERNAME_REQUIRED = "Username is required";
    static USERNAME_ALREADY_REGISTERED = "Username is already registered";
    static OTP_SEND_SUCCESS = "OTP sent";
    static INVALID_EMAIL_FORMAT = "Email format is invalid";
    static INTERNAL_SERVER_ERROR = "Internal server error";
    static SOMETHING_WENT_WRONG = "Something went wrong";
    static RESOURCE_NOT_FOUND = "Resource not found";
    static INVALID_TOKEN = "Token is invalid";
    static TOKEN_EXPIRED = "Token is expired";
    static TOKEN_NOT_FOUND = "Token not found";
    static TOKEN_INVALID_EXPIRED = "Token is invalid or expired";
    static UNAUTHORIZED_ACCESS = "Unauthorized acess";
    static USER_NOT_FOUND = "User not found";
    static JWT_TOKEN_INVALID = "Jwt token is invalid";
    static BEARER_TOKEN_REQUIRED = "Bearer token is required";
    static AUTH_PARAM_REQUIRED = "Authorization parameter is required";
    static AUTH_PARAM_HEADER_NOT_FOUND = "Authorization parameter not found in header";
    static TOKEN_NOT_FOUND_IN_AUTH_HEADER = "Token not found in Authorization parameter in header";
    static AUTH_TOKEN_REQUIRED = "Auth token is required";
    static EMAIL_SEND_SUCCESS = "Email sent";
    static EMAIL_SUBJECT_REQUIRED = "Email subject is required";
    static EMAIL_BODY_REQUIRED = "Email body is required";
    static SENDGRID_API_KEY_NOT_FOUND = "SendGrid API key not found";
    static FIRST_NAME_REQUIRED = "First name is required";
    static LAST_NAME_REQUIRED = "Last name is required";
    static FULL_NAME_REQUIRED = "Full name is required";
    static OTP_REQUIRED = "OTP is required";
    static INVALID_OTP = "OTP is invalid";
    static INCORRECT_OTP = "OTP is incorrect";
    static OTP_EXPIRED = "OTP is expired";
    static OTP_ALREADY_USED = "OTP is already used";
    static REGISTER_SUCCESS = "User registered";
    static LOGIN_SUCCESS = "User logged in";
    static INCORRECT_EMAIL_UNAME = "Email or username is incorrect";
    static INVALID_USERNAME_FORMAT = "Username format is invalid";
    static PROFILE_DATA_NOT_FOUND = "Profile data not found";
    static JWT_SECRET_NOT_FOUND = "JWT secret not found";
    static JWT_TOKEN_CREATE_ERROR = "An error occurred while creating token";
    static SUCCESS = "Sucess";
    static DONE = "Done";
    static FAILURE = "Failure";
    static UNAUTHORIZED = "Unauthorized";
    static TOKEN_NOT_VERIFIED = "Token not verified";
    static OTP_CREATE_ERROR = "An error occurred while creating an otp";
    static TEXT_OR_MEDIA_REQUIRED = "Either text or media is required";
    static MEDIA_FILES_REQUIRED = "Atleast one media file is required";
    static MEDIA_FILES_MAX_LIMIT = "Maximum 10 media file are allowed";
    static TEXT_REQUIRED = "Text is required";
    static POLL_OPTIONS_REQUIRED = "Poll options are required";
    static POLL_OPTIONS_MIN_REQUIRED = "Atleast 2 poll options are required";
    static POLL_OPTIONS_MAX_LIMIT = "Maximum 4 poll options are allowed";
    static POLL_END_DURATION_REQUIRED = "Poll end duration is required";
    static POST_TYPE_REQUIRED = "Post type is required";
    static INVALID_POST_TYPE = "Post type is invalid";
    static INVALID_REQUEST_METHOD = "Request method is invalid";
    static JOB_VACANCIES_LIMIT_EXCEEDED = "Job vacancies limit exceeded";
    static JOB_DATA_REQUIRED = "Job data are required";
    static JOB_TITLE_REQUIRED = "Job title is required";
    static JOB_MANDATORY_SKILLS_REQUIRED = "Mandatory skills are required";
    static JOB_MANDATORY_SKILLS_MAX_LIMIT_ERROR = "Maximum 5 mandatory skills are allowed";
    static JOB_OPTIONAL_SKILLS_MAX_LIMIT_ERROR = "Maximum 10 optional skills are allowed";
    static JOB_SALARY_RANGE_REQUIRED = "Salary range is required";
    static JOB_MIN_SALARY_REQUIRED = "Minimum salary is required";
    static JOB_MAX_SALARY_REQUIRED = "Maximum salary is required";
    static JOB_PROBATION_DURATION_REQUIRED = "Probation duration is required";
    static JOB_PROBATION_SALARY_RANGE_REQUIRED = "Probation salary range is required";
    static JOB_MIN_PROBATION_SALARY_REQUIRED = "Probation minimum salary is required";
    static JOB_MAX_PROBATION_SALARY_REQUIRED = "Probation maximum salary is required";
    static JOB_OPENINGS_REQUIRED = "Job openings is required";
    static JOB_TYPE_REQUIRED = "Job type is required";
    static JOB_LOCATION_REQUIRED = "Job location is required";
    static CURRENCY_CODE_REQUIRED = "Currency code is required";
    static CURRENCY_SYMBOL_REQUIRED = "Currency symbol is required";
    static JOB_DESCRIPTION_REQUIRED = "Job description is required";
    static MIN_QUALIFICATION_REQUIRED = "Minimum qualification is required";
    static JOB_CATEGORY_REQUIRED = "Job category is required";
    static JOB_INDUSTRY_REQUIRED = "Job industry is required";
    static JOB_LOCATION_CITY_REQUIRED = "Job location city is required";
    static JOB_LOCATION_STATE_REQUIRED = "Job location state is required";
    static JOB_LOCATION_COUNTRY_REQUIRED = "Job location country is required";
    static JOB_PREFERRED_JOINING_DATE_REQUIRED = "Job preferred joining date is required";
    static JOB_WORK_EXPERIENCE_REQUIRED = "Work experience is required";
    static JOB_MIN_WORK_EXPERIENCE_REQUIRED = "Minimum work experience is required";
    static JOB_MAX_WORK_EXPERIENCE_REQUIRED = "Maximum work experience is required";
    static ACTION_NOT_PERMITTED = "This account is not permitted to perform this action";
    static PROFILE_NOT_FOUND = "Profile not found";
    static USER_TYPE_REQUIRED = "User type is required";
    static PHONE_REQUIRED = "Phone number is required";
    static INVALID_PHONE_FORMAT = "Phone number format is invalid";
    static COMPANY_NAME_REQUIRED = "Company name is required";
    static DESIGNATION_REQUIRED = "Designation is required";
    static OLD_PASSWORD_REQUIRED = "Old password is required";
    static PASSWORD_REQUIRED = "Password is required";
    static CONFIRM_PASSWORD_REQUIRED = "Confirm password is required";
    static PASSWORDS_DO_NOT_MATCH = "Passwords do not match";
    static PHONE_ALREADY_USED = "Phone number is already used";
    static OLD_PASSWORD_MIN_LENGTH_ERROR = "Old password length should be greater than or equal to 8 characters";
    static OLD_PASSWORD_MAX_LENGTH_ERROR = "Old password length should not be greater than 32 characters";
    static PASSWORD_MIN_LENGTH_ERROR = "Password length should be greater than or equal to 8 characters";
    static PASSWORD_MAX_LENGTH_ERROR = "Password length should not be greater than 32 characters";
    static CONFIRM_PASSWORD_MIN_LENGTH_ERROR = "Confirm password length should be greater than or equal to 8 characters";
    static CONFIRM_PASSWORD_MAX_LENGTH_ERROR = "Confirm password length should not be greater than 32 characters";
    static PHONE_LENGTH_ERROR = "Phone number length should be equal to 10 characters";
    static INCORRECT_PASSWORD = "Password is incorrect";
    static INCORRECT_OLD_PASSWORD = "Old password is incorrect";
    static POST_NOT_FOUND = "Post not found";
}
exports.default = StringValues;
//# sourceMappingURL=strings.js.map