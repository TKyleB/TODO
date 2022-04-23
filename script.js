let projectList = [];
const openNewProjectForm = document.getElementById("newProjectButton");
const addProjectButton = document.getElementById("addproject");
const cancelNewProjectButton = document.getElementById("cancelnewproject");
const todayButton = document.getElementById("today");
todayButton.addEventListener("click", e => setFocus(e));
let focusProject;



openNewProjectForm.addEventListener("click", displayNewProjectForm);
addProjectButton.addEventListener("click", addNewProject);
cancelNewProjectButton.addEventListener("click", cancelNewProject);

function displayNewProjectForm() {
    const formPopup = document.getElementById("newProjectForm");
    formPopup.classList.remove("d-none");
}

function addNewProject() {
    const projectInputField = document.getElementById("newprojectinputfield").value;

    if (projectInputField) {
        projectList.push(new Project(projectInputField));
        updateProjectList();
        saveToLocalStorage(projectList);
    }

}

function cancelNewProject() {
    const formPopup = document.getElementById("newProjectForm");
    formPopup.classList.add("d-none");
}

function updateProjectList() {
    const projectUlList = document.querySelector(".projectUlList");
    projectUlList.innerHTML = "";
    projectList.forEach(project => {
        const projectLi = document.createElement("li");
        projectLi.classList.add("mt-1", "mb-1", "p-1", "rounded", "project");
        projectLi.textContent = project.name;
        projectLi.dataset.projectID = project.projectID;
        projectLi.addEventListener("click", e => setFocus(e));
        projectUlList.append(projectLi);
    })
}

function setFocus(event) {
    const projects = document.querySelectorAll(".project");
    const sortBy = document.getElementById("sort").value;
    projects.forEach(project => project.style.backgroundColor = "#212529");
    event.target.style.backgroundColor = "#0d6efd";
    focusProject = event.target.dataset.projectID;
    console.log(sortBy);

    updateTaskDisplay(focusProject, sortBy);

}

function updateTaskDisplay(projectID, sortBy) {
    let projectIndex;
    let taskList = [];
    const taskview = document.getElementById("taskview");
    taskview.innerHTML = "";
    const projectNameDisplay = document.querySelector(".projectname");
    const projectTaskMenuButtons = document.querySelector(".taskmenubuttons");
    const taskMenu = document.querySelector(".taskmenu");



    if (projectID != "today") {
        projectIndex = projectList.findIndex(e => e.projectID == projectID);
        taskList = projectList[projectIndex].tasks;
        projectNameDisplay.classList.remove("d-none");
        projectTaskMenuButtons.classList.remove("d-none");
        taskMenu.classList.remove("d-none");
        projectNameDisplay.textContent = projectList[projectIndex].name;
    }

    if (projectID == "today") {
        projectTaskMenuButtons.classList.add("d-none");
        taskMenu.classList.add("d-none");
        projectNameDisplay.classList.remove("d-none");
        projectNameDisplay.textContent = "Tasks Due Today";
        let allTasks = [];
        let todayDate = new Date().toLocaleDateString();
        if (todayDate[0] == "0") todayDate.slice(1);
        for (let project of projectList) {
            project.tasks.forEach(e => allTasks.push(e));
        }
        let formatedDate;
        allTasks.forEach(e => {
            if (e.dueDate[0] == "0") formatedDate = e.dueDate.slice(1);
            if (formatedDate == todayDate) taskList.push(e);

        })
    }

    if (sortBy == "date") taskList.sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate));
    if (sortBy == "priority") taskList.sort((a, b) => b.priority - a.priority);

    const cardHolder = document.createElement("div");
    cardHolder.classList.add("d-flex", "p-2", "flex-wrap");

    // Task Cards
    taskList.forEach(task => {
        const taskCard = document.createElement("div");
        taskCard.classList.add("card", "m-3");
        taskCard.dataset.taskID = task.taskID;
        taskCard.style.width = "18rem";

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        cardBody.dataset.taskID = task.taskID;

        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = task.name;

        const cardSubtitle = document.createElement("h6");
        cardSubtitle.classList.add("card-subtitle", "mb-2", "text-muted");
        cardSubtitle.textContent = "Due Date: ";
        const dueDate = document.createElement("span");
        dueDate.textContent = task.dueDate;
        cardSubtitle.append(dueDate);

        const cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.textContent = task.description;

        const buttonHolder = document.createElement("div");
        buttonHolder.classList.add("d-flex");
        const completeTaskButton = document.createElement("button");
        completeTaskButton.classList.add("btn", "btn-success", "me-1", "w-100");
        completeTaskButton.textContent = "Complete";
        completeTaskButton.addEventListener("click", e => completeTask(e));
        if (projectID != "today") buttonHolder.append(completeTaskButton);


        cardBody.append(cardTitle, cardSubtitle, cardText, buttonHolder);
        taskCard.append(cardBody);
        cardHolder.append(taskCard);


    })

    taskview.append(cardHolder);
}

function createTask() {
    const taskTitle = document.getElementById("tasktitle").value;
    const taskDueDate = document.getElementById("duedate").value;
    let formatedDate = taskDueDate.split("-");
    const taskPriority = document.getElementById("taskpriority").value;
    const taskDescription = document.getElementById("taskdescription").value;
    const sortBy = document.getElementById("sort").value;
    let validForm = false;

    if (taskTitle && taskDueDate && taskDescription) validForm = true;
    if (validForm) {
        let projectIndex = projectList.findIndex(e => e.projectID == focusProject);
        projectList[projectIndex].tasks.push(new Task(taskTitle, formatedDate[1] + "/" + formatedDate[2] + "/" + formatedDate[0], taskPriority, taskDescription));
        updateTaskDisplay(focusProject, sortBy);
        saveToLocalStorage(projectList);
    }
}

function sortTasks() {
    const sortSelect = document.getElementById("sort").value;
    updateTaskDisplay(focusProject, sortSelect);
    console.log(sortSelect);
}

function deleteFocusProject() {
    let projectIndex = projectList.findIndex(e => e.projectID == focusProject);
    projectList.splice(projectIndex, 1);
    updateTaskDisplay("today");
    updateProjectList();
    saveToLocalStorage(projectList);
}

function completeTask(event) {
    let taskID = event.target.parentNode.parentNode.dataset.taskID;
    console.log(taskID);
    let projectIndex = projectList.findIndex(e => e.projectID == focusProject);
    let taskIndex = projectList[projectIndex].tasks.indexOf(e => e.taskID == taskID)
    projectList[projectIndex].tasks.splice(taskIndex, 1);
    updateTaskDisplay(focusProject);
    saveToLocalStorage(projectList);

}

function showTasksDueToday() {
    taskList = [];
    for (let project of projectList) {
        project.tasks.forEach(e => taskList.push(e));
    }
    let today = new Date().toISOString().slice(0, 10);
    console.log(today);
    console.log(taskList);

}


class Project {
    constructor(name) {
        this.name = name;
        this.tasks = [];
        this.projectID = name + Math.random();
    }

    addTask(task) {
        this.tasks.push(task);
    }
}

class Task {
    constructor(name, dueDate, priority, description) {
        this.name = name;
        this.dueDate = dueDate;
        this.priority = priority;
        this.description = description;
        this.taskID = name + Math.random();
    }
}

function saveToLocalStorage(data) {
    localStorage["projectList"] = JSON.stringify(data);
}

function loadLocalStorage() {
    if (localStorage.getItem("projectList") != null) {
        projectList = JSON.parse(localStorage["projectList"]);
        updateProjectList();
    }
}

loadLocalStorage();



