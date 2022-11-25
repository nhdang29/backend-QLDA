const express = require("express");
const { verifyToken } = require("../middlewares");
const Project = require("../controllers/project.controller");

const router = express.Router();

router.use(verifyToken);

router
	.route("/")
	.get(Project.findAll)
	.post(Project.create)
	.delete(Project.deleteAll);


router
	.route("/:id")
	.get(Project.findOne)
	.put(Project.update)
	.delete(Project.delete);

module.exports = router;
