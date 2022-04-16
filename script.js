const newProjectButton = document.getElementById("newprojectbutton");
const addProjectForm = document.getElementById("addproject");
const cancelNewProjectButton = document.getElementById("cancelnewproject");

const addNewProjectButton = document.getElementById("add-project-button");
const newProjectInputField = document.getElementById("projectname");

addNewProjectButton.addEventListener("click", () => {
    addProject(new Project(newProjectInputField.value));
    updateProjectDisplay();
});


newProjectButton.addEventListener("click", () => addProjectForm.style.display = "block");
cancelNewProjectButton.addEventListener("click", () => addProjectForm.style.display = "none");

let projectList = [];

class Project {
    constructor(name) {
        this.name = name;
        this.tasks = [];
        this.projectID = name + Math.random();
    }

    addTask(task) {
        projectList.push(task);
    }

};

class Task {
    constructor(parentProject) {
        this.parentProject = parentProject;
    }
}

function addProject(project) {
    projectList.push(project);
}

function updateProjectDisplay() {
    const projectListDisplay = document.querySelector(".project-list");
    while (projectListDisplay.firstChild) projectListDisplay.removeChild(projectListDisplay.firstChild);
    projectList.forEach(e => {
        const newProjectItem = document.createElement("li");
        newProjectItem.classList.add("project-item");
        newProjectItem.textContent = e.name;
        newProjectItem.addEventListener("click", setFocus);
        projectListDisplay.append(newProjectItem);
    })
}

function setFocus(event) {
    console.log(event.target);
}


