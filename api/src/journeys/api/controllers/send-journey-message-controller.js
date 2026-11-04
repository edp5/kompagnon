import { celebrate, Joi, Segments } from "celebrate";

import usecases from "../../usecases/index.js";

const sendJourneyMessageSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    foundJourneyId: Joi.number().integer().positive().required(),
  }),
  [Segments.BODY]: Joi.object({
    body: Joi.string().trim().min(1).max(2000).required(),
  }),
});

/**
 * Controller adding a message to the conversation of a found journey.
 * @param {object} req - The request, holding the authenticated user, the found journey id and the message.
 * @param {object} res - The response object.
 * @param {Function} next - The next middleware, used for error handling.
 * @param {Function} sendMessage - Use case sending the message (dependency injection for tests).
 * @returns {Promise<*>} The response sent to the client.
 */
async function sendJourneyMessageController(
  req,
  res,
  next,
  sendMessage = usecases.sendJourneyMessageUsecase,
) {
  const { auth, body, params } = req;
  try {
    const message = await sendMessage({
      foundJourneyId: Number(params.foundJourneyId),
      userId: auth.userId,
      body: body.body.trim(),
    });
    return res.status(201).json({ data: { id: message.id } });
  } catch (error) {
    return next(error);
  }
}

export { sendJourneyMessageController, sendJourneyMessageSchema };
