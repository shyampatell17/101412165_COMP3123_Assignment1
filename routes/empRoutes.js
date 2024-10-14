const express = require("express");
const { body, param, query, validationResult } = require("express-validator");
const Employee = require("../models/Employee.js");
const router = express.Router();


// POST /api/v1/emp/employees - Creating Employees
router.post(
    "/employees",
    [
      // Validate and sanitize fields
      body("first_name")
        .notEmpty()
        .withMessage("First name is required")
        .trim()
        .escape(),

      body("last_name")
        .notEmpty()
        .withMessage("Last name is required")
        .trim()
        .escape(),

      body("email").isEmail().withMessage("Invalid email").normalizeEmail(),

      body("position")
        .notEmpty()
        .withMessage("Position is required")
        .trim()
        .escape(),

      body("salary").isNumeric().withMessage("Salary must be a number"),

      body("date_of_joining").isISO8601().withMessage("Invalid date format"),

      body("department")
        .notEmpty()
        .withMessage("Department is required")
        .trim()
        .escape(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {
        first_name,
        last_name,
        email,
        position,
        salary,
        date_of_joining,
        department,
      } = req.body;
  
      try {
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
          return res.status(400).json({
            message: "Email already exists!",
          });
        }
  
        const newEmployee = new Employee({
          first_name,
          last_name,
          email,
          position,
          salary,
          date_of_joining,
          department,
        });
  
        // Save the created employee to the database
        const savedEmployee = await newEmployee.save();
  
        // Respond with required infomation
        res.status(201).json({
          message: "Employee created successfully!",
          employee_id: savedEmployee._id,
        });
      } catch (error) {
        console.error("Error creating employee:", error);
        res.status(500).json({ message: "Server error!" });
      }
    }
  );


// GET /api/v1/emp/employees - Retriving All the Employee Infomation
router.get("/employees", async (req, res) => {
    try {
      const employees = await Employee.find();
      res.status(200).json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Server error!" });
    }
  });


// GET /api/v1/emp/employees/:id - Retriving single Employee Infomation using Employee ID
router.get(
    "/employees/:id",
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const employeeId = req.params.id;
  
      try {
        const employee = await Employee.findById(employeeId);
  
        if (!employee) {
          return res.status(404).json({ message: "Employee not found." });
        }
  
        res.status(200).json(employee);
      } catch (error) {
        console.error("Error retrieving employee:", error);
        res.status(500).json({ message: "Server error!" });
      }
    }
  );


// PUT /api/v1/emp/employees/:id
router.put('/employees/:eid', async (req, res) => {
    const {eid} = req.params;
    const updatedData = req.body;

    try{
        // Find the Employee and Update it using "findByIdAndUpdate"
        const EmployeeUpdated = await Employee.findByIdAndUpdate(eid, updatedData, {new: true}); 

        if(EmployeeUpdated){
            res.status(200).json({message: ' Employee Update Sucessfully'})
        } else{
            res.status(404).json({message: 'Employee Not Found'})
        }
    } catch(error){
        res.status(500).json({ message: 'Error updating employee', error });    }
});


// DELETE /api/v1/emp/employees/:id
router.delete('/employees/:eid', async (req, res) => {
    const {eid} = req.params;

    try{
        const deleteEmployee = await Employee.findByIdAndDelete(eid);
        if(deleteEmployee){
            // Return status 204 (No Content) if the deletion is successful
            res.status(204).json({ message: 'Employee deleted successfully' }); 
        }else{
            res.status(404).json({message: 'Employee Not Found'});
        }
    } catch(error){
        res.status(500).json({ message: 'Error deleting employee', error }); 
    }
})

module.exports = router;    