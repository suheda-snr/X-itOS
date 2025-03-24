import { db } from './firebaseConfig'; // ✅ Correct import
import { collection, getDocs } from 'firebase/firestore';

// Function to test Firestore connection
export const testFirestoreConnection = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'sensors')); // Get all documents from 'sensors' collection
    if (querySnapshot.empty) {
      console.log("No data available in 'sensors' collection.");
      alert("Firestore is connected! But no data in 'sensors' collection.");
    } else {
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} =>`, doc.data()); // Log data from Firestore
      });
      alert("Firestore is connected! Check the console for data.");
    }
  } catch (error) {
    console.error("Error connecting to Firestore:", error);
    alert("Firestore connection failed! Check console.");
  }
};
