import "./api/auth.js";

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const mobileMenuButton = document.getElementById("mobile-menu-button")
  const mobileMenu = document.getElementById("mobile-menu")

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden")
    })
  }

  // User dropdown menu toggle
  const userMenuButton = document.getElementById("user-menu-button")
  const userMenu = document.getElementById("user-menu")

  if (userMenuButton && userMenu) {
    userMenuButton.addEventListener("click", () => {
      userMenu.classList.toggle("hidden")
    })

    // Close the menu when clicking outside
    document.addEventListener("click", (event) => {
      if (!userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
        userMenu.classList.add("hidden")
      }
    })
  }

  // Mobile sidebar toggle for admin/provider dashboards
  const mobileSidebarToggle = document.getElementById("mobile-sidebar-toggle")
  const mobileSidebar = document.getElementById("mobile-sidebar")
  const closeSidebar = document.getElementById("close-sidebar")

  if (mobileSidebarToggle && mobileSidebar) {
    mobileSidebarToggle.addEventListener("click", () => {
      mobileSidebar.classList.remove("-translate-x-full")
    })

    if (closeSidebar) {
      closeSidebar.addEventListener("click", () => {
        mobileSidebar.classList.add("-translate-x-full")
      })
    }
  }

  // Tool search functionality
  const searchInput = document.getElementById("tool-search")
  const toolCards = document.querySelectorAll(".tool-card")

  if (searchInput && toolCards.length > 0) {
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase()

      toolCards.forEach((card) => {
        const toolName = card.querySelector(".tool-name").textContent.toLowerCase()
        const toolDescription = card.querySelector(".tool-description").textContent.toLowerCase()

        if (toolName.includes(searchTerm) || toolDescription.includes(searchTerm)) {
          card.style.display = "block"
        } else {
          card.style.display = "none"
        }
      })
    })
  }

  // Category filter functionality
  const categoryFilters = document.querySelectorAll(".category-filter")

  if (categoryFilters.length > 0 && toolCards.length > 0) {
    categoryFilters.forEach((filter) => {
      filter.addEventListener("click", function () {
        const category = this.dataset.category

        // Update active filter
        categoryFilters.forEach((f) => f.classList.remove("bg-orange-500", "text-white"))
        this.classList.add("bg-orange-500", "text-white")

        if (category === "all") {
          toolCards.forEach((card) => {
            card.style.display = "block"
          })
        } else {
          toolCards.forEach((card) => {
            if (card.dataset.category === category) {
              card.style.display = "block"
            } else {
              card.style.display = "none"
            }
          })
        }
      })
    })
  }

  // Date range picker for reservations
  const startDateInput = document.getElementById("start-date")
  const endDateInput = document.getElementById("end-date")
  const totalDaysElement = document.getElementById("total-days")
  const pricePerDayElement = document.getElementById("price-per-day")
  const totalPriceElement = document.getElementById("total-price")

  if (startDateInput && endDateInput && totalDaysElement && pricePerDayElement && totalPriceElement) {
    const updateTotalPrice = () => {
      const startDate = new Date(startDateInput.value)
      const endDate = new Date(endDateInput.value)

      if (startDate && endDate && startDate < endDate) {
        const diffTime = Math.abs(endDate - startDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        const pricePerDay = Number.parseFloat(pricePerDayElement.dataset.price)
        const totalPrice = diffDays * pricePerDay

        totalDaysElement.textContent = diffDays
        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`
      } else {
        totalDaysElement.textContent = "0"
        totalPriceElement.textContent = "$0.00"
      }
    }

    startDateInput.addEventListener("change", updateTotalPrice)
    endDateInput.addEventListener("change", updateTotalPrice)

    // Set minimum dates
    const today = new Date().toISOString().split("T")[0]
    startDateInput.setAttribute("min", today)

    startDateInput.addEventListener("change", () => {
      // Ensure end date is after start date
      if (startDateInput.value) {
        const nextDay = new Date(startDateInput.value)
        nextDay.setDate(nextDay.getDate() + 1)
        endDateInput.setAttribute("min", nextDay.toISOString().split("T")[0])
      }
    })
  }

  // Initialize any charts for admin dashboard
  const initCharts = () => {
    // This would normally use a charting library like Chart.js
    console.log("Charts would be initialized here")
  }

  // Check if we're on the admin dashboard
  if (document.querySelector(".admin-dashboard")) {
    initCharts()
  }
})
