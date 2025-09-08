import dotenv from 'dotenv';
import app from './server';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Allowed origins: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
