import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class CustomerDashboard implements OnInit, OnDestroy {
  // ------------------- BANNER CAROUSEL -------------------
  banners = [
    {
      title: 'Spring Sale',
      subtitle: 'Up to 50% off on selected items',
      // buttonText: 'Shop Now',
      action: 'products',
      image: 'https://rukminim2.flixcart.com/fk-p-flap/3200/1560/image/839a12988ca0b41c.jpg?q=60'
    },
    {
      title: 'New Arrivals',
      subtitle: 'Discover the latest trends',
      // buttonText: 'Explore',
      action: 'products',
      image: 'https://www.retail-insight-network.com/wp-content/uploads/sites/18/2021/08/shutterstock_1532527196-1.jpg'
      //image: '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'
    },
    {
      title: 'Mega Deals',
      subtitle: 'Limited time offers',
      // buttonText: 'Grab Now',
      action: 'products',
      image: 'https://www.virginmegastore.ae/medias/full-width-large-Book-Offers-UAE-desktop.jpg?context=bWFzdGVyfHJvb3R8MzE0MjU0fGltYWdlL2pwZWd8aDI2L2gyMS85NzEyNzk0NTY2Njg2L2Z1bGwtd2lkdGgtbGFyZ2UtQm9vay1PZmZlcnMtVUFFLWRlc2t0b3AuanBnfDQzNmEyNDZlYWViNDUwYTc2MTQ4MGJiYmIyZDhlZTZjNDBjMTI5YjlhYmY0M2JiODI1MmJkMDM0MzNlZDAxYmM'
    },

    {
      title: 'Freshness you can trust',
      subtitle: '',
      buttonText: 'Shop Now',
      action: 'products',
      image: 'https://wallpaperbat.com/img/8606412-trail-mix-health-ep-chiropractic.jpg'
    },
    {
      title: 'Everything you need, in one place',
      subtitle: '',
      // buttonText: 'Explore',
      action: 'products',
      image: 'https://media.vogue.in/wp-content/uploads/2017/04/how-to-shop-for-beauty.jpg'
    },
    {
      title: 'Upgrade your everyday tech',
      subtitle: '',
      buttonText: 'View Deals',
      action: 'products',
      image: 'https://cdn.mos.cms.futurecdn.net/pgENdPdxZcMvNyNkoRUFui.jpg'
    }

  ];

  activeBannerIndex = 0;
  bannerInterval: any;
  carouselInterval: number | null = null;

  // ------------------- STATE -------------------
  selectedOptions = 'products';
  searchTerm: string = '';
  userId: number | null = null;
  categories: any[] = [];
  selectedCategoryId: number | 'all' = 'all';



  // ------------------- PRODUCTS -------------------
  products: any[] = [];
  filteredProducts: any[] = [];
  // ------------------- PRODUCT DETAILS (NEW) -------------------
  selectedProduct: any = null;
  activeImageIndex: number = 0;
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
  // -------------------------------------------------------------
  //                    PRODUCT DETAILS (NEW)
  // -------------------------------------------------------------
  // openProductDetails(productId: number) {
  //   this.api.get(`/product/get/${productId}`).subscribe({
  //     next: (res: any) => {
  //       this.selectedProduct = res;      // includes images[], features[]
  //       this.activeImageIndex = 0;
  //     },
  //     error: err => {
  //       console.error('Failed to load product details', err);
  //       alert('Could not load product details');
  //     }
  //   });
  // }

  // closeProductDetails() {
  //   this.selectedProduct = null;
  // }


  ngOnInit(): void {
    this.startCarousel();
  }

  startCarousel(): void {
    this.carouselInterval = window.setInterval(() => {
      this.activeBannerIndex =
        (this.activeBannerIndex + 1) % this.banners.length;
    }, 4000);
  }


  setBanner(index: number) {
    this.activeBannerIndex = index;
  }


  ngOnDestroy(): void {
    if (this.carouselInterval !== null) {
      clearInterval(this.carouselInterval);
    }
  }


  openProductDetails(productId: number) {
    this.api.get(`/product/get/${productId}`).subscribe({
      next: (res: any) => {
        this.selectedProduct = {
          ...res,

          // ✅ GUARANTEE arrays even if backend sends null
          images: Array.isArray(res.images) ? res.images : [],
          features: Array.isArray(res.features) ? res.features : []
        };

        // ✅ RESET gallery index safely
        this.activeImageIndex = 0;
      },
      error: err => {
        console.error('Failed to load product details', err);
        alert('Could not load product details');
      }
    });
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

  goToProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  // addToCart(productId: number) {
  //   const payload = { productId, quantity: 1 };

  //   this.api.post('/cart/items', payload).subscribe({
  //     next: () => {
  //       // optional toast/alert
  //       window.alert("Added to cart!");
  //       // refresh cart and go to cart tab
  //       this.loadCart();
  //       this.selectOption('cart');
  //     },
  //     error: (err: any) => console.error('Failed to add to cart', err)
  //   });
  // }
  addToCart(productId: number) {
    const payload = { productId, quantity: 1 };

    this.api.postText('/cart/items', payload).subscribe({
      next: (res: string) => {
        window.alert(res); // ✅ "Item added to cart."
        this.loadCart();
        this.selectOption('cart');
      },
      error: (err: any) => {
        console.error('Failed to add to cart', err);
        window.alert('Failed to add item to cart');
      }
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
          // description: wi.description,
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
  increaseQty(item: any) {
    item.quantity += 1;
  }

  decreaseQty(item: any) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    }
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