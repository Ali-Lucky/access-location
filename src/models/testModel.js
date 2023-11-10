const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
});

UserSchema.virtual('domain').get(function () {
    const emailParts = this.email.split('@');
    if (emailParts.length === 2) {
        const [, domain] = emailParts;
        return domain;
    }
    return null;
});

const UserModel = mongoose.model('User', UserSchema);

// Usage example
const user = new UserModel({ email: 'lucky@gmail.com' });
console.log(user.domain); // Output: google.co.in
