import { auth } from './firebaseConfig'; // Import the auth instance from firebaseConfig
import { sendPasswordResetEmail } from "firebase/auth";

// Function to send password reset email
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return 'Password reset email sent!';
  } catch (error) {
    throw new Error(error.message);
  }
};
