"use strict";
let id = 1;
let employee_list = [];

document.body.onload = function() {
    toggleShowFilters();
    createEmployee("John", 2000);
};

function createEmployee(name, salary) {
    let letters = /^[A-Za-z]+$/;
    let message = document.getElementById("error");
    message.innerHTML = "";
    try {
        if(!name.match(letters)) throw "Name should contain only letters";
    }
    catch(err) {
        message.innerHTML = err;
    }
    if (message.innerHTML === "") {
        let radio_list = document.querySelectorAll(".salary_period");
        let employee;
        radio_list.forEach(function(item) {
            if (item.checked === true && item.value === "per_month") {
                employee = new Fixed_rate(id, name, parseInt(salary));
            } else if (item.checked === true && item.value === "per_hour") {
                employee = new Hourly_rate(id, name, parseInt(salary));
            }
        });
        employee_list.push(employee);
        showEmployeesList();
        id++;
    }
}

function validateInput() {
    let letters = /^[A-Za-z]+$/;
    let message = document.getElementById("error");
    let name = document.getElementById("name_input").value;
    try {
        if(!name.match(letters)) throw "Name should contain only letters";
    }
    catch(err) {
        message.innerHTML = err;
    }
}

function showEmployeesList() {
    let filter;
    let showFilters = document.querySelectorAll(".show_filter");
    showFilters.forEach(function(item) {
        if (item.classList.contains("active")) {
            filter = item.id;
        }
    });

    let table = document.querySelector("table");
    table.querySelectorAll("tr:not(.header)").forEach(function (item) {
        table.removeChild(item);
    });
    let final_list = employee_list.sort(compare);
    if (filter === "first_5") {
        final_list = employee_list.filter(function(employee) {
            return employee.getEmployeeId() < 6;
        });
        final_list.sort(compare);
    } else if (filter === "last_3") {
        final_list = employee_list.filter(function(employee) {
            return employee.getEmployeeId() > employee_list.length - 3;
        });
        final_list.sort(compare);
    }
    final_list.forEach(function(item) {
        item.addToList();
    });
}

function compare(a, b) {
    let a_salary = a.getEmployeeSalary();
    let b_salary = b.getEmployeeSalary();
    let a_name = a.getEmployeeName();
    let b_name = b.getEmployeeName();

    if ( a_salary > b_salary ){
        return -1;
    }
    if ( a_salary < b_salary ){
        return 1;
    }
    if (a_name < b_name) {
        return -1;
    }
    if (a_name > b_name) {
        return 1;
    }
    return 0;
}

function toggleShowFilters() {
    let showFilters = document.querySelectorAll(".show_filter");
    showFilters.forEach(function(item) {
        item.addEventListener('click', function () {
            item.classList.add("active");
            showFilters.forEach(function(value) {
                if (value !== item) {
                    value.classList.remove("active");
                }
            });
            showEmployeesList();
        });
    });
}

class Action {
    constructor(id, name, salary) {
        let employeeId = id;
        let employeeName = name;
        let employeeSalary = salary;

        this.getEmployeeId = function() {
            return employeeId;
        };

        this.getEmployeeName = function() {
            return employeeName;
        };

        this.getEmployeeSalary = function() {
            return employeeSalary;
        };
    }

    addToList() {
        let table = document.querySelector("table");
        let line = document.createElement("tr");
        let id_cell = document.createElement("td");
        id_cell.innerHTML = this.getEmployeeId();

        let name_cell = document.createElement("td");
        name_cell.innerHTML = this.getEmployeeName();

        let salary_cell = document.createElement("td");
        salary_cell.innerHTML = this.getEmployeeSalary();

        line.appendChild(id_cell);
        line.appendChild(name_cell);
        line.appendChild(salary_cell);
        table.appendChild(line);
    }
}

class Hourly_rate extends Action {
    constructor(id, name, salary) {
        let employeeSalary = Math.round(20.8 * 8 * salary);
        super(id, name, employeeSalary);
    }
}

class Fixed_rate extends Action {
    constructor(id, name, salary) {
        super(id, name, salary);
    }
}
