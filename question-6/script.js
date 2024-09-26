// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAY7AS59z1H_AX9VlS3DKVaVmuBZx1w_mk",
    authDomain: "user-authentication-6c23e.firebaseapp.com",
    databaseURL: "https://user-authentication-6c23e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "user-authentication-6c23e",
    storageBucket: "user-authentication-6c23e.appspot.com",
    messagingSenderId: "57587748070",
    appId: "1:57587748070:web:f785c9fa9afe8596e27f27",
    measurementId: "G-CVVBVCDQSL"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  
  // Function to handle login form submission
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    // Fetch user data from Firebase Realtime Database
    db.ref("users").once("value", function (snapshot) {
      let authenticated = false;
      snapshot.forEach(function (childSnapshot) {
        const user = childSnapshot.val();
        if (user.username === username && user.password === password) {
          authenticated = true;
        }
      });
  
      // Display message based on authentication status
      const message = document.getElementById("message");
      if (authenticated) {
        message.textContent = "Login successful";
        message.style.color = "green";
        // Redirect to the dashboard or another page (example: dashboard.html)
        // window.location.href = "dashboard.html";
      } else {
        message.textContent = "Invalid credentials, please try again";
        message.style.color = "red";
      }
    });
  });
  