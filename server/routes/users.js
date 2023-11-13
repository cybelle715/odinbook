const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/get_non_friends', userController.getNonFriends);
router.get('/get_pending_friends', userController.getPendingFriends);
router.get('/search_users', userController.searchUsers);
router.get('/get_friends', userController.getFriends);
router.get('/get_friends_user', userController.getFriendsUser);
router.get('/get_user', userController.getUser);
router.get('/check_friend', userController.checkFriend);

router.post('/add_friend', userController.addFriend);
router.post('/remove_friend', userController.removeFriend);
router.post('/change_name', userController.changeName);
router.post('/upload_profile_file', userController.uploadProfileFile);


module.exports = router;
