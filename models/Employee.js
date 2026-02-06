const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "First Name is required"],
    minlength: [5, "First Name must be at least 5 characters long"],
    lowercase: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: [true, "Last Name is required"],
    minlength: [5, "Last Name must be at least 5 characters long"],
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  city: {
    type: String,
    required: [true, "City is required"],
    lowercase: true,
    trim: true,
  },
  designation: {
    type: String,
    required: [true, "Designation is required"],
    lowercase: true,
    trim: true,
  },
  salary: {
    type: Number,
    min: [1000, "Salary must be at least 1,000"],
    max: [1000000, "Salary must be at most 1,000,000"],
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updatedat: {
    type: Date,
    default: Date.now,
  },
});

// ---------- Document instance methods ----------
EmployeeSchema.methods.getFullname = function () {
  return this.firstname + " " + this.lastname;
};

EmployeeSchema.methods.getCurrentYear = function () {
  return new Date().getFullYear();
};

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
EmployeeSchema.methods.isHighEarner = function (threshold = 100000) {
  return this.salary > threshold;
};

EmployeeSchema.methods.applyRaise = function (percentage) {
  const raiseAmount = (this.salary * percentage) / 100;
  this.salary += raiseAmount;
  return this.salary;
}

//2. Static method declararion
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

// Writing Middleware Hooks
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
