// Admin Logic

document.addEventListener('DOMContentLoaded', () => {
    // Login Page Logic
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        // Check if already logged in
        if (localStorage.getItem('admin_logged_in') === 'true') {
            window.location.href = 'admin-dashboard.html';
        }

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === 'admin' && password === 'admin123') {
                localStorage.setItem('admin_logged_in', 'true');
                window.location.href = 'admin-dashboard.html';
            } else {
                document.getElementById('login-error').textContent = 'Invalid credentials';
            }
        });
    }

    // Dashboard Logic
    const eventsTableBody = document.getElementById('events-table-body');
    if (eventsTableBody) {
        // Auth Check
        if (localStorage.getItem('admin_logged_in') !== 'true') {
            window.location.href = 'admin.html';
            return;
        }

        // Logout
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('admin_logged_in');
            window.location.href = 'admin.html';
        });

        // Render Table
        renderAdminTable();

        // Modal Logic
        const modal = document.getElementById('event-modal');
        const addBtn = document.getElementById('add-event-btn');
        const cancelBtn = document.getElementById('cancel-modal');
        const eventForm = document.getElementById('event-form');

        addBtn.addEventListener('click', () => {
            openModal();
        });

        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        eventForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const eventData = {
                id: document.getElementById('event-id').value || Date.now().toString(),
                title: document.getElementById('title').value,
                date: document.getElementById('date').value,
                venue: document.getElementById('venue').value,
                price: document.getElementById('price').value,
                description: document.getElementById('description').value,
                image: document.getElementById('image').value
            };

            saveEvent(eventData);
            modal.style.display = 'none';
            renderAdminTable();
        });
    }
});

function renderAdminTable() {
    const events = getEvents();
    const tbody = document.getElementById('events-table-body');

    tbody.innerHTML = events.map(event => `
        <tr>
            <td>${event.title}</td>
            <td>${new Date(event.date).toLocaleDateString()}</td>
            <td>${event.venue}</td>
            <td class="action-buttons">
                <button class="btn btn-secondary" onclick="editEvent('${event.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteEventAndRefresh('${event.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function openModal(event = null) {
    const modal = document.getElementById('event-modal');
    const title = document.getElementById('modal-title');

    if (event) {
        title.textContent = 'Edit Event';
        document.getElementById('event-id').value = event.id;
        document.getElementById('title').value = event.title;
        document.getElementById('date').value = event.date;
        document.getElementById('venue').value = event.venue;
        document.getElementById('price').value = event.price;
        document.getElementById('description').value = event.description;
        document.getElementById('image').value = event.image;
    } else {
        title.textContent = 'Add Event';
        document.getElementById('event-form').reset();
        document.getElementById('event-id').value = '';
    }

    modal.style.display = 'flex';
    // Trigger reflow
    void modal.offsetWidth;
    modal.classList.add('show');
}

// Global functions for inline onclick handlers
window.editEvent = function (id) {
    const event = getEventById(id);
    if (event) {
        openModal(event);
    }
};

window.deleteEventAndRefresh = function (id) {
    if (confirm('Are you sure you want to delete this event?')) {
        deleteEvent(id);
        renderAdminTable();
    }
};
