"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TimesheetMiddleWare {
    static async validateCreateTimesheet(req, res, next) {
        try {
            const { currentUser } = req;
            if (currentUser.accountType === "carer") {
                next();
            }
            else {
                return res
                    .status(403)
                    .json({ error: "Only carer can create timesheet" });
            }
        }
        catch (error) {
            console.error("Error validating create timesheet:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    static async validateApproval(req, res, next) {
        try {
            const { currentUser } = req;
            if (currentUser.accountType === "home") {
                next();
            }
            else {
                return res
                    .status(403)
                    .json({ error: "Only home can approve timesheet" });
            }
        }
        catch (error) {
            console.error("Error validating approval:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.default = TimesheetMiddleWare;
//# sourceMappingURL=timesheet.js.map