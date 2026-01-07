db = db.getSiblingDB('admin');

// Create Auth DB
db = db.getSiblingDB('authdb');
db.createCollection('users'); 

// Create User DB
db = db.getSiblingDB('userdb');
db.createCollection('profiles');

console.log("SUCCESS: authdb and userdb created.");
