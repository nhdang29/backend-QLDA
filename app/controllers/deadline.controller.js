const DeadlineService = require("../services/deadline.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Create and Save a new Deadline
exports.create = async (req, res, next) => {
	if (!req.body?.name) {
		return next(new ApiError(400, "Name can not be empty"));
	}

	try {
		const deadlineService = new DeadlineService(req.userId, MongoDB.client);
		const document = await deadlineService.create(req.body);
		return res.send(document);
	} catch (error) {
		console.log(error);
		return next(
			new ApiError(500, "An error occurred while creating the deadline")
		);
	}
};

// Retrieve all deadlines of a user from the database
exports.findAll = async (req, res, next) => {
	let documents = [];

	try {
		const deadlineService = new DeadlineService(req.userId, MongoDB.client);
		const { name } = req.query;
		if (name) {
			documents = await deadlineService.findByName(name);
		} else {
			documents = await deadlineService.find({});
		}
	} catch (error) {
		console.log(error);
		return next(
			new ApiError(500, "An error occurred while retrieving deadlines")
		);
	}

	return res.send(documents);
};

// Find a single deadline with an id
exports.findOne = async (req, res, next) => {
	try {
		const deadlineService = new DeadlineService(req.userId, MongoDB.client);
		const document = await deadlineService.findById(req.params.id);
		if (!document) {
			return next(new ApiError(404, "deadline not found"));
		}
		return res.send(document);
	} catch (error) {
		console.log(error);
		return next(
			new ApiError(
				500,
				`Error retrieving deadline with id=${req.params.id}`
			)
		);
	}
};

// Update a deadline by the id in the request
exports.update = async (req, res, next) => {
	if (Object.keys(req.body).length === 0) {
		return next(new ApiError(400, "Data to update can not be empty"));
	}

	try {
		const deadlineService = new DeadlineService(req.userId, MongoDB.client);
		const document = await deadlineService.update(req.params.id, req.body);
		if (!document) {
			return next(new ApiError(404, "deadline not found"));
		}
		return res.send({ message: "deadline was updated successfully" });
	} catch (error) {
		console.log(error);
		return next(
			new ApiError(500, `Error updating deadline with id=${req.params.id}`)
		);
	}
};

// Delete a deadline with the specified id in the request
exports.delete = async (req, res, next) => {
	try {
		const deadlineService = new DeadlineService(req.userId, MongoDB.client);
		const document = await deadlineService.delete(req.params.id);
		if (!document) {
			return next(new ApiError(404, "deadline not found"));
		}
		return res.send({ message: "deadline was deleted successfully" });
	} catch (error) {
		console.log(error);
		return next(
			new ApiError(
				500,
				`Could not delete deadline with id=${req.params.id}`
			)
		);
	}
};

// Delete all deadlines of a user from the database
exports.deleteAll = async (req, res, next) => {
	try {
		const deadlineService = new DeadlineService(req.userId, MongoDB.client);
		const deletedCount = await deadlineService.deleteAll();
		return res.send({
			message: `${deletedCount} deadlines were deleted successfully`,
		});
	} catch (error) {
		return next(
			new ApiError(500, "An error occurred while removing all deadlines")
		);
	}
};

