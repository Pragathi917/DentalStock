const express = require('express');
const { getUsers, createStaff, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Apply auth protection & admin restriction to all user routes
router.use(protect);
router.use(authorizeRoles('admin'));

router.route('/')
  .get(getUsers)
  .post(createStaff);

router.route('/:id')
  .delete(deleteUser);

module.exports = router;
