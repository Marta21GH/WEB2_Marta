const express = require("express");
const { updatePersonalData } = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { updateCompanyData } = require("../controllers/user.controller");
const { uploadLogo } = require("../controllers/user.controller");
const { getUserProfile } = require("../controllers/user.controller");
const { deleteUser } = require("../controllers/user.controller");
const { upload } = require("../middlewares/upload.middleware");
const { personalDataValidator } = require("../validators/user.validator");
const { companyDataValidator } = require("../validators/user.validator");

const router = express.Router();

router.put(
  "/onboarding/personal",
  verifyToken,
  ...personalDataValidator,
  updatePersonalData
);

router.patch(
    "/onboarding/company",
    verifyToken,
    ...companyDataValidator,
    updateCompanyData
);

router.patch(
  "/logo",
  verifyToken,
  upload.single("logo"),
  uploadLogo
);

router.get("/me", verifyToken, getUserProfile);
router.delete("/me", verifyToken, deleteUser);

module.exports = router;
