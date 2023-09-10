const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username cannot be blank"]
    },
    email: {
        type: String,
        required: [true, "Email cannot be blank"]
    },
    phone: {
        type: Number,
        required: [true, "Phone number cannot be blank"]
    },
    password: {
        type: String,
        required: [true, "Password cannot be blank"]
    },
    appointments: [String]
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

userSchema.statics.findAndValidate = async function (email, password) {
    const foundUser = await this.findOne({ email });
    if (!foundUser) {
        return false;
    }
    const isValid = bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
}

const User = new mongoose.model("User", userSchema);

module.exports = User;