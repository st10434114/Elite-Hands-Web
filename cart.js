// Cart functionality
class ShoppingCart {
    constructor() {
      this.items = [];
      this.init();
    }
  
    init() {
      // Initialize DOM elements
      this.cartTrigger = document.querySelector('.cart-trigger');
      this.cartDropdown = document.querySelector('.cart-dropdown');
      this.cartItems = document.querySelector('.cart-items');
      this.cartEmpty = document.querySelector('.cart-empty');
      this.cartCount = document.querySelector('.cart-count');
      this.cartItemsCount = document.querySelector('.cart-items-count');
      this.subtotalElement = document.querySelector('.subtotal');
      this.discountElement = document.querySelector('.discount');
      this.totalElement = document.querySelector('.total');
      this.checkoutBtn = document.querySelector('.checkout-btn');
  
      // Add event listeners
      this.cartTrigger.addEventListener('click', () => this.toggleCart());
      document.addEventListener('click', (e) => this.handleClickOutside(e));
      this.checkoutBtn.addEventListener('click', () => this.handleCheckout());
  
      // Load cart from localStorage
      this.loadCart();
    }
  
    toggleCart() {
      this.cartDropdown.classList.toggle('active');
    }
  
    handleClickOutside(event) {
      if (!this.cartDropdown.contains(event.target) && 
          !this.cartTrigger.contains(event.target)) {
        this.cartDropdown.classList.remove('active');
      }
    }
  
    addItem(item) {
      // Check if item already exists
      const existingItem = this.items.find(i => i.id === item.id);
      if (existingItem) {
        alert('This course is already in your cart');
        return;
      }
  
      this.items.push(item);
      this.updateCart();
      this.saveCart();
    }
  
    removeItem(itemId) {
      this.items = this.items.filter(item => item.id !== itemId);
      this.updateCart();
      this.saveCart();
    }
  
    calculateTotals() {
      const subtotal = this.items.reduce((sum, item) => sum + item.price, 0);
      let discount = 0;
  
      // Apply discount based on number of items
      if (this.items.length >= 3) {
        discount = subtotal * 0.15; // 15% for 3 or more items
      } else if (this.items.length === 2) {
        discount = subtotal * 0.05; // 5% for 2 items
      }
  
      const total = subtotal - discount;
  
      return { subtotal, discount, total };
    }
  
    updateCart() {
      // Update cart count
      this.cartCount.textContent = this.items.length;
      this.cartItemsCount.textContent = `${this.items.length} item${this.items.length !== 1 ? 's' : ''}`;
  
      // Show/hide empty cart message
      if (this.items.length === 0) {
        this.cartEmpty.classList.remove('cart-hidden');
        this.cartItems.classList.add('cart-hidden');
        this.checkoutBtn.disabled = true;
      } else {
        this.cartEmpty.classList.add('cart-hidden');
        this.cartItems.classList.remove('cart-hidden');
        this.checkoutBtn.disabled = false;
      }
  
      // Update cart items
      this.cartItems.innerHTML = this.items.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-details">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">R${item.price.toFixed(2)}</div>
          </div>
          <button class="remove-item" onclick="cart.removeItem('${item.id}')">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `).join('');
  
      // Update totals
      const { subtotal, discount, total } = this.calculateTotals();
      this.subtotalElement.textContent = `R${subtotal.toFixed(2)}`;
      this.discountElement.textContent = `R${discount.toFixed(2)}`;
      this.totalElement.textContent = `R${total.toFixed(2)}`;
    }
  
    handleCheckout() {
      const { total } = this.calculateTotals();
      
      // Show thank you message with total amount
      alert(`Thank you for choosing Elite Hands!\nYour total purchase amount is R${total.toFixed(2)}.\nWe will contact you shortly with further instructions.`);
      
      // Clear cart
      this.items = [];
      this.updateCart();
      this.saveCart();
      
      // Close cart dropdown
      this.cartDropdown.classList.remove('active');
    }
  
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    }
  
    loadCart() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.items = JSON.parse(savedCart);
        this.updateCart();
      }
    }
  }
  
  // Initialize cart
  const cart = new ShoppingCart();
  
  // Add this to your course page "Add to Basket" button
  document.querySelectorAll('.add-basket-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const courseContainer = e.target.closest('.course-card-details');
      const course = {
        id: courseContainer.dataset.courseId,
        name: courseContainer.querySelector('h3').textContent,
        price: parseFloat(courseContainer.querySelector('.price').textContent.replace('R', '')),
        image: courseContainer.querySelector('img').src
      };
      cart.addItem(course);
    });
  });