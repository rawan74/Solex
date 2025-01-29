class EmployeeManager {
  constructor() {
    this.employees = [];
    this.initialize().catch((error) => {
      console.error("Initialization error:", error);
      this.showError("Failed to load employee data");
    });
  }

  async initialize() {
    try {
      await this.loadEmployees();
      this.renderTable();
      this.setupEventListeners();
    } catch (error) {
      this.showError("Failed to initialize application");
      throw error;
    }
  }

  async loadEmployees() {
    try {
      const response = await fetch("employees.json");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      this.employees = await response.json();
    } catch (error) {
      console.error("Error loading employees:", error);
      this.showError(
        "Failed to load employee data. Please try refreshing the page."
      );
      throw error;
    }
  }

  renderTable() {
    const tbody = document.getElementById("employeeTable");
    tbody.innerHTML = "";
    this.employees.forEach((emp) => {
      tbody.appendChild(this.createEmployeeRow(emp));
    });
  }

  createEmployeeRow(emp, isNew = false) {
    const row = document.createElement("tr");
    row.className = `hover:bg-gray-50 ${isNew ? "bg-blue-50" : ""}`;
    row.dataset.empNumber = emp.empNumber;

    row.innerHTML = `
          <td class="px-6 py-4">${isNew ? "" : emp.empNumber}</td>
          <td class="px-6 py-4">${isNew ? "" : emp.name}</td>
          <td class="px-6 py-4">${
            isNew ? "" : `${emp.currency}${emp.salary.toLocaleString()}`
          }</td>
          <td class="px-6 py-4">${
            isNew ? "" : emp.gender === "male" ? "♂" : "♀"
          }</td>
          <td class="px-6 py-4">
              ${
                isNew
                  ? ""
                  : `<input type="checkbox" ${
                      emp.smoker ? "checked" : ""
                    } disabled
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded">`
              }
          </td>
          <td class="px-6 py-4 capitalize">${
            isNew ? "" : emp.maritalStatus
          }</td>
          <td class="px-6 py-4 text-yellow-400">
              ${
                isNew ? "" : "★".repeat(emp.rating) + "☆".repeat(5 - emp.rating)
              }
          </td>
          <td class="px-6 py-4">
              ${
                isNew
                  ? `<button class="save-new-btn text-teal-800 hover:text-teal-900">
                      Save
                  </button>`
                  : `<button class="edit-btn text-teal-800 hover:text-teal-900">
                      Edit
                  </button>`
              }
          </td>
      `;

    if (isNew) {
      row.querySelector(".save-new-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        this.saveNewEmployee(row);
      });
      this.toggleEditMode(row, true);
    } else {
      row.querySelector(".edit-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleEditMode(row);
      });
    }

    return row;
  }

  toggleEditMode(row, isNew = false) {
    const emp = this.employees.find(
      (e) => e.empNumber === row.dataset.empNumber
    );
    if (!emp && !isNew) return;

    row.innerHTML = `
          <td class="px-6 py-4">
              <input type="text" value="${emp?.empNumber || ""}" 
                  class="border rounded p-1 w-full emp-number-input"
                  placeholder="Employee Number">
          </td>
          <td class="px-6 py-4">
              <input type="text" value="${emp?.name || ""}" 
                  class="border rounded p-1 w-full name-input"
                  placeholder="Employee Name">
          </td>
          <td class="px-6 py-4">
              <input type="number" value="${emp?.salary || 0}" 
                  class="border rounded p-1 w-24 salary-input">
              <select class="currency-select ml-2">
                  ${["$", "€", "£"]
                    .map(
                      (c) => `
                      <option ${
                        c === emp?.currency ? "selected" : ""
                      }>${c}</option>
                  `
                    )
                    .join("")}
              </select>
          </td>
          <td class="px-6 py-4">
              <select class="w-full gender-select">
                  <option value="male" ${
                    emp?.gender === "male" ? "selected" : ""
                  }>♂ Male</option>
                  <option value="female" ${
                    emp?.gender === "female" ? "selected" : ""
                  }>♀ Female</option>
              </select>
          </td>
          <td class="px-6 py-4">
              <input type="checkbox" ${emp?.smoker ? "checked" : ""} 
                  class="h-4 w-4 smoker-input">
          </td>
          <td class="px-6 py-4">
              <select class="w-full marital-status-select">
                  ${["single", "married", "divorced"]
                    .map(
                      (s) => `
                      <option ${
                        s === emp?.maritalStatus ? "selected" : ""
                      }>${s}</option>
                  `
                    )
                    .join("")}
              </select>
          </td>
          <td class="px-6 py-4">
              <div class="rating-stars">
                  ${Array.from(
                    { length: 5 },
                    (_, i) => `
                      <button class="star ${
                        i < (emp?.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }" 
                              data-rating="${i + 1}">★
                      </button>
                  `
                  ).join("")}
              </div>
          </td>
          <td class="px-6 py-4">
              <button class="save-btn text-teal-800 hover:text-teal-900">
                  Save
              </button>
          </td>
      `;

    const saveBtn = row.querySelector(".save-btn");
    saveBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      isNew ? this.saveNewEmployee(row) : this.saveEmployee(row);
    });

    row.querySelectorAll(".star").forEach((star) => {
      star.addEventListener("click", (e) => {
        e.stopPropagation();
        this.updateRating(row, parseInt(e.target.dataset.rating));
      });
    });
  }

  updateRating(row, newRating) {
    row.querySelectorAll(".star").forEach((star, index) => {
      star.classList.toggle("text-yellow-400", index < newRating);
      star.classList.toggle("text-gray-300", index >= newRating);
    });
  }

  saveEmployee(row) {
    const emp = this.employees.find(
      (e) => e.empNumber === row.dataset.empNumber
    );
    if (!emp) return;

    const newEmpNumber = row.querySelector(".emp-number-input").value.trim();
    const newName = row.querySelector(".name-input").value.trim();

    if (!newEmpNumber || !newName) {
      this.showError("Employee Number and Name are required");
      return;
    }

    emp.empNumber = newEmpNumber;
    emp.name = newName;
    emp.salary = Number(row.querySelector(".salary-input").value);
    emp.currency = row.querySelector(".currency-select").value;
    emp.gender = row.querySelector(".gender-select").value;
    emp.smoker = row.querySelector(".smoker-input").checked;
    emp.maritalStatus = row.querySelector(".marital-status-select").value;
    emp.rating = Array.from(row.querySelectorAll(".star")).filter((star) =>
      star.classList.contains("text-yellow-400")
    ).length;

    this.renderTable();
  }

  addNewEmployee() {
    const newEmployee = {
      empNumber: `TEMP-${Date.now()}`,
      name: "",
      salary: 0,
      currency: "$",
      gender: "male",
      smoker: false,
      maritalStatus: "single",
      rating: 0,
    };

    this.employees.push(newEmployee);
    const newRow = this.createEmployeeRow(newEmployee, true);
    document.getElementById("employeeTable").appendChild(newRow);
  }

  saveNewEmployee(row) {
    const empNumber = row.querySelector(".emp-number-input").value.trim();
    const name = row.querySelector(".name-input").value.trim();

    if (!empNumber || !name) {
      this.showError("Employee Number and Name are required");
      return;
    }

    const newEmployee = {
      empNumber,
      name,
      salary: Number(row.querySelector(".salary-input").value),
      currency: row.querySelector(".currency-select").value,
      gender: row.querySelector(".gender-select").value,
      smoker: row.querySelector(".smoker-input").checked,
      maritalStatus: row.querySelector(".marital-status-select").value,
      rating: Array.from(row.querySelectorAll(".star")).filter((star) =>
        star.classList.contains("text-yellow-400")
      ).length,
    };

    // Replace temporary employee
    const index = this.employees.findIndex(
      (e) => e.empNumber === row.dataset.empNumber
    );
    this.employees[index] = newEmployee;
    this.renderTable();
  }

  showDetailModal(empNumber) {
    const emp = this.employees.find((e) => e.empNumber === empNumber);
    if (!emp) return;

    document.getElementById("detailEmpNumber").textContent = emp.empNumber;
    document.getElementById("detailEmpName").textContent = emp.name;
    document.getElementById("detailSalary").textContent =
      emp.salary.toLocaleString();
    document.getElementById("detailCurrency").textContent = emp.currency;
    document.getElementById("detailModal").classList.remove("hidden");
  }

  closeDetailModal() {
    document.getElementById("detailModal").classList.add("hidden");
  }

  setupEventListeners() {
    document.getElementById("employeeTable").addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      const isEditableElement = e.target.closest(
        "input, select, button, .star"
      );

      // Only show modal if:
      // 1. We have a valid row
      // 2. Not clicking editable elements
      // 3. Not in edit mode
      if (row && !isEditableElement && !row.classList.contains("editing")) {
        this.showDetailModal(row.dataset.empNumber);
      }
    });

    // Keep existing modal close handler
    document.getElementById("detailModal").addEventListener("click", (e) => {
      if (e.target === document.getElementById("detailModal")) {
        this.closeDetailModal();
      }
    });
  }

  showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className =
      "fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded";
    errorDiv.innerHTML = `
          <strong>Error:</strong> ${message}
          <button onclick="this.parentElement.remove()" class="ml-2 text-red-900 hover:text-red-600">×</button>
      `;
    document.body.appendChild(errorDiv);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.employeeManager = new EmployeeManager();
  window.closeDetailModal = () => employeeManager.closeDetailModal();
});
