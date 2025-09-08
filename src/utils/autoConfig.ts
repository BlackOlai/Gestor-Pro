// Auto-configure API key for immediate functionality
export const autoConfigureAPI = () => {
  // API key should be set via environment variables or user input
  // const apiKey = 'your_groq_api_key_here';
  
  // Only set if not already configured
  if (!localStorage.getItem('groq_api_key')) {
    console.log('⚠️ Please configure your Groq API key in the settings');
  }
};
