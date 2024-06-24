import { Router } from "express";
import AuthMiddleware from "src/middlewares/Auth";
import Invitation from "./invitationController";
import InvitationService from "src/services/InvitationService";
import UserService from "src/services/UserService";

const InvitationRouter: Router = Router();
const _invSvc = new InvitationService();
const _userSvc = new UserService();
const _invController = new Invitation(
    _invSvc,
    _userSvc
);


InvitationRouter.route("/").post(
    AuthMiddleware.isAuthenticatedUser,
    _invController.sendInvitation
)

InvitationRouter.route("/").get(
    AuthMiddleware.isAuthenticatedUser,
    _invController.getInvitations
)
InvitationRouter.route("/accept/:invitationId").put(
    AuthMiddleware.isAuthenticatedUser,
    _invController.acceptInvitation
)
InvitationRouter.route("/reject/:invitationId").put(
    AuthMiddleware.isAuthenticatedUser,
    _invController.rejectInvitation
)
InvitationRouter.route("/:invitationId").delete(
    AuthMiddleware.isAuthenticatedUser,
    _invController.cancelInvitation
)


export default InvitationRouter;