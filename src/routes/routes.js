import express from 'express'
const router = express.Router();
import controller from '../controller/controller.js';
import auth from '../middleware/auth.js'

router.post('/register' , controller.createEmployee);
router.post('/login' , controller.loginEmployee);
router.post('/form' , controller.createForm);
router.post('/claimLead' ,auth, controller.claimLead);
router.get('/unclaimedLeads' ,auth, controller.unclaimedLeads);
router.get('/leadClaimByLoggedInUser' ,auth, controller.leadClaimByLoggedInUser);


export default router;