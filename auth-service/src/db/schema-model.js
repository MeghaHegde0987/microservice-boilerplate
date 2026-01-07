const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const tenantSchema = new mongoose.Schema({
  name: String,
  domain: String
});

const User = mongoose.model('User', userSchema);
const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = {User,Tenant};