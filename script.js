// Data Management
const STORAGE_KEY = 'event_booking_events';
const BOOKINGS_KEY = 'event_booking_bookings';

// Dummy Data
const dummyEvents = [
    {
        id: '1',
        title: 'Tech Conference 2025',
        date: '2025-03-15T09:00',
        venue: 'Silicon Valley Convention Center',
        description: 'Join the biggest tech minds for a day of innovation and networking.',
        image: '💻',
        price: 299
    },
    {
        id: '2',
        title: 'Summer Music Festival',
        date: '2025-07-20T16:00',
        venue: 'Central Park',
        description: 'Live performances from top artists. Food, drinks, and good vibes.',
        image: '🎵',
        price: 120
    },
    {
        id: '3',
        title: 'Digital Art Expo',
        date: '2025-05-10T10:00',
        venue: 'Modern Art Museum',
        description: 'Explore the future of digital art and NFTs.',
        image: '🎨',
        price: 50
    },
    {
        id: '4',
        title: 'Startup Pitch Night',
        date: '2025-04-05T18:30',
        venue: 'Innovation Hub',
        description: 'Watch early-stage startups pitch their ideas to investors.',
        image: '🚀',
        price: 0
    }
];

// Initialize Data
function initData() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyEvents));
    }
}

// Get all events
function getEvents() {
    const events = localStorage.getItem(STORAGE_KEY);
    return events ? JSON.parse(events) : [];
}

// Get single event
function getEventById(id) {
    const events = getEvents();
    return events.find(event => event.id === id);
}

