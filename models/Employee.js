const mongoose = require("mongoose");

// employeeSchema for Employee Data
const employeeSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
    date_of_joining: { type: Date, required: true },
    department: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Create the Employee model
const Employee = mongoose.model("Employee", employeeSchema);

// Exporte the Employee model
module.exports = Employee;