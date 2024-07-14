import { Router } from "express";
import AuthMiddleware from "src/middlewares/Auth";
import ResidentController from "./residentController";
// Import any additional middlewares or validators you might need

const ResidentRouter: Router = Router();
const _residentController = new ResidentController();

/**
 * @name ResidentController.getResidents
 * @description Get all residents.
 * @route GET /api/v1/residents
 * @access private
 */
ResidentRouter.route("/").get(
  AuthMiddleware.isAuthenticatedUser,
  _residentController.getResidents
);

/**
 * @name ResidentController.getResident
 * @description Get a resident by ID.
 * @route GET /api/v1/residents/:residentId
 * @access private
 */
ResidentRouter.route("/:residentId").get(
  AuthMiddleware.isAuthenticatedUser,
  _residentController.getResident
);

/**
 * @name ResidentController.createResident
 * @description Create a new resident.
 * @route POST /api/v1/residents
 * @access private
 */
ResidentRouter.route("/").post(
  AuthMiddleware.isAuthenticatedUser,
  _residentController.createResident
);

/**
 * @name ResidentController.updateResident
 * @description Update a resident.
 * @route PUT /api/v1/residents/:residentId
 * @access private
 */
ResidentRouter.route("/:residentId").put(
  AuthMiddleware.isAuthenticatedUser,
  _residentController.updateResident
);

/**
 * @name ResidentController.deleteResident
 * @description Delete a resident.
 * @route DELETE /api/v1/residents/:residentId
 * @access private
 */
ResidentRouter.route("/:residentId").delete(
  AuthMiddleware.isAuthenticatedUser,
  _residentController.deleteResident
);

/**
 * @name ResidentController.addCareTimelineEntry
 * @description Add a care timeline entry for a resident.
 * @route POST /api/v1/residents/:residentId/care-timeline
 * @access private
 */
ResidentRouter.route("/:residentId/care-timeline").post(
  AuthMiddleware.isAuthenticatedUser,
  _residentController.addCareTimelineEntry
);

/**
 * @name ResidentController.addMedicationTimelineEntry
 * @description Add a medication timeline entry for a resident.
 * @route POST /api/v1/residents/:residentId/medication-timeline
 * @access private
 */
ResidentRouter.route("/:residentId/medication-timeline").post(
  AuthMiddleware.isAuthenticatedUser,
  _residentController.addMedicationTimelineEntry
);

/**
 * @name ResidentController.updatePersonalCare
 * @description Update personal care details for a resident.
 * @route PUT /api/v1/residents/:residentId/personal-care
 * @access private
 */
ResidentRouter.route("/:residentId/personal-care").put(
  AuthMiddleware.isAuthenticatedUser,
  _residentController.updatePersonalCare
);

export default ResidentRouter;
