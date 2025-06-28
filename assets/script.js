
// document.addEventListener('DOMContentLoaded', () => {
//     const navIcons = document.querySelectorAll('.nav-icons .active-btn');
//     const sections = document.querySelectorAll('.tab-section');

//     navIcons.forEach((icon, index) => {
//         icon.addEventListener('click', () => {
//             // Remove active class from all sections
//             sections.forEach(section => section.classList.remove('active'));
            
//             // Add active class to the corresponding section
//             const sectionId = icon.dataset.section || ['home', 'profile', 'blog'][index];
//             const targetSection = document.getElementById(sectionId);
//             if (targetSection) {
//                 targetSection.classList.add('active');
//             }
//         });
//     });
// });

document.addEventListener('DOMContentLoaded', () => {
    const navIcons = document.querySelectorAll('.nav-icons button');
    const sections = document.querySelectorAll('.tab-section');

    navIcons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Remove active class from all sections and buttons
            sections.forEach(section => section.classList.remove('active'));
            navIcons.forEach(btn => btn.classList.remove('active-btn'));

            // Add active class to the corresponding section
            const sectionId = button.querySelector('img').getAttribute('data-section') || 
                ['home', 'blog', 'calendar-daily', 'profile'][index];
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            button.classList.add('active-btn');
        });
    });

    // Date navigation functionality
    window.changeDate = function(days) {
        const dateElement = document.getElementById('currentDate');
        let currentDate = new Date(dateElement.textContent);
        currentDate.setDate(currentDate.getDate() + days);
        dateElement.textContent = currentDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };
});