class RecipeVault {
  constructor() {
    this.recipes = this.loadRecipes()
    this.currentEditId = null
    this.ingredients = []
    this.instructions = []
    this.tags = []
    this.currentView = "grid"

    this.initializeApp()
  }

  async initializeApp() {
    // Show loading screen
    await this.showLoadingScreen()

    // Initialize event listeners
    this.initializeEventListeners()

    // Load sample data if needed
    this.loadSampleData()

    // Render initial content
    this.renderRecipes()
    this.updateStats()

    // Hide loading screen
    this.hideLoadingScreen()
  }

  showLoadingScreen() {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000) // Simulate loading time
    })
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById("loadingScreen")
    loadingScreen.classList.add("hidden")
    setTimeout(() => {
      loadingScreen.style.display = "none"
    }, 500)
  }

  initializeEventListeners() {
    // Modal controls
    document.getElementById("addRecipeBtn").addEventListener("click", () => this.openModal())
    document.getElementById("closeModal").addEventListener("click", () => this.closeModal())
    document.getElementById("closeDetailModal").addEventListener("click", () => this.closeDetailModal())
    document.getElementById("cancelBtn").addEventListener("click", () => this.closeModal())

    // Form submission
    document.getElementById("recipeForm").addEventListener("submit", (e) => this.handleFormSubmit(e))

    // Search and filters
    document.getElementById("searchInput").addEventListener("input", (e) => this.handleSearch(e.target.value))
    document.getElementById("categoryFilter").addEventListener("change", (e) => this.handleFilter())
    document.getElementById("difficultyFilter").addEventListener("change", (e) => this.handleFilter())

    // View controls
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleViewChange(e.target.dataset.view))
    })

    // Ingredient management
    document.getElementById("addIngredientBtn").addEventListener("click", () => this.addIngredient())
    document.getElementById("ingredientInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        this.addIngredient()
      }
    })

    // Instruction management
    document.getElementById("addInstructionBtn").addEventListener("click", () => this.addInstruction())
    document.getElementById("instructionInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault()
        this.addInstruction()
      }
    })

    // Tag management
    document.getElementById("addTagBtn").addEventListener("click", () => this.addTag())
    document.getElementById("tagInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        this.addTag()
      }
    })

    // Image upload
    document.getElementById("recipeImage").addEventListener("change", (e) => this.handleImageUpload(e))
    document.getElementById("imageUploadArea").addEventListener("click", () => {
      document.getElementById("recipeImage").click()
    })

    // Drag and drop for image upload
    const uploadArea = document.getElementById("imageUploadArea")
    uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault()
      uploadArea.style.borderColor = "var(--primary-color)"
    })

    uploadArea.addEventListener("dragleave", (e) => {
      e.preventDefault()
      uploadArea.style.borderColor = "var(--border-color)"
    })

    uploadArea.addEventListener("drop", (e) => {
      e.preventDefault()
      uploadArea.style.borderColor = "var(--border-color)"
      const files = e.dataTransfer.files
      if (files.length > 0) {
        document.getElementById("recipeImage").files = files
        this.handleImageUpload({ target: { files } })
      }
    })

    // Close modals when clicking outside
    document.getElementById("recipeModal").addEventListener("click", (e) => {
      if (e.target.id === "recipeModal") this.closeModal()
    })

    document.getElementById("recipeDetailModal").addEventListener("click", (e) => {
      if (e.target.id === "recipeDetailModal") this.closeDetailModal()
    })
  }

  // Data Management
  loadRecipes() {
    const recipes = localStorage.getItem("recipeVaultData")
    return recipes ? JSON.parse(recipes) : []
  }

  saveRecipes() {
    localStorage.setItem("recipeVaultData", JSON.stringify(this.recipes))
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  loadSampleData() {
    if (this.recipes.length === 0) {
      this.recipes = [
        {
          id: this.generateId(),
          title: "Gourmet Truffle Pasta",
          description: "An exquisite pasta dish featuring black truffles, wild mushrooms, and aged parmesan in a creamy white wine sauce.",
          ingredients: ["200g pasta", "50g black truffles", "100g wild mushrooms", "50g parmesan cheese", "100ml white wine", "Salt", "Pepper"],
          instructions: ["Cook pasta until al dente.", "Sauté mushrooms in olive oil.", "Add white wine and reduce.", "Mix in truffles and parmesan.", "Combine with pasta and serve."],
          tags: ["Gourmet", "Italian", "Truffle"],
          image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
          rating: 4.8,
          prepTime: 15,
          cookTime: 25,
          servings: 4,
          difficulty: "hard",
          calories: 650
        },
        {
          id: this.generateId(),
          title: "Spicy Korean Bibimbap Bowl",
          description: "A vibrant Korean rice bowl topped with seasoned vegetables, marinated beef, and a perfectly fried egg.",
          ingredients: ["200g rice", "100g beef", "1 egg", "Assorted vegetables", "Gochujang sauce", "Sesame oil", "Salt"],
          instructions: ["Cook rice and set aside.", "Sauté vegetables with sesame oil.", "Cook beef with gochujang sauce.", "Fry egg sunny-side up.", "Assemble bowl and serve."],
          tags: ["Korean", "Healthy", "Colorful"],
          image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
          rating: 4.7,
          prepTime: 20,
          cookTime: 30,
          servings: 2,
          difficulty: "medium",
          calories: 520
        },
        {
          id: this.generateId(),
          title: "Decadent Chocolate Lava Cake",
          description: "Individual chocolate cakes with a molten center, served warm with vanilla ice cream.",
          ingredients: ["100g dark chocolate", "50g butter", "50g sugar", "2 eggs", "30g flour", "Vanilla ice cream"],
          instructions: ["Melt chocolate and butter.", "Mix in sugar and eggs.", "Fold in flour.", "Pour into molds and bake.", "Serve with ice cream."],
          tags: ["Dessert", "Chocolate", "Lava Cake"],
          image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
          rating: 4.9,
          prepTime: 10,
          cookTime: 17,
          servings: 4,
          difficulty: "medium",
          calories: 420
        },
        // NEW SAMPLE RECIPES BELOW
        {
          id: this.generateId(),
          title: "Classic Margherita Pizza",
          description: "A timeless Italian pizza with fresh mozzarella, basil, and a rich tomato sauce.",
          ingredients: ["Pizza dough", "100g mozzarella", "Fresh basil", "Tomato sauce", "Olive oil", "Salt"],
          instructions: ["Roll out dough.", "Spread tomato sauce.", "Add mozzarella and basil.", "Drizzle olive oil.", "Bake until golden."],
          tags: ["Pizza", "Italian", "Vegetarian"],
          image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
          rating: 4.6,
          prepTime: 30,
          cookTime: 0,
          servings: 2,
          difficulty: "easy",
          calories: 300
        },
        {
          id: this.generateId(),
          title: "Chicken Caesar Salad",
          description: "Crisp romaine, grilled chicken, parmesan, and croutons tossed in creamy Caesar dressing.",
          ingredients: ["Romaine lettuce", "Grilled chicken breast", "Parmesan", "Croutons", "Caesar dressing", "Salt", "Pepper"],
          instructions: ["Chop lettuce.", "Grill and slice chicken.", "Toss all ingredients with dressing."],
          tags: ["Salad", "Chicken", "Healthy"],
          image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=800&q=80",
          rating: 4.3,
          prepTime: 20,
          cookTime: 0,
          servings: 2,
          difficulty: "easy",
          calories: 350
        },
        {
          id: this.generateId(),
          title: "Paneer Butter Masala",
          description: "Indian cottage cheese cubes in a rich, creamy tomato gravy with aromatic spices.",
          ingredients: ["200g paneer", "Tomato puree", "Cream", "Butter", "Spices", "Salt"],
          instructions: ["Sauté spices in butter.", "Add tomato puree and cook.", "Add paneer and cream.", "Simmer and serve."],
          tags: ["Indian", "Vegetarian", "Curry"],
          image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
          rating: 4.7,
          prepTime: 35,
          cookTime: 0,
          servings: 3,
          difficulty: "medium",
          calories: 400
        },
        {
          id: this.generateId(),
          title: "Vegan Buddha Bowl",
          description: "A nourishing bowl with quinoa, roasted veggies, chickpeas, and tahini dressing.",
          ingredients: ["Quinoa", "Chickpeas", "Roasted vegetables", "Tahini dressing", "Spinach", "Avocado"],
          instructions: ["Cook quinoa.", "Roast veggies.", "Assemble all ingredients in a bowl.", "Drizzle with tahini dressing."],
          tags: ["Vegan", "Healthy", "Bowl"],
          image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
          rating: 4.8,
          prepTime: 10,
          cookTime: 15,
          servings: 2,
          difficulty: "easy",
          calories: 320
        },
        {
          id: this.generateId(),
          title: "Classic Cheeseburger",
          description: "Juicy beef patty, cheddar cheese, lettuce, tomato, and pickles in a toasted bun.",
          ingredients: ["Beef patty", "Cheddar cheese", "Lettuce", "Tomato", "Pickles", "Burger bun", "Ketchup", "Mustard"],
          instructions: ["Grill patty.", "Toast bun.", "Assemble with toppings."],
          tags: ["Burger", "Beef", "American"],
          image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80",
          rating: 4.4,
          prepTime: 18,
          cookTime: 0,
          servings: 1,
          difficulty: "easy",
          calories: 550
        },
        {
          id: this.generateId(),
          title: "Thai Green Curry",
          description: "Aromatic Thai curry with coconut milk, green curry paste, chicken, and fresh veggies.",
          ingredients: ["Chicken", "Green curry paste", "Coconut milk", "Vegetables", "Fish sauce", "Basil"],
          instructions: ["Cook curry paste.", "Add chicken and veggies.", "Pour coconut milk.", "Simmer and serve with rice."],
          tags: ["Thai", "Curry", "Spicy"],
          image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
          rating: 4.6,
          prepTime: 40,
          cookTime: 0,
          servings: 3,
          difficulty: "medium",
          calories: 480
        }
      ]
      this.saveRecipes()
    }
  }

  // Modal Management
  openModal(recipe = null) {
    const modal = document.getElementById("recipeModal")
    const modalTitle = document.getElementById("modalTitle")
    const form = document.getElementById("recipeForm")

    if (recipe) {
      this.currentEditId = recipe.id
      modalTitle.textContent = "Edit Recipe"
      this.populateForm(recipe)
    } else {
      this.currentEditId = null
      modalTitle.textContent = "Create New Recipe"
      form.reset()
      this.ingredients = []
      this.instructions = []
      this.tags = []
      this.renderIngredients()
      this.renderInstructions()
      this.renderTags()
      document.getElementById("imagePreview").innerHTML = ""
    }

    modal.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  closeModal() {
    document.getElementById("recipeModal").classList.remove("active")
    document.body.style.overflow = "auto"
    this.currentEditId = null
    this.ingredients = []
    this.instructions = []
    this.tags = []
  }

  closeDetailModal() {
    document.getElementById("recipeDetailModal").classList.remove("active")
    document.body.style.overflow = "auto"
  }

  populateForm(recipe) {
    document.getElementById("recipeName").value = recipe.title // Updated to match sample data
    document.getElementById("category").value = recipe.category || ""
    document.getElementById("difficulty").value = recipe.difficulty || ""
    document.getElementById("description").value = recipe.description || ""
    document.getElementById("prepTime").value = recipe.prepTime || "" // Updated to match sample data
    document.getElementById("cookTime").value = recipe.cookTime || ""
    document.getElementById("servings").value = recipe.servings || ""
    document.getElementById("calories").value = recipe.calories || ""

    this.ingredients = recipe.ingredients || []
    this.instructions = recipe.instructions || []
    this.tags = recipe.tags || []

    this.renderIngredients()
    this.renderInstructions()
    this.renderTags()

    const imagePreview = document.getElementById("imagePreview")
    imagePreview.innerHTML = recipe.image
      ? `<img src="${recipe.image}" alt="Recipe Image">`
      : ""
  }

  // Form Handling
  handleFormSubmit(e) {
    e.preventDefault()

    const formData = {
      name: document.getElementById("recipeName").value.trim(),
      category: document.getElementById("category").value,
      difficulty: document.getElementById("difficulty").value,
      description: document.getElementById("description").value.trim(),
      prepTime: Number.parseInt(document.getElementById("prepTime").value) || 0,
      cookTime: Number.parseInt(document.getElementById("cookTime").value) || 0,
      servings: Number.parseInt(document.getElementById("servings").value) || 1,
      calories: Number.parseInt(document.getElementById("calories").value) || 0,
      ingredients: [...this.ingredients],
      instructions: [...this.instructions],
      tags: [...this.tags],
      image: document.querySelector("#imagePreview img")?.src || null,
      rating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Validation
    if (!formData.name) {
      this.showToast("Recipe name is required", "error")
      return
    }

    if (!formData.category) {
      this.showToast("Please select a category", "error")
      return
    }

    if (!formData.difficulty) {
      this.showToast("Please select difficulty level", "error")
      return
    }

    if (formData.ingredients.length === 0) {
      this.showToast("At least one ingredient is required", "error")
      return
    }

    if (formData.instructions.length === 0) {
      this.showToast("At least one instruction is required", "error")
      return
    }

    if (this.currentEditId) {
      const index = this.recipes.findIndex((r) => r.id === this.currentEditId)
      if (index !== -1) {
        formData.id = this.currentEditId
        formData.createdAt = this.recipes[index].createdAt
        formData.rating = this.recipes[index].rating
        this.recipes[index] = formData
      }
    } else {
      formData.id = this.generateId()
      this.recipes.unshift(formData)
    }

    this.saveRecipes()
    this.renderRecipes()
    this.updateStats()
    this.closeModal()
    this.showToast(this.currentEditId ? "Recipe updated successfully!" : "Recipe created successfully!", "success")
  }

  // Ingredient Management
  addIngredient() {
    const input = document.getElementById("ingredientInput")
    const ingredient = input.value.trim()

    if (ingredient && !this.ingredients.includes(ingredient)) {
      this.ingredients.push(ingredient)
      this.renderIngredients()
      input.value = ""
    }
  }

  removeIngredient(index) {
    this.ingredients.splice(index, 1)
    this.renderIngredients()
  }

  renderIngredients() {
    const list = document.getElementById("ingredientsList")
    list.innerHTML = this.ingredients
      .map(
        (ingredient, index) => `
      <div class="ingredient-item fade-in">
        <span><i class="fas fa-check"></i> ${ingredient}</span>
        <button type="button" class="remove-btn" onclick="recipeVault.removeIngredient(${index})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `,
      )
      .join("")
  }

  // Instruction Management
  addInstruction() {
    const input = document.getElementById("instructionInput")
    const instruction = input.value.trim()

    if (instruction) {
      this.instructions.push(instruction)
      this.renderInstructions()
      input.value = ""
    }
  }

  removeInstruction(index) {
    this.instructions.splice(index, 1)
    this.renderInstructions()
  }

  renderInstructions() {
    const list = document.getElementById("instructionsList")
    list.innerHTML = this.instructions
      .map(
        (instruction, index) => `
      <div class="instruction-item fade-in">
        <div class="instruction-number">${index + 1}</div>
        <div class="instruction-text">${instruction}</div>
        <button type="button" class="remove-btn" onclick="recipeVault.removeInstruction(${index})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `,
      )
      .join("")
  }

  // Tag Management
  addTag() {
    const input = document.getElementById("tagInput")
    const tag = input.value.trim().toLowerCase()

    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag)
      this.renderTags()
      input.value = ""
    }
  }

  removeTag(index) {
    this.tags.splice(index, 1)
    this.renderTags()
  }

  renderTags() {
    const list = document.getElementById("tagsList")
    list.innerHTML = this.tags
      .map(
        (tag, index) => `
      <div class="tag-item fade-in">
        <span><i class="fas fa-tag"></i> ${tag}</span>
        <button type="button" class="remove-btn" onclick="recipeVault.removeTag(${index})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `,
      )
      .join("")
  }

  // Image Handling
  handleImageUpload(e) {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.showToast("Image size should be less than 5MB", "error")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        document.getElementById("imagePreview").innerHTML = `<img src="${e.target.result}" alt="Recipe preview">`
      }
      reader.readAsDataURL(file)
    }
  }

  // Search and Filter
  handleSearch(query) {
    this.renderRecipes(this.getFilteredRecipes())
  }

  handleFilter() {
    this.renderRecipes(this.getFilteredRecipes())
  }

  getFilteredRecipes() {
    const searchQuery = document.getElementById("searchInput").value.toLowerCase()
    const categoryFilter = document.getElementById("categoryFilter").value
    const difficultyFilter = document.getElementById("difficultyFilter").value

    return this.recipes.filter((recipe) => {
      const matchesSearch =
        !searchQuery ||
        recipe.title.toLowerCase().includes(searchQuery) ||
        recipe.description?.toLowerCase().includes(searchQuery) ||
        recipe.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery)) ||
        recipe.tags.some((tag) => tag.toLowerCase().includes(searchQuery))

      const matchesCategory = !categoryFilter || recipe.category === categoryFilter
      const matchesDifficulty = !difficultyFilter || recipe.difficulty === difficultyFilter

      return matchesSearch && matchesCategory && matchesDifficulty
    })
  }

  // View Management
  handleViewChange(view) {
    this.currentView = view
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === view)
    })

    const grid = document.getElementById("recipesGrid")
    grid.className = view === "list" ? "recipes-list" : "recipes-grid"

    this.renderRecipes()
  }

  // Recipe Rendering
  renderRecipes(recipesToRender = this.recipes) {
    const grid = document.getElementById("recipesGrid")
    const noRecipes = document.getElementById("noRecipes")

    if (recipesToRender.length === 0) {
      grid.innerHTML = ""
      noRecipes.style.display = "block"
      return
    }

    noRecipes.style.display = "none"
    grid.innerHTML = recipesToRender.map((recipe) => this.createRecipeCard(recipe)).join("")
  }

  createRecipeCard(recipe) {
    const defaultImage = '<div class="recipe-image-placeholder"><i class="fas fa-utensils"></i></div>'
    const imageHtml = recipe.image
      ? `<img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">`
      : defaultImage

    const ratingHtml = this.createRatingStars(recipe.rating || 0)
    const prep = Number(recipe.prepTime) || 0
    const cook = Number(recipe.cookTime) || 0
    let totalTime = prep + cook
    let timeDisplay = '--'
    if (prep || cook) timeDisplay = `${totalTime} min`

    const tagsHtml = recipe.tags
      .slice(0, 3)
      .map((tag) => `<span class="recipe-tag">${tag}</span>`)
      .join("")

    return `
      <div class="recipe-card fade-in" onclick="recipeVault.viewRecipe('${recipe.id}')">
        <div class="recipe-image-container">
          ${imageHtml}
          <div class="recipe-overlay"></div>
        </div>
        <div class="recipe-content">
          <div class="recipe-header">
            <h3 class="recipe-title">${recipe.title}</h3>
            <div class="recipe-rating">${ratingHtml}</div>
          </div>
          
          ${recipe.description ? `<p class="recipe-description">${recipe.description}</p>` : ""}
          
          <div class="recipe-meta">
            <div class="recipe-meta-item">
              <i class="fas fa-clock"></i>
              <span>${timeDisplay}</span>
            </div>
            <div class="recipe-meta-item">
              <i class="fas fa-users"></i>
              <span>${recipe.servings} servings</span>
            </div>
            <div class="recipe-meta-item">
              <i class="fas fa-signal"></i>
              <span>${recipe.difficulty}</span>
            </div>
            <div class="recipe-meta-item">
              <i class="fas fa-fire"></i>
              <span>${recipe.calories} cal</span>
            </div>
          </div>
          
          ${tagsHtml ? `<div class="recipe-tags">${tagsHtml}</div>` : ""}
          
          <div class="recipe-actions" onclick="event.stopPropagation()">
            <button class="btn btn-secondary" onclick="recipeVault.editRecipe('${recipe.id}')">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-danger" onclick="recipeVault.deleteRecipe('${recipe.id}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    `
  }

  createRatingStars(rating) {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    let starsHtml = ""

    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fas fa-star"></i>'
    }

    if (hasHalfStar) {
      starsHtml += '<i class="fas fa-star-half-alt"></i>'
    }

    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<i class="far fa-star empty"></i>'
    }

    return `<div class="rating-stars">${starsHtml}</div>`
  }

  // Recipe Actions
  viewRecipe(id) {
    const recipe = this.recipes.find((r) => r.id === id)
    if (!recipe) return

    const modal = document.getElementById("recipeDetailModal")
    const title = document.getElementById("detailTitle")
    const content = document.getElementById("recipeDetailContent")
    const editBtn = document.getElementById("editRecipeBtn")

    title.textContent = recipe.title || recipe.name
    editBtn.onclick = () => {
      this.closeDetailModal()
      this.editRecipe(id)
    }

    const imageHtml = recipe.image ? `<img src="${recipe.image}" alt="${recipe.title || recipe.name}" class="detail-image">` : ""

    const ratingHtml = this.createRatingStars(recipe.rating || 0)
    const totalTime = (Number(recipe.prepTime) || 0) + (Number(recipe.cookTime) || 0)

    const metaCards = [
      { icon: "fas fa-clock", label: "Prep Time", value: `${recipe.prepTime || 0} min` },
      { icon: "fas fa-fire", label: "Cook Time", value: `${recipe.cookTime || 0} min` },
      { icon: "fas fa-users", label: "Servings", value: recipe.servings || 1 },
      { icon: "fas fa-signal", label: "Difficulty", value: recipe.difficulty || "Unknown" },
      { icon: "fas fa-burn", label: "Calories", value: `${recipe.calories || 0} cal` },
      { icon: "fas fa-star", label: "Rating", value: `${recipe.rating || 0}/5` },
    ]

    const metaHtml = metaCards
      .map(
        (meta) => `
      <div class="detail-meta-card">
        <i class="${meta.icon}"></i>
        <span class="value">${meta.value}</span>
        <span class="label">${meta.label}</span>
      </div>
    `,
      )
      .join("")

    const ingredientsHtml = recipe.ingredients
      .map(
        (ingredient) => `
      <div class="detail-ingredient">
        <i class="fas fa-check"></i>
        <span>${ingredient}</span>
      </div>
    `,
      )
      .join("")

    const instructionsHtml = recipe.instructions
      .map(
        (instruction, index) => `
      <div class="detail-instruction">
        <div class="detail-instruction-number">${index + 1}</div>
        <div class="detail-instruction-text">${instruction}</div>
      </div>
    `,
      )
      .join("")

    const tagsHtml = recipe.tags
      .map(
        (tag) => `
      <span class="detail-tag">${tag}</span>
    `,
      )
      .join("")

    content.innerHTML = `
      ${imageHtml}
      
      ${recipe.description ? `<div class="detail-description">${recipe.description}</div>` : ""}
      
      <div class="detail-meta-grid">${metaHtml}</div>
      
      <div class="detail-section">
        <h3><i class="fas fa-list"></i> Ingredients</h3>
        <div class="detail-ingredients">${ingredientsHtml}</div>
      </div>
      
      <div class="detail-section">
        <h3><i class="fas fa-clipboard-list"></i> Instructions</h3>
        <div class="detail-instructions">${instructionsHtml}</div>
      </div>
      
      ${
        recipe.tags.length > 0
          ? `
        <div class="detail-section">
          <h3><i class="fas fa-tags"></i> Tags</h3>
          <div class="detail-tags">${tagsHtml}</div>
        </div>
      `
          : ""
      }
    `

    modal.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  editRecipe(id) {
    const recipe = this.recipes.find((r) => r.id === id)
    if (recipe) {
      this.openModal(recipe)
    }
  }

  deleteRecipe(id) {
    const recipe = this.recipes.find((r) => r.id === id)
    if (!recipe) return

    if (confirm(`Are you sure you want to delete "${recipe.name}"?`)) {
      this.recipes = this.recipes.filter((r) => r.id !== id)
      this.saveRecipes()
      this.renderRecipes()
      this.updateStats()
      this.showToast("Recipe deleted successfully!", "success")
    }
  }

  // Statistics
  updateStats() {
    const totalRecipes = this.recipes.length
    const avgRating =
      totalRecipes === 0
        ? 0
        : (
            this.recipes.reduce((sum, r) => sum + (r.rating || 0), 0) /
            totalRecipes
          ).toFixed(1)
    const avgTime =
      totalRecipes === 0
        ? 0
        : Math.round(
            this.recipes.reduce((sum, r) => sum + ((r.prepTime || 0) + (r.cookTime || 0)), 0) /
              totalRecipes
          )
    const totalCalories = this.recipes.reduce((sum, r) => sum + (r.calories || 0), 0)
    document.getElementById("totalRecipes").textContent = totalRecipes
    document.getElementById("avgRating").textContent = avgRating
    document.getElementById("avgTime").textContent = avgTime
    document.getElementById("totalCalories").textContent = totalCalories
  }

  // Toast Notifications
  showToast(message, type = "success") {
    const container = document.getElementById("toastContainer")
    const toast = document.createElement("div")

    const icons = {
      success: "fas fa-check-circle",
      error: "fas fa-exclamation-circle",
      warning: "fas fa-exclamation-triangle",
    }

    toast.className = `toast ${type}`
    toast.innerHTML = `
      <i class="${icons[type]}"></i>
      <span>${message}</span>
    `

    container.appendChild(toast)

    setTimeout(() => {
      toast.style.animation = "toastSlideIn 0.3s ease-out reverse"
      setTimeout(() => {
        container.removeChild(toast)
      }, 300)
    }, 3000)
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  window.recipeVault = new RecipeVault()
})
