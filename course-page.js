// Course page functionality
class CoursePage {
    constructor(courses) {
      this.courses = courses;
      this.currentCourse = null;
      this.init();
    }
  
    init() {
      document.addEventListener('DOMContentLoaded', () => {
        // Get course ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = parseInt(urlParams.get('id'));
        
        // Find the course
        this.currentCourse = this.courses.find(c => c.id === courseId);
        
        if (this.currentCourse) {
          this.displayCourseDetails();
          this.setupAddToCartButton();
        } else {
          this.handleCourseNotFound();
        }
      });
    }
  
    displayCourseDetails() {
      // Update basic course information
      document.getElementById('courseTitle').textContent = `${this.currentCourse.title} Overview`;
      document.getElementById('courseDescription').textContent = this.currentCourse.description;
      document.getElementById('courseImage').src = this.currentCourse.image;
      document.getElementById('coursePrice').textContent = `R${this.currentCourse.price.toFixed(2)}`;
      document.getElementById('courseDuration').textContent = `Duration: ${this.currentCourse.duration}`;
      document.getElementById('courseLevel').textContent = `Level: ${this.currentCourse.level}`;
      document.getElementById('courseCertification').textContent = `Certification: ${this.currentCourse.certification}`;
  
      // Display learning outcomes
      const outcomesList = document.getElementById('courseOutcomes');
      outcomesList.innerHTML = ''; // Clear existing outcomes
      this.currentCourse.outcomes.forEach(outcome => {
        const li = document.createElement('li');
        li.textContent = outcome;
        outcomesList.appendChild(li);
      });
  
      // Add necessary data attributes for cart functionality
      const courseCard = document.querySelector('.course-card-details');
      courseCard.dataset.courseId = this.currentCourse.id;
    }
  
    setupAddToCartButton() {
      const addToCartButton = document.querySelector('.add-basket-btn');
      addToCartButton.addEventListener('click', () => {
        const courseData = {
          id: this.currentCourse.id,
          name: this.currentCourse.title,
          price: this.currentCourse.price,
          image: this.currentCourse.image
        };
  
        // Add to cart using the cart class from cart.js
        if (typeof cart !== 'undefined' && cart.addItem) {
          cart.addItem(courseData);
        } else {
          console.error('Cart functionality not available');
        }
      });
    }
  
    handleCourseNotFound() {
      const container = document.querySelector('.course-overview');
      container.innerHTML = `
        <div class="course-not-found">
          <h2>Course Not Found</h2>
          <p>Sorry, the requested course could not be found.</p>
          <a href="Catalogue.html" class="btn primary">Return to Catalogue</a>
        </div>
      `;
    }
  }
  
  // Initialize the course page with the courses data
  const coursePage = new CoursePage(courses);