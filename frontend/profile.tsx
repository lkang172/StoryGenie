document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('lesson-form') as HTMLFormElement;
    
    form.addEventListener('submit', (e: Event) => {
        e.preventDefault();
        
        const lessons = (document.getElementById('lessons') as HTMLInputElement).value;
        const characters = (document.getElementById('characters') as HTMLInputElement).value;
        const themes = (document.getElementById('themes') as HTMLInputElement).value;
        
        // Here you can add the logic to handle the form submission
        console.log('Lessons:', lessons);
        console.log('Characters:', characters);
        console.log('Themes:', themes);
        
        // You can replace this with your own logic to generate the lesson
        alert('Lesson generated! Check the console for details.');
    });
});