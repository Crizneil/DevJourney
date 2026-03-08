// Initial Data Structure
const initialData = {
    frontend: {
        title: "Frontend Development",
        icon: "fa-brands fa-html5",
        colorClass: "accent-primary",
        tasks: [
            { id: "fe1", text: "Learn HTML fundamentals", completed: false },
            { id: "fe2", text: "Learn CSS layouts and Flexbox", completed: false },
            { id: "fe3", text: "Learn responsive design", completed: false },
            { id: "fe4", text: "Learn JavaScript basics", completed: false },
            { id: "fe5", text: "Learn DOM manipulation", completed: false },
            { id: "fe6", text: "Build responsive website", completed: false },
            { id: "fe7", text: "Deploy website online", completed: false }
        ]
    },
    projects: {
        title: "Portfolio Projects",
        icon: "fa-solid fa-laptop-code",
        colorClass: "accent-secondary",
        type: "project",
        tasks: [
            { id: "pr1", text: "Personal Portfolio Website", status: "planned" }, // planned, in progress, completed
            { id: "pr2", text: "Restaurant Website", status: "planned" },
            { id: "pr3", text: "Small Business Website", status: "planned" },
            { id: "pr4", text: "Product Landing Page", status: "planned" },
            { id: "pr5", text: "Capstone Project Demo", status: "planned" }
        ]
    },
    freelancing: {
        title: "Freelancing Preparation",
        icon: "fa-solid fa-briefcase",
        colorClass: "accent-warning",
        tasks: [
            { id: "fr1", text: "Improve portfolio website", completed: false },
            { id: "fr2", text: "Deploy projects online", completed: false },
            { id: "fr3", text: "Create Upwork profile", completed: false },
            { id: "fr4", text: "Create Fiverr gig", completed: false },
            { id: "fr5", text: "Prepare project samples", completed: false },
            { id: "fr6", text: "Get first freelance client", completed: false }
        ]
    },
    itsupport: {
        title: "IT Support Backup Skills",
        icon: "fa-solid fa-server",
        colorClass: "accent-danger",
        tasks: [
            { id: "it1", text: "Windows troubleshooting", completed: false },
            { id: "it2", text: "Hardware diagnostics", completed: false },
            { id: "it3", text: "Network basics", completed: false },
            { id: "it4", text: "Remote desktop tools", completed: false },
            { id: "it5", text: "System installation", completed: false },
            { id: "it6", text: "Study for IT certification", completed: false }
        ]
    },
    studyLinks: [
        { id: "sl1", title: "MDN Web Docs", url: "https://developer.mozilla.org/" },
        { id: "sl2", title: "JavaScript.info", url: "https://javascript.info/" },
        { id: "sl3", title: "CSS-Tricks", url: "https://css-tricks.com/" }
    ]
};

// Application State
let appData = {};

// Initialize application
function init() {
    loadData();
    // Ensure backwards compatibility with older LocalStorage saves
    if (!appData.studyLinks) {
        appData.studyLinks = JSON.parse(JSON.stringify(initialData.studyLinks));
    }
    renderAll();
    setupEventListeners();
}

// Load data from LocalStorage or use initial data
function loadData() {
    const savedData = localStorage.getItem('devJourneyData');
    if (savedData) {
        appData = JSON.parse(savedData);
    } else {
        appData = JSON.parse(JSON.stringify(initialData));
    }
}

// Save data to LocalStorage
function saveData() {
    localStorage.setItem('devJourneyData', JSON.stringify(appData));
    updateDashboard(); // Update dashboard on save
}

// Render all sections
function renderAll() {
    renderTaskList('frontend');
    renderProjectList('projects');
    renderTaskList('freelancing');
    renderTaskList('itsupport');
    renderStudyLinks(); // Render the new study links section

    updateDashboard();
}

