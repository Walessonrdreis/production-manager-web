import { Router } from 'express';
import { TrelloWebhookController } from './controllers/TrelloWebhookController.js';

const trelloRoutes = Router();

// Endpoint for Trello Webhook
trelloRoutes.head('/webhook', TrelloWebhookController.verifyWebhook);
trelloRoutes.get('/webhook', TrelloWebhookController.verifyWebhook);
trelloRoutes.post('/webhook', TrelloWebhookController.handleWebhook);

export { trelloRoutes };
