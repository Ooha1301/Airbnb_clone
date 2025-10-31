// const express = require("express");
// const router = express.Router();
// const { isLoggedIn, isOwner, validateListing } = require("../middleware");
// const listingController = require("../controllers/listings");

// router
//   .route("/")
//   .get(listingController.index)
//   .post(isLoggedIn, validateListing, listingController.createListing);

// router.get("/new", isLoggedIn, listingController.renderNewForm);

// router
//   .route("/:id")
//   .get(listingController.showListing)
//   .put(isLoggedIn, isOwner, validateListing, listingController.updateListing)
//   .delete("/:id", isLoggedIn, isOwner, listingController.destroyListing);

// router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);

// module.exports = router;
const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listings.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer  = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index route
router.get("/", listingController.index);

// New form route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Create route
router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing, listingController.createListing);

// Show route
router.get("/:id", listingController.showListing);

// Edit form route
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);

// Update route
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, listingController.updateListing);

// Delete route ✅ (your issue)
router.delete("/:id", isLoggedIn, isOwner, listingController.destroyListing);

module.exports = router;
