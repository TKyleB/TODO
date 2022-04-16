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
        this.tasks.push(task);
    }

};

class Task {
    constructor(title, dueDate, notes) {
        this.title = title;
        this.dueDate = dueDate;
        this.notes = notes;
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
        newProjectItem.classList.add("project-item", "item-focus");
        newProjectItem.dataset.projectID = e.projectID;
        newProjectItem.textContent = e.name;
        newProjectItem.addEventListener("click", setFocus);
        projectListDisplay.append(newProjectItem);
    })
}

function setFocus(event) {
    // Set highlight of clicked project
    const menuChoices = document.querySelectorAll(".item-focus");
    menuChoices.forEach(e => e.style.backgroundColor = "#e5e7eb");
    event.target.style.backgroundColor = "#d6d3d1";

    const projectID = event.target.dataset.projectID;
    let selectedProject = projectList.findIndex(e => e.projectID == projectID);
    //Update Project Title Display
    const projectTitle = document.querySelector(".project-title");
    projectTitle.textContent = projectList[selectedProject].name;
    // Delete currently displayed tasks
    const taskList = document.querySelector(".project-tasks");
    while (taskList.firstChild) taskList.removeChild(taskList.firstChild);

    // Loop through selected project to add tasks to display
    projectList[selectedProject].tasks.forEach(e => {
        //Select parent Div to place task into
        const taskList = document.querySelector(".project-tasks")
        // Create elements
        const task = document.createElement("div");
        task.classList.add("task");
        const taskTitle = document.createElement("div");
        const taskDueDate = document.createElement("div");
        const taskNotes = document.createElement("p");
        const deleteTaskButton = document.createElement("button");
        deleteTaskButton.addEventListener("click", deleteTask());
        deleteTaskButton.textContent = "X";


        taskTitle.classList.add("task-title");
        taskTitle.textContent = e.title;
        taskTitle.append(deleteTaskButton);

        taskDueDate.textContent = e.dueDate;
        taskNotes.textContent = e.notes;

        task.append(taskTitle, taskDueDate, taskNotes);
        taskList.append(task);



    });

}

function deleteTask(event) {
    console.log("Will implement later")
}




//default projects
let home = new Project("Home");
let testTask = new Task("Clean Room", "3/1/2022", "This is an example notes");
let work = new Project("Work");

home.addTask(testTask);
work.addTask(testTask);
addProject(home);
addProject(work);
updateProjectDisplay();



