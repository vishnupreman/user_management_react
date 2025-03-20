export const decodeJwt = <T = unknown>(token: string): T | null => {
    try {
      const payload = token.split(".")[1]; // Get the payload part
      const decoded = atob(payload); // Base64 decode the payload
      return JSON.parse(decoded) as T; // Parse to JSON and return
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null; // Return null if decoding fails
    }
  };

  