// Render standard task list (checkboxes)
function renderTaskList(categoryKey) {
    const category = appData[categoryKey];
    const listElement = document.getElementById(`${categoryKey}-tasks`);
    if (!listElement) return;

    listElement.innerHTML = '';

    category.tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <div class="checkbox-wrapper">
                <input type="checkbox" class="task-checkbox" id="${task.id}" data-category="${categoryKey}" data-index="${index}" ${task.completed ? 'checked' : ''}>
            </div>
            <label class="task-label" for="${task.id}">${task.text}</label>
        `;

        listElement.appendChild(li);
    });

    updateSectionProgress(categoryKey);
}

// Render project list (dropdowns)
function renderProjectList(categoryKey) {
    const category = appData[categoryKey];
    const listElement = document.getElementById(`${categoryKey}-list`);
    if (!listElement) return;

    // Auto-sort projects: completed (1), in progress (2), planned (3)
    const statusWeight = { 'completed': 1, 'in progress': 2, 'planned': 3 };
    category.tasks.sort((a, b) => statusWeight[a.status] - statusWeight[b.status]);

    listElement.innerHTML = '';

    category.tasks.forEach((project, index) => {
        const isCompleted = project.status === 'completed';
        const statusClass = `status-${project.status.replace(/\s+/g, '')}`;

        const li = document.createElement('li');
        li.className = `task-item ${isCompleted ? 'completed-project' : ''}`;

        li.innerHTML = `
            <div class="task-label" style="${isCompleted ? 'text-decoration: line-through;' : ''}">${project.text}</div>
            <select class="project-status ${statusClass}" data-category="${categoryKey}" data-index="${index}">
                <option value="planned" ${project.status === 'planned' ? 'selected' : ''}>Planned</option>
                <option value="in progress" ${project.status === 'in progress' ? 'selected' : ''}>In Progress</option>
                <option value="completed" ${project.status === 'completed' ? 'selected' : ''}>Completed</option>
            </select>
        `;

        listElement.appendChild(li);
    });

    updateSectionProgress(categoryKey);
}

// Render Study Links list
function renderStudyLinks() {
    const listElement = document.getElementById('study-links-list');
    if (!listElement) return;

    listElement.innerHTML = '';

    appData.studyLinks.forEach((link, index) => {
        const li = document.createElement('li');
        li.className = 'study-link-item';
        li.draggable = true;
        li.dataset.index = index;

        li.innerHTML = `
            <div style="cursor: grab; color: var(--text-muted); padding-right: 0.5rem; display: flex; align-items: center;">
                <i class="fa-solid fa-grip-vertical"></i>
            </div>
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="study-link-a" title="${link.url}">
                <i class="fa-solid fa-link"></i> ${link.title}
            </a>
            <button class="delete-link-btn" data-index="${index}" title="Remove link">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;

        listElement.appendChild(li);
    });
}

// Update individual section progress
function updateSectionProgress(categoryKey) {
    const category = appData[categoryKey];
    let completedCount = 0;

    if (category.type === 'project') {
        completedCount = category.tasks.filter(t => t.status === 'completed').length;
    } else {
        completedCount = category.tasks.filter(t => t.completed).length;
    }

    const totalCount = category.tasks.length;
    const percentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    // Update DOM
    const progressText = document.getElementById(`${categoryKey}-progress-text`);
    const progressBar = document.getElementById(`${categoryKey}-progress-bar`);

    if (progressText) progressText.textContent = `${percentage}%`;
    if (progressBar) progressBar.style.width = `${percentage}%`;

    return { completed: completedCount, total: totalCount, percentage };
}

// Generate intelligent recommendations based on progress
function generateRecommendations() {
    const listElement = document.getElementById('recommendations-list');
    if (!listElement) return;

    let recommendations = [];
    const fe = updateSectionProgress('frontend');
    const pr = updateSectionProgress('projects');
    const fr = updateSectionProgress('freelancing');
    const it = updateSectionProgress('itsupport');

    // Logic for recommendations
    if (fe.percentage < 50) {
        recommendations.push({
            icon: "fa-brands fa-html5",
            text: "Focus on your Frontend fundamentals. Try to complete the basic HTML/CSS tasks before jumping into heavy JavaScript."
        });
    } else if (fe.percentage >= 80 && pr.completed < 2) {
        recommendations.push({
            icon: "fa-solid fa-laptop-code",
            text: "Your Frontend skills are looking solid! Now is the perfect time to start building your first Portfolio Project to apply what you've learned."
        });
    }

    if (pr.completed >= 2 && fr.percentage === 0) {
        recommendations.push({
            icon: "fa-solid fa-briefcase",
            text: "You have a couple of projects finished. Look into the Freelancing Prep tasks to start getting your name out there!"
        });
    }

    if (it.percentage < 20) {
        recommendations.push({
            icon: "fa-solid fa-server",
            text: "Don't forget your IT Support Backup skills! Taking 20 minutes a day to study network basics makes you a well-rounded tech professional."
        });
    }

    // Default encouragement if doing well everywhere
    if (recommendations.length === 0) {
        recommendations.push({
            icon: "fa-solid fa-fire",
            text: "You are crushing your goals! Keep up the momentum, maintain your daily coding streak, and don't forget to take breaks."
        });
    }

    // Render 
    listElement.innerHTML = '';
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.className = 'recommendation-item';
        li.innerHTML = `
            <div class="recommendation-icon"><i class="${rec.icon}"></i></div>
            <div class="recommendation-text">${rec.text}</div>
        `;
        listElement.appendChild(li);
    });
}

