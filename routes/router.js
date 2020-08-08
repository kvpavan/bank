const express = require('express')

const { list_users } = require('../controllers/list_users')
const { save_user } = require('../controllers/save_user')
const { update_user } = require('../controllers/update_user')
const { delete_user } = require('../controllers/delete_user')

const { list_accounts } = require('../controllers/list_accounts')
const { create_account } = require('../controllers/create_account')

const { list_ledger } = require('../controllers/list_ledger')
const { send } = require('../controllers/send')


const router = express.Router();

router.get('/api/users/list', list_users);
router.post('/api/users/create', save_user);
router.post('/api/users/delete', delete_user);
router.post('/api/users/update', update_user);

router.get('/api/users/list_accounts', list_accounts);
router.post('/api/users/create_account', create_account);

router.get('/api/users/list_ledger', list_ledger);
router.post('/api/users/send', send);


module.exports = router;