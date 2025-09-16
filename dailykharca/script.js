 
const todayStr = () => new Date().toISOString().split('T')[0];

// Generate storage key for a given date
function storageKey(date) {
  return "money_expenses_" + date;
}

// Get DOM elements
const form = document.getElementById("expense-form");
const nameInp = document.getElementById("expense-name");
const amtInp = document.getElementById("expense-amount");
const dateInp = document.getElementById("expense-date");
const expenseList = document.getElementById("expense-list");
const totalAmt = document.getElementById("total-amount");
const saveBtn = document.getElementById("save-button");
const downloadBtn = document.getElementById("download-button");
const whatsappShareBtn = document.getElementById("whatsapp-share-button");
const selectDate = document.getElementById("select-date");

let expenses = [];
let curDate = todayStr();

// Load last 90 days dates for dropdown
function loadDates() {
  const dates = [];
  for (let i = 0; i < 90; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  selectDate.innerHTML = "";
  dates.forEach((date) => {
    const opt = document.createElement("option");
    opt.value = date;
    opt.textContent = date;
    if (date === curDate) opt.selected = true;
    selectDate.appendChild(opt);
  });
}

// Load expenses of a specific date from localStorage
function loadExpenses(date) {
  const data = localStorage.getItem(storageKey(date));
  try {
    expenses = data ? JSON.parse(data) : [];
  } catch {
    expenses = [];
  }
}

// Save expenses for a date to localStorage
function saveExpenses(date) {
  localStorage.setItem(storageKey(date), JSON.stringify(expenses));
}

// Render expenses list and total amount
function renderExpenses() {
  expenseList.innerHTML = "";
  let total = 0;
  expenses.forEach((e, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.name}</td>
      <td>₹${e.amount}</td>
      <td>${e.date}</td>
      <td><button class="delete-btn" data-id="${i}" aria-label="Delete expense">X</button></td>
    `;
    expenseList.appendChild(tr);
    total += Number(e.amount);
  });
  totalAmt.textContent = total.toFixed(2);
}

// Refresh the UI after loading expenses
function refresh() {
  loadExpenses(curDate);
  renderExpenses();
}

// Form submit handler to add new expense
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const entry = {
    name: nameInp.value.trim(),
    amount: Number(amtInp.value),
    date: dateInp.value,
  };
  if (entry.name && entry.amount && entry.date) {
    expenses.push(entry);
    saveExpenses(curDate);
    renderExpenses();
    form.reset();
    dateInp.value = curDate;
  }
});

// Delete expense handler using event delegation
expenseList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = +e.target.dataset.id;
    expenses.splice(id, 1);
    saveExpenses(curDate);
    renderExpenses();
  }
});

// Save button click handler - force save to localStorage
saveBtn.addEventListener("click", () => {
  saveExpenses(curDate);
  alert("Saved locally!");
});

// Download button click handler - export current day's expenses as CSV
downloadBtn.addEventListener("click", () => {
  let csv =
    "Description,Amount,Date\n" +
    expenses
      .map(
        (e) =>
          `"${e.name.replace(/"/g, '""')}",${e.amount},"${e.date}"`
      )
      .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `expenses_${curDate}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// WhatsApp share button handler
whatsappShareBtn.addEventListener("click", () => {
  if (!expenses || expenses.length === 0) {
    alert("No expenses to share.");
    return;
  }
  const txt = expenses
    .map((e) => `${e.date}: ${e.name} - ₹${e.amount}`)
    .join("\n");
  const whatsappUrl = "https://api.whatsapp.com/send?text=" + encodeURIComponent(txt);
  const newWindow = window.open(whatsappUrl, "_blank");
  if (!newWindow || newWindow.closed || typeof newWindow.closed == "undefined") {
    alert("Popup blocked! Please allow popups to share via WhatsApp.");
  }
});

// Change date selection handler
selectDate.addEventListener("change", (e) => {
  curDate = e.target.value;
  dateInp.value = curDate;
  refresh();
});

 const navbarMenuBtn = document.getElementById('navbar-menu-button');
const navbarMenuDropdown = document.getElementById('navbar-menu-dropdown');

navbarMenuBtn.addEventListener('click', () => {
  // Toggle "visible" class on the dropdown menu
  navbarMenuDropdown.classList.toggle('visible');
  
  // Toggle aria-expanded for accessibility
  let expanded = navbarMenuBtn.getAttribute('aria-expanded') === 'true';
  navbarMenuBtn.setAttribute('aria-expanded', String(!expanded));
});

 