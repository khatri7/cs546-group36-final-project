const { projects } = require('../config/mongoCollections');
const {
	isValidObjectId,
} = require('../utils');
const {

} = require('../utils/projects');

const getProjectByID = async (ObjectID) => {
	const id = isValidObjectId(ObjectID);
	const projectsCollection = await projects();
	const project = await projectsCollection.findOne({ _id: id });
	if (!project) throw notFoundErr('No user found for the provided username');
	return project;
};

const getAllProjects = async () => {
    const projectsCollection = await projects();
    const projectsList = await projectsCollection.find({}).toArray();
    return projectsList;
};

const getProjectsofUser = async (ObjectID) => {
    let projects_of_owner = []
	const id = isValidObjectId(ObjectID);
	const projects = await getAllProjects();
	if (!projects) return [];
	projects.array.forEach(element => {
       if (element.ownerID === id){projects_of_owner.append(element)}
    });
	if (!projects) return [];
    return projects_of_owner;
};

const deleteProject = async (ObjectID) => {
    ObjectID = validation.checkId(ObjectID);
    const projectsCollection = await projects();
    const deletionInfo = await projectsCollection.deleteOne({_id: ObjectID});
    if (deletionInfo.deletedCount === 0) {
      throw `Error: Could not delete Project with id of ${ObjectID}`;
    }
    return true;
};




module.exports = {
	getProjectByID,
    getAllProjects,
	getProjectsofUser,
	deleteProject,
};
