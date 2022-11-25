const express = require("express");
const { verifyToken } = require("../middlewares");
const Deadline = require("../controllers/deadline.controller");

const router = express.Router();

router.use(verifyToken);

router
	.route("/")
	.get(Deadline.findAll)
	.post(Deadline.create)
	.delete(Deadline.deleteAll);


router
	.route("/:id")
	.get(Deadline.findOne)
	.put(Deadline.update)
	.delete(Deadline.delete);

module.exports = router;
