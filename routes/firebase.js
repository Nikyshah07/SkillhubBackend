// const admin = require('firebase-admin');
// const serviceAccount = require('../firebase-service-account.json.json'); // Your Firebase service account file

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// module.exports = admin;


// const admin = require('firebase-admin');
// const path = require('path');
// let serviceAccount;

// try {
//   // Try to load service account from environment variables first (for production)
//   if (process.env.FIREBASE_SERVICE_ACCOUNT) {
//     serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
//   } else {
//     // Fall back to file for development
//     serviceAccount = require(path.join(__dirname, '../firebase-service-account.json'));
//   }

//   // Initialize Firebase Admin only once
//   if (!admin.apps.length) {
//     admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount)
//     });
//     console.log('Firebase Admin initialized successfully');
//   }
// } catch (error) {
//   console.error('Firebase initialization error:', error);
// }

// module.exports = admin;




const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin with environment variables instead of service account file
const firebaseConfig = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newlines
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig)
});

module.exports = admin;