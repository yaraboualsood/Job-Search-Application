import { Router } from "express";
import * as JC from "./job.controller.js"
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as JV from "./job.validation.js";
import { multerLocal, validExtention } from "../../service/multerLocal.js";

const router = Router() 

//1===============================================ADD JOB=====================================================
router.post('/',validation(JV.jobValidation) ,auth(),JC.addJob)

//2===============================================UPDATE JOB=====================================================
router.put('/:id',validation(JV.updateJobValidation), auth(),JC.updateJob)

//3===============================================DELETE JOB=====================================================
router.delete('/:id',validation(JV.deleteJobValidation) ,auth(),JC.deleteJob)

//4====================================GET ALL JOBS WITH THEIR COMPANYS INFO======================================
router.get('/companies', auth(), JC.getAllJobsWithCompanyInfo)

//5===================================GET ALL JOBS FOR A SPECIFIC COMPANY======================================
router.get('/company', validation(JV.getAllJobsSpecificCompanyValidation),auth(), JC.getAllJobsForASpecificCompany)

//6=================================GET ALL JOBS THAT MATCH THE FOLLOWING FILTERS=============================
router.get('/filter',validation(JV.filterJobsValidation) ,auth(), JC.getFilteredJobs)

//7===========================================APPLY TO JOB===================================================
router.post('/apply/:jobId',validation(JV.applyJob),auth(),multerLocal(validExtention.pdf).single("userResume"),JC.applyJob)


export default router