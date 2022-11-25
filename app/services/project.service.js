const { ObjectId } = require("mongodb");

class ProjectService {
	constructor(ownerId, client) {
		this.ownerId = ObjectId.isValid(ownerId) ? new ObjectId(ownerId) : null;
		this.Project = client.db().collection("projects");
	}

	async create(payload) {
		const project = {
			name: payload.name,
			decripsion: payload.decripsion,
			link: payload.link,
			favo:payload.favo,
			ownerId: this.ownerId,
			
		};
		// As collection.insertOne() doesn't return the inserted document,
		// we need to use collection.findOneAndUpdate to get the inserted document
		const result = await this.Project.findOneAndUpdate(
			project,
			{ $set: { favo: payload.favo === '' } },
			{ returnDocument: "after", upsert: true }
		);
		return result.value;
	}

	async find(filter) {
		const cursor = await this.Project.find({
			...filter,
			ownerId: this.ownerId,
		});
		return await cursor.toArray();
	}



	async findByName(name) {
		return await this.find({
			name: { $regex: new RegExp(name), $options: "i" },
			ownerId: this.ownerId,
		});
	}

	async findById(id) {
		return await this.Project.findOne({
			_id: ObjectId.isValid(id) ? new ObjectId(id) : null,
			ownerId: this.ownerId,
		});
	}

	async update(id, payload) {
		const filter = {
			_id: ObjectId.isValid(id) ? new ObjectId(id) : null,
			ownerId: this.ownerId,
		};
		// Don't want to put _id and ObjectId types in the $set object
		const { _id, ownerId, ...update } = payload;
		const result = await this.Project.findOneAndUpdate(
			filter,
			{ $set: update },
			{ returnDocument: "after" }
		);
		return result.value;
	}

	async delete(id) {
		const result = await this.Project.findOneAndDelete({
			_id: ObjectId.isValid(id) ? new ObjectId(id) : null,
			ownerId: this.ownerId,
		});
		return result.value;
	}

	async deleteAll() {
		const result = await this.Project.deleteMany({
			ownerId: this.ownerId,
		});
		return result.deletedCount;
	}
}

module.exports = ProjectService;
