import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './customer-dashboard.html',
  styleUrl: './customer-dashboard.css',
})
export class CustomerDashboard {

  // ------------------- STATE -------------------
  selectedOptions = 'products';
  searchTerm: string = '';
  userId: number | null = null;
  categories: any[] = [];
  selectedCategoryId: number | 'all' = 'all';



  // ------------------- PRODUCTS -------------------
  products: any[] = [];
  filteredProducts: any[] = [];
  selectedCategory: string = 'all';
  selectedSort: string = '';

  // ------------------- CART -------------------
  cart: any[] = [];

  // ------------------- WISHLIST -------------------
  wishlist: any[] = [];

  // ------------------- ORDERS -------------------
  orders: any[] = [];
  orderConfirmation: any = {};
  selectedOrderDetails: any = null;

  // ------------------- FORMS -------------------
  checkoutForm: FormGroup;
  profileForm: FormGroup;

  constructor(private api: Api, private router: Router, private fb: FormBuilder) {

    this.userId = Number(localStorage.getItem('userId'));

    // PROFILE FORM (similar to yours)
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      contactnumber: ['', Validators.required],
      address: ['', Validators.required],
    });

    // CHECKOUT FORM
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      payment: ['', Validators.required],
    });

    // Initial Loads
    this.loadProducts();
    this.loadCart();
    this.loadWishlist();
    this.loadCategories();
  }
  loadCategories() {
    this.api.get('/categories').subscribe({
      next: (res: any) => {
        this.categories = res;
      },
      error: () => console.error('Failed to load categories')
    });
  }

  filterCategory(categoryId: number | 'all') {
    this.selectedCategoryId = categoryId;

    if (categoryId === 'all') {
      this.filteredProducts = this.products;
      return;
    }

    // backend category filtering
    this.api.get(`/categories/${categoryId}/products`).subscribe({
      next: (res: any) => {
        this.filteredProducts = res;
      },
      error: () => console.error('Failed to load category products')
    });
  }
  // -------------------------------------------------------------
  //                    PRODUCT OPERATIONS
  // -------------------------------------------------------------
  loadProducts() {
    this.api.get('/product/getall').subscribe({
      next: (res: any) => {
        this.products = res;
        this.filteredProducts = res;
      },
      error: (err: any) => console.error("Failed to load products", err)
    });
  }

  // searchProducts() {
  //   if (!this.searchTerm.trim()) {
  //     this.filteredProducts = this.products;
  //     return;
  //   }

  //   this.filteredProducts = this.products.filter((p: any) =>
  //     p.productName.toLowerCase().includes(this.searchTerm.toLowerCase())
  //   );
  // }
  searchProducts() {
    this.applyFilters();
  }

  // filterCategory(category: string) {
  //   if (category === 'all') {
  //     this.filteredProducts = this.products;
  //     return;
  //   }
  //   this.filteredProducts = this.products.filter((p: any) => p.categoryName === category);
  // }
  // filterCategory(category: string) {
  //   if (category === 'all') {
  //     this.filteredProducts = this.products;
  //     return;
  //   }

  //   this.filteredProducts = this.products.filter(p =>
  //     p.categoryName
  //       ?.trim()
  //       .toLowerCase() === category.trim().toLowerCase()
  //   );
  // }
  // filterCategory(category: string) {
  //   this.selectedCategory = category;
  //   this.applyFilters();
  // }
  applyFilters() {
    let list = [...this.products];

    // Category
    if (this.selectedCategory !== 'all') {
      list = list.filter(p =>
        p.categoryName?.trim().toLowerCase() ===
        this.selectedCategory.toLowerCase()
      );
    }

    // Search
    if (this.searchTerm.trim()) {
      list = list.filter(p =>
        p.productName
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredProducts = list;
  }


  // -------------------------------------------------------------
  //                    CART OPERATIONS
  // -------------------------------------------------------------
  // GET /api/cart (auth user comes from token)
  loadCart() {
    this.api.get('/cart').subscribe({
      next: (res: any) => {
        const items = res?.items ?? [];
        this.cart = items.map((ci: any) => ({
          cartItemId: ci.cartItemId,
          productId: ci.productId,
          productName: ci.productName,
          price: ci.unitPrice,    // map UnitPrice -> price for UI math
          quantity: ci.quantity,
          imageUrl: ci.imageUrl        // backend DTO doesn't include image; optional to add server-side
        }));
      },
      error: (err: any) => {
        console.error('Failed to load cart', err);
        this.cart = [];
      }
    });
  }
  // loadCart() {
  //   this.api.get(`/Cart/get/${this.userId}`).subscribe({
  //     next: (res: any) => this.cart = res ?? [],
  //     error: () => this.cart = []
  //   });
  // }
  // POST /api/cart/items  body: { productId, quantity }
  // POST /api/cart/items  body: { productId, quantity }
  addToCart(productId: number) {
    const payload = { productId, quantity: 1 };

    this.api.post('/cart/items', payload).subscribe({
      next: () => {
        // optional toast/alert
        alert("Added to cart!");
        // refresh cart and go to cart tab
        this.loadCart();
        this.selectOption('cart');
      },
      error: (err: any) => console.error('Failed to add to cart', err)
    });
  }

  // addToCart(productId: number) {
  //   const payload = {
  //     userId: this.userId,
  //     productId,
  //     quantity: 1
  //   };

  //   this.api.post('/Cart/add', payload).subscribe({
  //     next: () => {
  //       alert("Added to cart!");
  //       this.loadCart();
  //     },
  //     error: (err: any) => console.error("Failed to add to cart", err)
  //   });
  // }

  // DELETE /api/cart/items/{cartItemId}
  removeFromCart(cartItemId: number) {
    this.api.delete(`/cart/items/${cartItemId}`).subscribe({
      next: () => this.loadCart(),
      error: (err: any) => console.error('Cart item delete failed', err)
    });
  }


  // removeFromCart(cartItemId: number) {
  //   this.api.delete(`/Cart/remove/${cartItemId}`).subscribe({
  //     next: () => this.loadCart(),
  //     error: (err: any) => console.error("Cart item delete failed", err)
  //   });
  // }
  get cartTotal() {
    return this.cart.reduce((t: number, i: any) => t + Number(i.price) * Number(i.quantity), 0);
  }

  // get cartTotal() {
  //   return this.cart.reduce((t: number, i: any) => t + i.price * i.quantity, 0);
  // }

  // -------------------------------------------------------------
  //                    WISHLIST OPERATIONS
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  //                    WISHLIST OPERATIONS
  // -------------------------------------------------------------

  loadWishlist() {
    this.api.get('/wishlist').subscribe({
      next: (res: any) => {
        const items = res?.items ?? [];
        this.wishlist = items.map((wi: any) => ({
          wishlistItemId: wi.wishlistItemId,
          productId: wi.productId,
          productName: wi.productName,
          description: wi.description,
          unitPrice: wi.unitPrice,
          imageUrl: wi.imageUrl
        }));
      },
      error: (err: any) => {
        console.error('Failed to load wishlist', err);
        this.wishlist = [];
      }
    });
  }

  // addToWishlist(productId: number) {
  //   const payload = { productId };

  //   this.api.post('/wishlist/items', payload).subscribe({
  //     next: (res: any) => {
  //       // If backend returns string → show it
  //       if (typeof res === 'string') {
  //         alert(res);
  //       }
  //       // If backend returns DTO → success visually
  //       else {
  //         alert("Added to wishlist!");
  //       }

  //       this.loadWishlist();
  //       this.selectOption('wishlist');
  //     },
  //     error: (err: any) => console.error('Failed to add to wishlist', err)
  //   });
  // }
  addToWishlist(productId: number) {

    console.log('❤️ Wishlist clicked:', productId); // ✅ proves click works

    this.api.post('/wishlist/items', { productId }).subscribe({
      next: (res: any) => {
        console.log('✅ Wishlist success:', res);

        window.alert(
          typeof res === 'string'
            ? res
            : 'Item added to wishlist successfully!'
        );

        this.loadWishlist();
        this.selectOption('wishlist');
      },

      error: (err: any) => {
        console.error('❌ Wishlist failed:', err);

        // ✅ THIS WAS MISSING
        window.alert(
          err?.error || 'Failed to add item to wishlist'
        );
      }
    });
  }

  // removeFromWishlist(wishlistItemId: number) {
  //   this.api.delete(`/wishlist/items/${wishlistItemId}`).subscribe({
  //     next: () => {
  //       alert("Item removed from wishlist");
  //       this.loadWishlist();
  //     },
  //     error: (err: any) => console.error('Failed to remove wishlist item', err)
  //   });
  // }
  removeFromWishlist(wishlistItemId: number) {

    console.log('🗑️ Remove wishlist item:', wishlistItemId);

    this.api.delete(`/wishlist/items/${wishlistItemId}`).subscribe({
      next: () => {
        console.log('✅ Removed from wishlist');

        window.alert('Item removed from wishlist');

        this.loadWishlist();
      },
      error: (err: any) => {
        console.error('❌ Remove wishlist failed:', err);

        window.alert(
          err?.error || 'Failed to remove item from wishlist'
        );
      }
    });
  }

  moveToCart(wishlistItemId: number) {

    console.log('➡️ Move to cart clicked:', wishlistItemId);

    this.api.postText(`/wishlist/move/${wishlistItemId}`, {}).subscribe({
      next: (res: string) => {
        // ✅ res is plain text now
        window.alert(res);

        this.loadWishlist();
        this.loadCart();
        this.selectOption('cart');
      },
      error: (err: any) => {
        console.error('❌ Move to cart failed:', err);
        window.alert('Failed to move item to cart');
      }
    });
  }
  // Check if product already in wishlist
  isWishlisted(productId: number): boolean {
    return this.wishlist.some(w => w.productId === productId);
  }

  // Toggle wishlist
  toggleWishlist(productId: number) {
    if (this.isWishlisted(productId)) {
      const item = this.wishlist.find(w => w.productId === productId);
      if (item) {
        this.removeFromWishlist(item.wishlistItemId);
      }
    } else {
      this.addToWishlist(productId);
    }
  }


  // -------------------------------------------------------------
  //                    CHECKOUT OPERATIONS
  // -------------------------------------------------------------
  placeOrder() {
    if (this.checkoutForm.invalid) return;

    const payload = {
      userId: this.userId,
      items: this.cart,
      total: this.cartTotal,
      shipping: this.checkoutForm.value
    };

    this.api.post('/Orders/place', payload).subscribe({
      next: (res: any) => {
        this.orderConfirmation = res;
        this.selectedOptions = 'confirmation';
      }
    });
  }


  // -------------------------------------------------------------
  //                    ORDER OPERATIONS
  // -------------------------------------------------------------
  loadOrders() {
    this.api.get(`/Orders/getall/${this.userId}`).subscribe({
      next: (res: any) => this.orders = res ?? [],
      error: () => this.orders = []
    });
  }

  // trackOrder(orderId: number) {
  //   alert(`Tracking Order #${orderId}`);
  // }

  viewOrderDetails(orderId: number) {
    this.api.get(`/orderdetails/${orderId}`).subscribe({
      next: (res: any) => {
        this.selectedOrderDetails = res;
        this.selectedOptions = 'orderDetails'; // switch view
      },
      error: err => {
        console.error('Failed to load order details', err);
        alert('Could not load order details');
      }
    });
  }

  // -------------------------------------------------------------
  //                    PROFILE OPERATIONS
  // -------------------------------------------------------------
  loadProfile() {
    this.api.get(`/Customer/get/${this.userId}`).subscribe({
      next: (res: any) => {
        this.profileForm.patchValue({
          name: res.name,
          email: res.email,
          contactnumber: res.contactNumber,
          address: res.address
        });
      }
    });
  }

  onProfileSubmit() {
    if (!this.profileForm.valid) return;

    const payload = {
      Name: this.profileForm.value.name,
      ContactNumber: this.profileForm.value.contactnumber,
      Address: this.profileForm.value.address
    };

    this.api.post(`/Customer/update/${this.userId}`, payload).subscribe({
      next: () => alert("Profile updated!"),
      error: (err: any) => console.error("Profile update failed", err)
    });
  }

  // -------------------------------------------------------------
  //                    NAVIGATION
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  //                    EXTRA FILTER & SORT
  // -------------------------------------------------------------
  openFilter() {
    // For now, just show a placeholder
    alert("Filter options coming soon!");
  }

  // sortProducts(criteria: string) {
  //   if (criteria === 'featured') {
  //     // Example: sort by featured flag
  //     this.filteredProducts = [...this.filteredProducts].sort((a, b) =>
  //       a.isFeatured === b.isFeatured ? 0 : a.isFeatured ? -1 : 1
  //     );
  //   } else if (criteria === 'priceLowHigh') {
  //     this.filteredProducts = [...this.filteredProducts].sort((a, b) => a.price - b.price);
  //   } else if (criteria === 'priceHighLow') {
  //     this.filteredProducts = [...this.filteredProducts].sort((a, b) => b.price - a.price);
  //   }
  // }
  sortProducts(criteria: string) {

    if (criteria === 'featured') {
      // Example: Highest price first (acts as Featured)
      this.filteredProducts = [...this.filteredProducts].sort(
        (a, b) => b.price - a.price
      );
    }

    if (criteria === 'priceLowHigh') {
      this.filteredProducts = [...this.filteredProducts].sort(
        (a, b) => a.price - b.price
      );
    }

    if (criteria === 'priceHighLow') {
      this.filteredProducts = [...this.filteredProducts].sort(
        (a, b) => b.price - a.price
      );
    }
  }


  // selectOption(option: string) {
  //   this.selectedOptions = option;

  //   if (option === 'products') this.loadProducts();
  //   else if (option === 'cart') this.loadCart();
  //   else if (option === 'wishlist') this.loadWishlist();
  //   else if (option === 'orders') this.loadOrders();
  //   else if (option === 'profile') this.loadProfile();
  // }
  selectOption(option: string) {
    this.selectedOptions = option;

    if (option === 'cart') this.loadCart();
    else if (option === 'wishlist') this.loadWishlist();
    else if (option === 'orders') this.loadOrders();
    else if (option === 'profile') this.loadProfile();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}