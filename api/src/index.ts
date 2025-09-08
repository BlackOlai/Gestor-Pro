import dotenv from 'dotenv';
import app from './server';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log('✅ Allowed origins:');
  console.log('   - http://localhost:5173');
  console.log('   - https://gestor-pro-rovians-projects.vercel.app');
  console.log('   - https://gestor-pro-seven.vercel.app');
  console.log('   - Any subdomain of .vercel.app');
});