// Save event (Create or Update)
function saveEvent(eventData) {
    const events = getEvents();
    const index = events.findIndex(e => e.id === eventData.id);

    if (index !== -1) {
        events[index] = eventData;
    } else {
        events.push(eventData);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

// Delete event
function deleteEvent(id) {
    let events = getEvents();
    events = events.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

// Save Booking
function saveBooking(bookingData) {
    const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    bookings.push(bookingData);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

// Format Date
function formatDate(dateString) {
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initData();

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Render Events on Home Page
    const eventsGrid = document.querySelector('.events-grid');
    const searchInput = document.getElementById('search-input');
    const filterSelect = document.getElementById('filter-select');

    function renderEvents(eventsToRender) {
        if (!eventsGrid) return;

        if (eventsToRender.length === 0) {
            eventsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; font-size: 1.2rem; color: var(--text-muted);">No events found matching your criteria.</p>';
            return;
        }

        eventsGrid.innerHTML = eventsToRender.map((event, index) => `
            <div class="event-card" style="animation-delay: ${index * 0.1}s">
                <div class="event-image">${event.image || '📅'}</div>
                <div class="event-details">
                    <div class="event-date">${formatDate(event.date)}</div>
                    <h3 class="event-title">${event.title}</h3>
                    <div class="event-venue">📍 ${event.venue}</div>
                    <p class="event-description">${event.description.substring(0, 100)}...</p>
                    <a href="event-details.html?id=${event.id}" class="btn">View Details</a>
                </div>
            </div>
        `).join('');
    }

    if (eventsGrid) {
        const allEvents = getEvents();
        renderEvents(allEvents);

        // Search Functionality
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filteredEvents = allEvents.filter(event =>
                    event.title.toLowerCase().includes(searchTerm) ||
                    event.description.toLowerCase().includes(searchTerm) ||
                    event.venue.toLowerCase().includes(searchTerm)
                );
                renderEvents(filteredEvents);
            });
        }

        // Filter Functionality
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                const category = e.target.value;
                let filteredEvents = allEvents;

                if (category !== 'all') {
                    // Simple category matching based on title or description keywords for this demo
                    filteredEvents = allEvents.filter(event =>
                        event.title.includes(category) ||
                        event.description.includes(category)
                    );
                }

                // Re-apply search if exists
                const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
                if (searchTerm) {
                    filteredEvents = filteredEvents.filter(event =>
                        event.title.toLowerCase().includes(searchTerm) ||
                        event.description.toLowerCase().includes(searchTerm) ||
                        event.venue.toLowerCase().includes(searchTerm)
                    );
                }

                renderEvents(filteredEvents);
            });
        }
    }

    // Render Event Details
    const eventDetailsContainer = document.getElementById('event-details-content');
    if (eventDetailsContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('id');
        const event = getEventById(eventId);

        if (event) {
            document.title = `${event.title} - Event Booking`;
            eventDetailsContainer.innerHTML = `
                <div class="event-header" style="text-align: center; margin-bottom: 40px; animation: fadeInUp 0.5s ease-out;">
                    <h1 style="font-size: 3rem; margin-bottom: 10px;">${event.title}</h1>
                    <div class="event-meta" style="display: flex; justify-content: center; gap: 20px; color: var(--text-light);">
                        <span>📅 ${formatDate(event.date)}</span>
                        <span>📍 ${event.venue}</span>
                        <span>💰 ${event.price > 0 ? '$' + event.price : 'Free'}</span>
                    </div>
                </div>
                <div class="event-body" style="background: white; padding: 40px; border-radius: 20px; box-shadow: var(--shadow); animation: fadeInUp 0.5s ease-out 0.2s backwards;">
                    <div style="font-size: 5rem; text-align: center; margin-bottom: 20px;">${event.image}</div>
                    <p style="font-size: 1.2rem; line-height: 1.8; margin-bottom: 30px;">${event.description}</p>
                    <div class="action-area" style="text-align: center;">
                        <a href="booking.html?id=${event.id}" class="btn btn-large" style="padding: 15px 40px; font-size: 1.2rem;">Book Ticket Now</a>
                    </div>
                </div>
            `;
        } else {
            eventDetailsContainer.innerHTML = '<p>Event not found.</p>';
        }
    }

    // Handle Booking Form
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('id');
        const event = getEventById(eventId);

        if (event) {
            document.getElementById('event-name-display').textContent = event.title;
            document.getElementById('event-id').value = event.id;
        } else {
            alert('Invalid Event');
            window.location.href = 'index.html';
        }

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const bookingData = {
                id: Date.now().toString(),
                eventId: eventId,
                eventName: event.title,
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                tickets: document.getElementById('tickets').value,
                date: new Date().toISOString()
            };

            saveBooking(bookingData);

            // Show Success Modal
            const modal = document.getElementById('success-modal');
            const ticketIdDisplay = document.getElementById('ticket-id-display');
            ticketIdDisplay.textContent = bookingData.id;

            modal.style.display = 'flex';
            // Trigger reflow
            void modal.offsetWidth;
            modal.classList.add('show');
        });
    }
    // --- Hero Carousel Logic ---
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroIndicators = document.querySelectorAll('.hero-indicator');
    const prevBtn = document.querySelector('.hero-control.prev');
    const nextBtn = document.querySelector('.hero-control.next');

    if (heroSlides.length > 0) {
        let currentHeroSlide = 0;
        const heroIntervalTime = 6000;
        let heroTimer;

        function showHeroSlide(index) {
            heroSlides.forEach(slide => slide.classList.remove('active'));
            heroIndicators.forEach(ind => ind.classList.remove('active'));

            // Handle wrapping
            if (index >= heroSlides.length) index = 0;
            if (index < 0) index = heroSlides.length - 1;

            heroSlides[index].classList.add('active');
            heroIndicators[index].classList.add('active');
            currentHeroSlide = index;
        }

        function nextHeroSlide() {
            showHeroSlide(currentHeroSlide + 1);
        }

        function prevHeroSlide() {
            showHeroSlide(currentHeroSlide - 1);
        }

        function startHeroTimer() {
            heroTimer = setInterval(nextHeroSlide, heroIntervalTime);
        }

        function resetHeroTimer() {
            clearInterval(heroTimer);
            startHeroTimer();
        }

        // Event Listeners
        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextHeroSlide();
            resetHeroTimer();
        });

        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevHeroSlide();
            resetHeroTimer();
        });

        heroIndicators.forEach((ind, index) => {
            ind.addEventListener('click', () => {
                showHeroSlide(index);
                resetHeroTimer();
            });
        });

        // Start auto-play
        startHeroTimer();
    }
});
