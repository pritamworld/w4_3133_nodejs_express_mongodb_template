# MongoDB + NodeJS + ExpressJs

## Signup here for free

- <https://www.mongodb.com/pricing/>

## Setup

- <https://docs.atlas.mongodb.com/getting-started/>
- <https://docs.mongodb.com/manual/installation/>

## Tutorials

- <https://www.digitalocean.com/community/tutorials/how-to-create-retrieve-update-and-delete-records-in-mongodb/>
- <https://www.freecodecamp.org/news/introduction-to-mongoose-for-mongodb-d2a7aa593c57/>
- https://masteringjs.io/mongoose
- http://tutorialtous.com/mongoose/mongooseapi.php
-https://masteringjs.io/tutorials/mongoose/find


## Sample Code to connect mongoDB using MongoClient

```const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://sa:<password>@cluster0.qa3t4.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
```

# Explanations

Mongoose schema and model for an `Employee` entity with various fields, validations, virtual fields, custom methods, static methods, query helpers, and middleware. Below is a breakdown of the key components and some suggestions for improvement:

### 1. **Schema Definition**
The schema defines the structure of the `Employee` document with fields like `firstname`, `lastname`, `email`, `gender`, `city`, `designation`, `salary`, `created`, and `updatedat`. Each field has specific properties such as type, required status, trimming, lowercase/uppercase conversion, and custom validations.

### 2. **Virtual Fields**
- **`fullname`**: A virtual field that concatenates `firstname` and `lastname`. The `set` function is defined but doesn't do anything useful. You might want to implement logic to split the full name into `firstname` and `lastname`.

### 3. **Custom Methods**
- **Instance Methods**:
  - `getFullName()`: Returns the full name of the employee.
  - `getFormatedSalary()`: Returns the salary formatted as a string with a dollar sign.
  
- **Static Methods**:
  - `getEmployeeByFirstName(value)`: Finds employees by their first name.

### 4. **Query Helpers**
- `byLastName(value)`: Filters employees by last name.
- `byFirstName(value, salary)`: Filters employees by first name and ensures their salary is greater than or equal to the specified value.

### 5. **Middleware**
- **Pre Middleware**:
  - `save`: Updates the `updatedat` field before saving the document. Sets `created` if it’s null.
  - `findOneAndUpdate`: Updates the `updatedat` field before updating the document.

- **Post Middleware**:
  - `init`: Logs when a document is initialized from the database.
  - `validate`: Logs when a document is validated.
  - `save`: Logs when a document is saved.
  - `remove`: Logs when a document is removed.

### 6. **Model Creation**
The `Employee` model is created using the schema and exported for use in other parts of the application.

### Suggestions for Improvement

1. **Error Handling in Custom Validators**:
   - The custom validator for `email` should throw an error with a meaningful message if the validation fails.
   ```javascript
   validate: function(value) {
     var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
     if (!emailRegex.test(value)) {
       throw new Error("Invalid email format");
     }
   }
   ```

2. **Pre Middleware Arrow Functions**:
   - Arrow functions should not be used for middleware because they do not bind `this` to the document. Use regular functions instead.
   ```javascript
   EmployeeSchema.pre('save', function(next) {
     console.log("Before Save");
     let now = Date.now();
     this.updatedat = now;
     if (!this.created) {
       this.created = now;
     }
     next();
   });

   EmployeeSchema.pre('findOneAndUpdate', function(next) {
     console.log("Before findOneAndUpdate");
     let now = Date.now();
     this._update.updatedat = now; // Use _update to set fields in findOneAndUpdate
     next();
   });
   ```

3. **Virtual Field Setter**:
   - Implement logic in the `set` function of the `fullname` virtual field to split the full name into `firstname` and `lastname`.
   ```javascript
   .set(function(value) {
     const parts = value.split(' ');
     this.firstname = parts[0];
     this.lastname = parts[1];
   });
   ```

4. **Logging**:
   - Consider using a logging library like `winston` or `bunyan` for more structured and configurable logging instead of `console.log`.

5. **Schema Validation Messages**:
   - Provide custom error messages for required fields and other validations to improve user feedback.
   ```javascript
   required: [true, "Last name is required"]
   ```

6. **Indexes**:
   - Consider adding indexes to frequently queried fields like `email`, `firstname`, and `lastname` to improve query performance.
   ```javascript
   email: { type: String, required: true, unique: true, index: true }
   ```
