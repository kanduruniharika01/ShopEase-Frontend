import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './manager-dashboard.html',
  styleUrl: './manager-dashboard.css',
})
export class ManagerDashboard {

  selectedOptions = 'products';
  profileForm: FormGroup;

  // ---------------- PRODUCTS ----------------
  products: any[] = [];
  addForm: FormGroup;
  editForm: FormGroup;
  showEditModal = false;
  selectedProductId: number | null = null;
  userId: number | null = null;


  // ---------------- CATEGORIES ----------------
  categories: any[] = [];
  categoryForm: FormGroup;
  categoryEditForm: FormGroup;
  showCategoryModal = false;
  selectedCategoryId: number | null = null;

  constructor(private api: Api, private fb: FormBuilder, private router: Router) {

    // PRODUCT CREATE FORM
    this.addForm = this.fb.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
      description: ['', Validators.required]
    });

    // PRODUCT EDIT FORM
    this.editForm = this.fb.group({
      productId: ['', Validators.required],
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.profileForm = this.fb.group({
      name: [{ value: '', disabled: false }, Validators.required], // Start as editable
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]], // Disabled by default
      phone: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      gender: ['', Validators.required],
    });

    // CATEGORY CREATE FORM
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    // CATEGORY EDIT FORM
    this.categoryEditForm = this.fb.group({
      categoryId: ['', Validators.required],
      name: ['', Validators.required],
      description: ['']
    });

    this.loadProducts();
    this.loadCategories();
    this.userId = Number(localStorage.getItem('userId'));
  }

  // ----------------------------------------------------
  // LOAD PRODUCTS
  // ----------------------------------------------------
  loadProducts() {
    this.api.get('/categories').subscribe({
      next: () => { }, error: () => { }
    });

    this.api.get('/product/getall').subscribe({
      next: (res: any) => {
        this.products = res;
      }
    });
  }

  // ----------------------------------------------------
  // LOAD CATEGORIES
  // ----------------------------------------------------
  loadCategories() {
    this.api.get('/categories').subscribe({
      next: (res: any) => {
        this.categories = res;
      }
    });
  }

  selectOption(option: string) {
    this.selectedOptions = option;

    if (option === "products") {
      this.loadProducts();
    }
    else if (option === "categories") {
      this.loadCategories();
    }
    else if (option === 'profile') {
      this.loadProfile();
    }
  }


  // ----------------------------------------------------
  // ADD PRODUCT
  // ----------------------------------------------------
  onAddSubmit() {
    if (this.addForm.invalid) return;

    const payload = {
      ProductName: this.addForm.value.name,
      ProductDescription: this.addForm.value.description,
      Price: this.addForm.value.price,
      StockQuantity: this.addForm.value.stock,
      ImageUrl: this.addForm.value.imageUrl,
      CategoryId: this.addForm.value.categoryId,
      isActive: true
    };

    this.api.post('/product/create', payload).subscribe({
      next: () => {
        alert("Product created!");
        this.addForm.reset();
        this.selectOption('products');
      }
    });
  }

  // ----------------------------------------------------
  // EDIT PRODUCT (OPEN MODAL)
  // ----------------------------------------------------
  closeEditModal() {
    this.showEditModal = false;
    this.editForm.reset();
  }
  openEditModal(productId: number) {
    this.showEditModal = true;
    this.selectedProductId = productId;

    this.api.get(`/product/get/${productId}`).subscribe({
      next: (res: any) => {
        this.editForm.patchValue({
          productId,
          name: res.productName,
          categoryId: res.categoryId,
          price: res.price,
          stock: res.stockquantity,
          imageUrl: res.imageUrl,
          description: res.productDescription
        });
      },
      error: (err: any) => {
        console.error('Failed to load package for editing', err);
        alert('Failed to load package details. Please try again.');
        this.closeEditModal();
      }
    });
  }

  // UPDATE PRODUCT
  onEditSubmit() {
    if (this.editForm.valid) {

      const payload = {
        ProductName: this.editForm.value.name,
        ProductDescription: this.editForm.value.description,
        Price: this.editForm.value.price,
        StockQuantity: this.editForm.value.stock,
        ImageUrl: this.editForm.value.imageUrl,
        CategoryId: this.editForm.value.categoryId,
        isActive: true
      };

      this.api.post(`/product/update/${this.selectedProductId}`, payload).subscribe({
        next: (res: any) => {
          alert("Product updated!");
          console.log(res);
          this.closeEditModal();
          this.selectOption('products');
        },
        error: (err: any) => {
          // You might need responseType: 'text' here too if the update endpoint returns plain text
          alert(err.error || 'Update failed!');
          console.error(err);
        }
      });
    }
    else {
      this.editForm.markAllAsTouched();
      alert('Please correct the errors in the form.');
    }
  }



  // ----------------------------------------------------
  // DELETE PRODUCT
  // ----------------------------------------------------
  deleteProduct(productId: number) {


    this.api.delete(`/product/delete/${productId}`).subscribe({
      next: (res: any) => {
        alert("Product deleted!");
        console.log(res);
        this.selectOption('products');
        this.loadProducts();
      },
      error: (err: any) => {
        alert(err.error || 'Delete failed!');
        console.error(err);
      }
    });
  }

  // ----------------------------------------------------
  // CATEGORY CREATE
  // ----------------------------------------------------
  onAddCategory() {
    if (this.categoryForm.invalid) return;

    const payload = {
      name: this.categoryForm.value.name,
      description: this.categoryForm.value.description
    };

    this.api.post('/categories', payload).subscribe({
      next: () => {
        alert("Category added!");
        this.categoryForm.reset();
        this.loadCategories();
      }
    });
  }

  // ----------------------------------------------------
  // CATEGORY EDIT
  // ----------------------------------------------------
  openCategoryEditModal(category: any) {
    this.showCategoryModal = true;

    this.categoryEditForm.patchValue({
      categoryId: category.categoryId,
      name: category.categoryName,
      description: category.description
    });
  }

  onCategoryUpdate() {
    const id = this.categoryEditForm.value.categoryId;

    const payload = {
      name: this.categoryEditForm.value.name,
      description: this.categoryEditForm.value.description
    };

    this.api.put(`/categories/${id}`, payload).subscribe({
      next: () => {
        alert("Category updated!");
        this.showCategoryModal = false;
        this.loadCategories();
      }
    });
  }
  loadProfile() {
    this.api.get(`/Manager/get/${this.userId}`).subscribe({
      next: (res: any) => {
        this.profileForm.patchValue({
          name: res.name,
          email: res.email,
          phone: res.phone,
          age: res.age,
          gender: res.gender
        });
      },
      error: (err: any) => {
        console.error('Failed to load profile', err);
      }
    });
    setTimeout(() => {
      const nameInput = document.getElementById('profile-name') as HTMLInputElement;
      if (nameInput) {
        nameInput.focus();
      }
    }, 0);
  }
  // onProfileSubmit() {
  //   if (this.profileForm.valid) {
  //     const payload = {
  //       Name: this.profileForm.value.name,
  //       ContactNumber: this.profileForm.value.contactnumber,
  //       Age: this.profileForm.value.age,
  //       Gender: this.profileForm.value.gender
  //     };
  //     this.api.post(`/Manager/update/${this.id}`, payload).subscribe({
  //       next: (res: any) => {
  //         alert('Profile updated successfully!');
  //         console.log(res);
  //       },
  //       error: (err: any) => {
  //         alert(err.error || 'Update failed!');
  //         console.error(err);
  //       }
  //     });
  //   } else {
  //     alert('Please fill all fields correctly.');
  //   }
  // }
  onProfileSubmit() {
    if (this.profileForm.valid) {


      const payload = {
        Name: this.profileForm.value.name,
        ContactNumber: this.profileForm.value.phone,
        Age: this.profileForm.value.age,
        Gender: this.profileForm.value.gender
      };

      this.api.post(`/Manager/update/${this.userId}`, payload).subscribe({
        next: (res: any) => {
          alert('Profile updated successfully!');
          console.log(res);
        },
        error: (err: any) => {
          alert(err.error || 'Update failed!');
          console.error(err);
        }
      });

    } else {
      alert('Please fill all fields correctly.');
    }
  }
  logout() {
    const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    if (isBrowser) {
      localStorage.removeItem('token');
      alert('Logged out successfully');
      this.router.navigate(['/login']);
    }

  }
  backtohome() {
    alert("Going back to Home");
    this.router.navigate(['/home']);
  }
  onSubmit() {
    if (this.addForm.valid) {

      const payload = {
        ProductName: this.addForm.value.name,
        ProductDescription: this.addForm.value.description,
        Price: this.addForm.value.price,
        StockQuantity: this.addForm.value.stock,
        ImageUrl: this.addForm.value.imageUrl,
        CategoryId: this.addForm.value.categoryId,
        isActive: true
      };

      this.api.post('/product/create', payload).subscribe({
        next: (res: any) => {
          alert('Product created successfully!');
          this.addForm.reset();
          this.selectOption('products'); // same as packages in travel version
          console.log(res);
        },
        error: (err: any) => {
          alert(err.error || 'Product creation failed!');
          console.error(err);
        }
      });

    } else {
      alert('Please fill all fields correctly.');
    }
  }
}


