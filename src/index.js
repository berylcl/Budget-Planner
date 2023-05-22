'use strict'
import "./style.css"
import * as events from "events";
const form = document.querySelector(".add")
const incomeList = document.querySelector("ul.income-list")
const expenseList = document.querySelector("ul.expense-list")

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")) : [];
if (!Array.isArray(transactions)) {
    transactions = [];
}
function addTransaction() {
    const time = new Date();
    const source = form.source.value;
    const amount = parseFloat(form.amount.value); // Convert amount to a number

    const transaction = {
        id: Math.floor(Math.random() * 100000),
        source: source,
        amount: amount, // Assign the amount value
        time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`,
    };

    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    addTransactionDOM(transaction.id, source, amount, transaction.time);

    updateStatistics(); // Update statistics after adding a transaction
}

function updateStatistics() {
    const updatedIncome = transactions
        .filter(transaction => transaction.amount > 0)
        .reduce((total, transaction) => total + transaction.amount, 0);

    const updatedExpense = transactions
        .filter(transaction => transaction.amount < 0)
        .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);

    const updatedBalance = updatedIncome - updatedExpense;
    balance.textContent = `$${updatedBalance.toFixed(2)}`;
    income.textContent = `$${updatedIncome.toFixed(2)}`;
    expenses.textContent = `$${updatedExpense.toFixed(2)}`;
}

form.addEventListener('submit', (event)=>{
    event.preventDefault()
    addTransaction(form.source.value, form.amount.value)
})

function generateTemplate(id, source, amount, time){
    return `<li data-id="${id}">
                <p>
                    <span>${source}</span>
                    <span id="time">${time}</span>
                </p>
                $<span>${Math.abs(amount)}</span>
                <i class="bi bi-trash delete"></i>
            </li>`;
}

function addTransactionDOM(id, source, amount, time){
    if(amount > 0){
        incomeList.innerHTML += generateTemplate(id, source, amount, time);
    } else {
        expenseList.innerHTML += generateTemplate(id, source, amount, time);
    }
}
function getTransaction() {
    incomeList.innerHTML = "";
    expenseList.innerHTML = "";

    transactions.forEach(transaction => {
        if (transaction.value > 0) {
            incomeList.innerHTML += generateTemplate(
                transaction.id,
                transaction.source,
                transaction.value,
                transaction.time
            );
        } else {
            expenseList.innerHTML += generateTemplate(
                transaction.id,
                transaction.source,
                transaction.value,
                transaction.time
            );
        }
    });
}

function deleteTransaction(id) {
    transactions = transactions.filter(transaction => {
        return transaction.id !== id;
    });
    localStorage.setItem("transactions", JSON.stringify(transactions));

    // Clear the income and expense lists before regenerating them
    incomeList.innerHTML = "";
    expenseList.innerHTML = "";

    // Regenerate the transaction lists and update the balances
    getTransaction();
    updateStatistics();
}

incomeList.addEventListener("click", event => {
    if (event.target.classList.contains("delete")) {
        const listItem = event.target.closest("li");
        listItem.remove();
    }
});

expenseList.addEventListener("click", event => {
    if (event.target.classList.contains("delete")) {
        const listItem = event.target.closest("li");
        listItem.remove();
    }
});


function init(){
    updateStatistics();
    getTransaction();
}

init();