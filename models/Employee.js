const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "First Name is required"], 
    minlength: [5, "First Name must be at least 5 characters long"],
    lowercase: true,
    trim: true
  },
  lastname: {
    type: String,
    required: [true, "Last Name is required"], 
    minlength: [5, "Last Name must be at least 5 characters long"],
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"], 
    lowercase: true,
    trim: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"]
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  city:{
    type: String,
    required: [true, "City is required"], 
    lowercase: true,
    trim: true
  },
  designation: {
    type: String,
    required: [true, "Designation is required"],
    lowercase: true,
    trim: true
  },
  salary: {
    type: Number,
    min: [1000, "Salary must be at least 1,000"],
    max: [1000000, "Salary must be at most 1,000,000"],
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  },
  created: { 
    type: Date
  },
  updatedat: { 
    type: Date
  },
  instance: {
    fullname () { 
      return this.firstname + " " + this.lastname;
    },
    currentYear () {
      return new Date().getFullYear();
    }
  }
});

//Declare Virtual Fields


//Custom Schema Methods
//1. Instance Method Declaration


//2. Static method declararion


//Writing Query Helpers



EmployeeSchema.pre('save', () => {
  console.log("Before Save")
  let now = Date.now()
   
  this.updatedat = now
  // Set a value for createdAt only if it is null
  if (!this.created) {
    this.created = now
  }
  
  // Call the next function in the pre-save chain
  // next()
});

EmployeeSchema.pre('findOneAndUpdate', () => {
  console.log("Before findOneAndUpdate")
  let now = Date.now()
  this.updatedat = now
  console.log(this.updatedat)
});


EmployeeSchema.post('init', (doc) => {
  console.log('%s has been initialized from the db', doc._id);
});

EmployeeSchema.post('validate', (doc) => {
  console.log('%s has been validated (but not saved yet)', doc._id);
});

EmployeeSchema.post('save', (doc) => {
  console.log('%s has been saved', doc._id);
});

EmployeeSchema.post('remove', (doc) => {
  console.log('%s has been removed', doc._id);
});

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;
