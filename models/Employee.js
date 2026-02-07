const mongoose = require('mongoose');

// const addressSchema = new mongoose.Schema({
//   _id: false, // Prevents creation of a separate _id field for the address subdocument
//   street: {
//     type: String,
//     trim: true,
//     lowercase: true
//   },
//   city: {
//     type: String,
//     trim: true,
//     lowercase: true
//   },
//   state: {
//     type: String,
//     trim: true,
//     lowercase: true
//   },
//   postalCode: {
//     type: String,
//     trim: true
//   },
//   country: {
//     type: String,
//     trim: true,
//     lowercase: true
//   }
// }); 

const EmployeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [ true, "First Name is required"],
    minlength: [3, "First Name should be at least 3 characters"],
    maxlength: [100, "First Name should be at most 100 characters"],
    trim: true,
    lowercase: true
  },
  lastname: {
    type: String,
    required: [ true, "Last Name is required"],
    minlength: [3, "Last Name should be at least 3 characters"],
    maxlength: [100, "Last Name should be at most 100 characters"],
    trim: true,
    lowercase: true
  },
  // address: addressSchema,
  email: {
    type: String,
    unique: true,
    required: [ true, "Email is required"],
    trim: true,
    lowercase: true
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: [ true, "Gender is required"],
  },
  city:{
    type: String,
    trim: true,
    lowercase: true
  },
  designation: {
    type: String,
    trim: true,
    lowercase: true
  },
  salary: {
    type: Number,
    min: [1000, "Salary should be at least 1000"],
    max: [100000, "Salary should be at most 100000"],
    validate: {
      validator: function(v) {
        return Number.isInteger(v);
      },
      message: "Salary should be an integer value"
    }
  },
  created: { 
    type: Date,
    default: Date.now
  },
  updatedat: { 
    type: Date,
    default: Date.now
  },
});


//Declare Virtual Fields
EmployeeSchema.virtual("fullname")
  .get(function () {
    return this.firstname + " " + this.lastname;
  })
  .set(function (v) {
    const parts = v.split(" ");
    this.firstname = parts[0] || "";
    this.lastname = parts[1] || "";
  });

//Custom Schema Methods
//1. Instance Method Declaration
EmployeeSchema.methods.getFullname = function () {
  return this.firstname + " " + this.lastname;
};

EmployeeSchema.methods.getCurrentYear = function () {
  return new Date().getFullYear();
};

EmployeeSchema.methods.isHighEarner = function (threshold = 100000) {
  return this.salary > threshold;
};

EmployeeSchema.methods.applyRaise = function (percentage) {
  const raiseAmount = (this.salary * percentage) / 100;
  this.salary += raiseAmount;
  return this.salary;
}

//2. Static method declararion
EmployeeSchema.statics.findByFirstName = function (firstname) {
  return this.find({ firstname: firstname });
}

EmployeeSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email });
};

EmployeeSchema.statics.findByDesignation = function (designation) {
  return this.find({ designation: new RegExp(designation, "i") });
};

EmployeeSchema.statics.findBySalaryRange = function (min, max) {
  return this.find({ salary: { $gte: min, $lte: max } });
};

EmployeeSchema.statics.sortBySalary = function (order = "asc") {
  const sortOrder = order === "asc" ? 1 : -1;
  return this.find().sort({ salary: sortOrder });
};

//Writing Query Helpers
EmployeeSchema.query.byCity = function (city) {
  return this.where({ city: new RegExp(city, "i") });
};

EmployeeSchema.query.byDesignation = function (designation) {
  return this.where({ designation: new RegExp(designation, "i") });
};

EmployeeSchema.query.bySalaryRange = function (min, max) {
  return this.where({ salary: { $gte: min, $lte: max } });
};

// Using Middleware or Hooks
EmployeeSchema.pre('save', () => {
  console.log("Before Save")
  let now = Date.now()
   
  this.updatedat = now
  // Set a value for createdAt only if it is null
  if (!this.created) {
    this.created = now
  }
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
