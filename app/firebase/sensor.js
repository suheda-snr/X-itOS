import { db } from "./firebaseConfig"; // ✅ Import Firestore database
import { doc, getDoc, updateDoc, setDoc, arrayUnion, serverTimestamp } from "firebase/firestore";

// Function to update or create sensor data
export const updateSensor = async (sensorId, playerId, action) => {
  try {
    const sensorRef = doc(db, "sensors", sensorId);
    const sensorDoc = await getDoc(sensorRef);

    if (sensorDoc.exists()) {
      const data = sensorDoc.data();
      await updateDoc(sensorRef, {
        status: "active",
        triggeredAt: serverTimestamp(),
        triggerCount: (data.triggerCount || 0) + 1,
        interactions: arrayUnion({
          playerId: playerId,
          action: action,
          timestamp: serverTimestamp()
        })
      });
    } else {
      await setDoc(sensorRef, {
        type: "touch",
        location: "templeWall",
        status: "active",
        triggeredAt: serverTimestamp(),
        interactions: [{
          playerId: playerId,
          action: action,
          timestamp: serverTimestamp()
        }],
        triggerCount: 1,
        linkedObject: "templeDoor"
      });
    }
  } catch (error) {
    console.error("Error updating sensor:", error);
  }
};
