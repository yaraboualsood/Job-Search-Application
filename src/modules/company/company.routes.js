import { Router } from "express";
import * as CC from "./company.controller.js"
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js"
import * as CV from "./company.validation.js";

const router = Router() 

//===============================================ADD COMPANY=====================================================
router.post('/',validation(CV.companyValidation) ,auth(), CC.addCompany)

//===============================================UPDATE COMPANY=====================================================
router.put('/:id',validation(CV.updateCompanyValidation),auth(),CC.updatecompany)

//===============================================DELETE COMPANY=====================================================
router.delete('/:id',validation(CV.deleteAndGetCompanyValidation),auth(),CC.deleteCompany)

//===============================================GET COMPANY DATA=====================================================
router.get('/companyInfo/:id',validation(CV.deleteAndGetCompanyValidation),auth(),CC.getCompanyData)

//===============================================SEARCH COMPANY ======================================================
router.get('/search/:companyName', validation(CV.searchCompanyValidation),auth(),CC.searchCompanyByName)

//===================================GET ALL APPLICIATIONS FOR A SPECIFIC JOB======================================================
router.get('/jobs/applications/:jobId', validation(CV.getAllApplicationsForJob),auth(),CC.getAllApplicationsForJob)


export default router