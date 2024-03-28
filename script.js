document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const saveProfileBtn = document.getElementById('save-profile');
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalExpense = document.getElementById('total-expense');
    const expenseHistory = document.getElementById('expense-history');
    let total = 0;
    let expenses = [];

    // Load user profile from localStorage
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        usernameInput.value = savedUsername;
    }

    // Load expenses from localStorage
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
        updateExpenseList();
    }

    // Save user profile
    saveProfileBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const username = usernameInput.value.trim();
        if (username !== '') {
            localStorage.setItem('username', username);
        }
    });

    // Save expense
    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const expenseName = document.getElementById('expense-input').value.trim();
        const expenseAmount = parseFloat(document.getElementById('amount-input').value);
        const expenseCategory = document.getElementById('category-select').value;

        if (expenseName && !isNaN(expenseAmount) && expenseCategory) {
            const date = new Date().toLocaleDateString();
            const expense = { name: expenseName, amount: expenseAmount, category: expenseCategory, date: date };
            expenses.push(expense);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            updateExpenseList();
            updateTotalExpense();
            expenseForm.reset();
        } else {
            alert('Please enter valid expense, amount, and category');
        }
    });

    // Update expense list
    function updateExpenseList() {
        expenseList.innerHTML = '';
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${expense.name}</span>
                <span>$${expense.amount.toFixed(2)}</span>
                <span>${expense.category}</span>
                <span>${expense.date}</span>
                <button class="delete-btn">Delete</button>
            `;
            expenseList.appendChild(li);
            li.querySelector('.delete-btn').addEventListener('click', function() {
                const index = expenses.indexOf(expense);
                if (index !== -1) {
                    expenses.splice(index, 1);
                    localStorage.setItem('expenses', JSON.stringify(expenses));
                    updateExpenseList();
                    updateTotalExpense();
                }
            });
        });
    }

    // Update total expense
    function updateTotalExpense() {
        total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        totalExpense.textContent = `Total Expense: $${total.toFixed(2)}`;
    }
});
