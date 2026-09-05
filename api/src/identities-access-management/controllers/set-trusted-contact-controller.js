import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../logger.js";
import usecases from "../usecases/index.js";

// Same French mobile shape the account activation accepts, so a user is not
// told their own number is valid in one screen and invalid in another.
const setTrustedContactSchema = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().max(255).allow(null, ""),
    phoneNumber: Joi.string().pattern(/^0[67]\d{8}$/).allow(null, ""),
  }),
});

/**
 * Records, or clears, the authenticated user's trusted contact.
 * @param {object} req - Express request, with the authenticated user on req.auth.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {Function} setTrustedContact - Use case recording the contact (dependency injection for tests).
 * @returns {Promise<*>} The response sent to the client.
 */
async function setTrustedContactController(req, res, next, setTrustedContact = usecases.setTrustedContactUsecase) {
  try {
    const { userId } = req.auth;
    const { name, phoneNumber } = req.body;

    const trustedContact = await setTrustedContact({
      userId,
      name: name || null,
      phoneNumber: phoneNumber || null,
    });

    return res.status(200).json({ data: { trustedContact } });
  } catch (error) {
    logger.error({ err: error }, "Error in setTrustedContactController.");
    return next(error);
  }
}

export { setTrustedContactController, setTrustedContactSchema };
