const ProjectService = require("../services/project.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Create and Save a new project
exports.create = async (req, res, next) => {
	if (!req.body?.name) {
		return next(new ApiError(400, "Name can not be empty"));
	}

	try {
		const projectService = new ProjectService(req.userId, MongoDB.client);
		const document = await projectService.create(req.body);
		return res.send(document);
	} catch (error) {
		console.log(error);
		return next(
			new ApiError(500, "An error occurred while creating the project")
		);
	}
};

// Retrieve all projects of a user from the database
exports.findAll = async (req, res, next) => {
	let documents = [];

	try {
		const projectService = new ProjectService(req.userId, MongoDB.client);
		const { name } = req.query;
		if (name) {
			documents = await projectService.findByName(name);
		} else {
			documents = await projectService.find({});
		}
	} catch (error) {
		console.log(error);
		return next(
			new ApiError(500, "An error occurred while retrieving projects")
		);
	}

	return res.send(documents);
};

// Find a single project with an id
exports.findOne = async (req, res, next) => {
	try {
		const projectService = new ProjectService(req.userId, MongoDB.client);
		const document = await projectService.findById(req.params.id);
		if (!document) {
			return next(new ApiError(404, "project not found"));
		}
		return res.send(document);
	} catch (error) {
		console.log(error);
		return next(
			new ApiError(
				500,
				`Error retrieving project with id=${req.params.id}`
			)
		);
	}
};

// Update a project by the id in the request
exports.update = async (req, res, next) => {
	if (Object.keys(req.body).length === 0) {
		return next(new ApiError(400, "Data to update can not be empty"));
	}

	try {
		const projectService = new ProjectService(req.userId, MongoDB.client);
		const document = await projectService.update(req.params.id, req.body);
		if (!document) {
			return next(new ApiError(404, "project not found"));
		}
		return res.send({ message: "project was updated successfully" });
	} catch (error) {
		console.log(error);
		return next(
			new ApiError(500, `Error updating project with id=${req.params.id}`)
		);
	}
};

// Delete a project with the specified id in the request
exports.delete = async (req, res, next) => {
	try {
		const projectService = new ProjectService(req.userId, MongoDB.client);
		const document = await projectService.delete(req.params.id);
		if (!document) {
			return next(new ApiError(404, "project not found"));
		}
		return res.send({ message: "project was deleted successfully" });
	} catch (error) {
		console.log(error);
		return next(
			new ApiError(
				500,
				`Could not delete project with id=${req.params.id}`
			)
		);
	}
};

// Delete all projects of a user from the database
exports.deleteAll = async (req, res, next) => {
	try {
		const projectService = new ProjectService(req.userId, MongoDB.client);
		const deletedCount = await projectService.deleteAll();
		return res.send({
			message: `${deletedCount} projects were deleted successfully`,
		});
	} catch (error) {
		return next(
			new ApiError(500, "An error occurred while removing all projects")
		);
	}
};

