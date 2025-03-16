export const decodeJWT = (token: string) => {
    try {
        const base64Url = token.split('.')[1]; // Extract payload
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Fix Base64 format
        const jsonPayload = JSON.parse(atob(base64)); // Decode
        return jsonPayload;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};