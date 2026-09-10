import { celebrate, Joi, Segments } from "celebrate";

import usecases from "../../usecases/index.js";

const getJourneyMessagesSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    foundJourneyId: Joi.number().integer().positive().required(),
  }),
});

/**
 * Controller returning the conversation of a found journey.
 * @param {object} req - The request, holding the authenticated user and the found journey id.
 * @param {object} res - The response object.
 * @param {Function} next - The next middleware, used for error handling.
 * @param {Function} getMessages - Use case reading the conversation (dependency injection for tests).
 * @returns {Promise<*>} The response sent to the client.
 */
async function getJourneyMessagesController(
  req,
  res,
  next,
  getMessages = usecases.getJourneyMessagesUsecase,
) {
  const { auth, params } = req;
  try {
    const messages = await getMessages({
      foundJourneyId: Number(params.foundJourneyId),
      userId: auth.userId,
    });
    return res.status(200).json({ data: messages });
  } catch (error) {
    return next(error);
  }
}

export { getJourneyMessagesController, getJourneyMessagesSchema };
