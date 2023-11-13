const router = require('express').Router();
const messageController = require('../controllers/messageController');

router.get('/get_messages', messageController.getMessages);
router.get('/get_unread_messages_count', messageController.getUnreadMessagesCount);
router.get('/get_chat_id', messageController.getChatId);

router.post('/add_message', messageController.addMessage);

module.exports = router;