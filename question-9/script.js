/// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAjBBuFlZCuwfAUAR_VPzBeWwPCjN1qMc8",
    authDomain: "real-time-auth.firebaseapp.com",
    databaseURL: "https://real-time-auth-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "real-time-auth",
    storageBucket: "real-time-auth.appspot.com",
    messagingSenderId: "759011631997",
    appId: "1:759011631997:web:2229277620d229bdaa6214",
    measurementId: "G-Z9F6CP1BX5"
  };
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.database();
  
  // HTML Elements
  const authSection = document.getElementById('authSection');
  const auctionSection = document.getElementById('auctionSection');
  const bidSection = document.getElementById('bidSection');
  const auctionList = document.getElementById('auctionList');
  const auctionDetails = document.getElementById('auctionDetails');
  const loginForm = document.getElementById('loginForm');
  const createAuctionBtn = document.getElementById('createAuctionBtn');
  const placeBidBtn = document.getElementById('placeBidBtn');
  const goBackBtn = document.getElementById('goBack');
  
  // User Authentication
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        authSection.style.display = 'none';
        auctionSection.style.display = 'block';
        loadAuctions();
      })
      .catch((error) => alert(error.message));
  });
  
  // Create New Auction
  createAuctionBtn.addEventListener('click', () => {
    const itemName = document.getElementById('itemName').value;
    const itemDescription = document.getElementById('itemDescription').value;
    const startingPrice = parseFloat(document.getElementById('startingPrice').value);
  
    const newAuctionRef = db.ref('auctions').push();
    newAuctionRef.set({
      itemName,
      itemDescription,
      startingPrice,
      currentPrice: startingPrice,
      bids: [],
      createdBy: auth.currentUser.uid,
      createdByEmail: auth.currentUser.email,
      auctionId: newAuctionRef.key
    }).then(() => alert('Auction Created!'));
  });
  
  // Load Auctions
  function loadAuctions() {
    db.ref('auctions').on('value', (snapshot) => {
      auctionList.innerHTML = '';
      snapshot.forEach((auction) => {
        const auctionData = auction.val();
        const auctionDiv = document.createElement('div');
        auctionDiv.classList.add('auction');
        auctionDiv.innerHTML = `
          <h3>${auctionData.itemName}</h3>
          <p>${auctionData.itemDescription}</p>
          <p>Current Price: $${auctionData.currentPrice}</p>
          <button onclick="viewAuction('${auctionData.auctionId}')">View</button>
        `;
        auctionList.appendChild(auctionDiv);
      });
    });
  }
  
  // View Auction Details
  function viewAuction(auctionId) {
    auctionSection.style.display = 'none';
    bidSection.style.display = 'block';
  
    db.ref(`auctions/${auctionId}`).once('value').then((snapshot) => {
      const auction = snapshot.val();
      auctionDetails.innerHTML = `
        <h3>${auction.itemName}</h3>
        <p>${auction.itemDescription}</p>
        <p>Current Price: $${auction.currentPrice}</p>
      `;
  
      placeBidBtn.onclick = () => placeBid(auctionId, auction.currentPrice);
    });
  }
  
  // Place a Bid
  function placeBid(auctionId, currentPrice) {
    const bidAmount = parseFloat(document.getElementById('bidAmount').value);
  
    if (bidAmount > currentPrice) {
      db.ref(`auctions/${auctionId}`).update({
        currentPrice: bidAmount
      }).then(() => alert('Bid Placed Successfully!'));
    } else {
      alert('Bid amount must be greater than current price.');
    }
  }
  
  // Go Back to Auctions List
  goBackBtn.addEventListener('click', () => {
    bidSection.style.display = 'none';
    auctionSection.style.display = 'block';
  });
  