// Update dashboard statistics
function updateDashboard() {
    const statsContainer = document.getElementById('dashboard-stats');
    if (!statsContainer) return;

    let statCardsHtml = '';

    const categories = ['frontend', 'projects', 'freelancing', 'itsupport'];

    categories.forEach((key) => {
        const category = appData[key];
        if (!category) return;

        let completed = 0;

        if (category.type === 'project') {
            completed = category.tasks.filter(t => t.status === 'completed').length;
        } else {
            completed = category.tasks.filter(t => t.completed).length;
        }

        const total = category.tasks.length;
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

        statCardsHtml += `
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">${category.title}</span>
                </div>
                <div class="stat-value">${percentage}%</div>
                <div class="stat-subtitle">${completed} of ${total} completed</div>
            </div>
        `;
    });

    statsContainer.innerHTML = statCardsHtml;
    generateRecommendations(); // refresh tips whenever dashboard updates
}

// Event Listeners Setup
function setupEventListeners() {
    // Delegation for checkboxes
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('task-checkbox')) {
            const category = e.target.dataset.category;
            const index = e.target.dataset.index;

            appData[category].tasks[index].completed = e.target.checked;
            saveData();

            renderTaskList(category);
        }

        // Delegation for project status selects
        if (e.target.classList.contains('project-status')) {
            const category = e.target.dataset.category;
            const index = e.target.dataset.index;
            const newStatus = e.target.value;

            appData[category].tasks[index].status = newStatus;
            saveData();

            // Re-render project list
            renderProjectList(category);
        }
    });

    // Delegation for link delete buttons
    document.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-link-btn');
        if (deleteBtn) {
            const index = deleteBtn.dataset.index;
            appData.studyLinks.splice(index, 1);
            saveData();
            renderStudyLinks();
        }
    });

    // Handle adding new link
    const addLinkBtn = document.getElementById('add-link-btn');
    if (addLinkBtn) {
        addLinkBtn.addEventListener('click', () => {
            const titleInput = document.getElementById('new-link-title');
            const urlInput = document.getElementById('new-link-url');

            const title = titleInput.value.trim();
            const url = urlInput.value.trim();

            if (title && url) {
                let finalUrl = url;
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    finalUrl = 'https://' + url;
                }

                const newLink = {
                    id: 'sl' + Date.now(),
                    title: title,
                    url: finalUrl
                };

                appData.studyLinks.push(newLink);
                saveData();
                renderStudyLinks();

                // clear inputs
                titleInput.value = '';
                urlInput.value = '';
            }
        });
    }

    // Setup drag and drop for study links
    setupDragAndDrop();

    // Modal Logic
    const overviewBtn = document.getElementById('overview-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalOverlay = document.getElementById('overview-modal');

    if (overviewBtn && closeModalBtn && modalOverlay) {
        overviewBtn.addEventListener('click', () => {
            modalOverlay.classList.add('active');
            // small delay to let translation happen smoothly
            setTimeout(updateDashboard, 50);
        });

        closeModalBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });

        // Close on outside click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }
}

// Function for Drag and Drop in study links
function setupDragAndDrop() {
    const linksList = document.getElementById('study-links-list');
    if (!linksList) return;

    let draggedItem = null;

    linksList.addEventListener('dragstart', (e) => {
        const li = e.target.closest('.study-link-item');
        if (li) {
            draggedItem = li;
            setTimeout(() => {
                li.classList.add('dragging');
            }, 0);
            e.dataTransfer.effectAllowed = 'move';
        }
    });

    linksList.addEventListener('dragend', (e) => {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            draggedItem = null;

            // Re-order the data array based on new DOM structure
            const newItems = [...linksList.querySelectorAll('.study-link-item')].map(li => {
                const oldIndex = parseInt(li.dataset.index);
                return appData.studyLinks[oldIndex];
            });

            appData.studyLinks = newItems;
            saveData();
            // Re-render to fix dataset indexes
            renderStudyLinks();
        }
    });

    linksList.addEventListener('dragover', (e) => {
        e.preventDefault(); // Necessary to allow dropping
        const draggingEl = document.querySelector('.dragging');
        if (!draggingEl) return;

        const afterElement = getDragAfterElement(linksList, e.clientY);
        if (afterElement == null) {
            linksList.appendChild(draggingEl);
        } else {
            linksList.insertBefore(draggingEl, afterElement);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.study-link-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Run app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
