"""
Local LLM Loader using llama-cpp-python
Handles loading and inference with Mistral-7B-Instruct GGUF model
"""

import os
import logging
from typing import Optional, List, Dict
import streamlit as st

try:
    from llama_cpp import Llama
except ImportError:
    st.error("❌ llama-cpp-python not installed. Run: pip install llama-cpp-python")
    st.stop()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LLMLoader:
    """
    Handles loading and inference with local GGUF models
    Optimized for CPU usage with Mistral-7B-Instruct
    """
    
    def __init__(self, model_path: str = None):
        """
        Initialize the LLM loader
        
        Args:
            model_path: Path to the GGUF model file
        """
        self.model_path = model_path or self._find_model_path()
        self.llm: Optional[Llama] = None
        self.is_loaded = False
        
        # Model configuration optimized for CPU
        self.config = {
            'n_ctx': 2048,          # Context window
            'n_threads': 4,         # CPU threads (adjust based on your CPU)
            'n_gpu_layers': 0,      # Use CPU only
            'verbose': False,       # Reduce output
            'use_mmap': True,       # Memory mapping for efficiency
            'use_mlock': False,     # Don't lock memory
            'n_batch': 512,         # Batch size for processing
            'temperature': 0.7,     # Response creativity
            'top_p': 0.9,          # Nucleus sampling
            'top_k': 40,           # Top-k sampling
            'repeat_penalty': 1.1,  # Prevent repetition
            'max_tokens': 512,      # Max response length
        }
    
    def _find_model_path(self) -> str:
        """
        Find the model file in common locations
        
        Returns:
            Path to the model file
        """
        possible_paths = [
            "models/mistral-7b-instruct-v0.1.Q4_K_M.gguf",
            "models/mistral-7b-instruct.gguf",
            "mistral-7b-instruct-v0.1.Q4_K_M.gguf",
            "mistral-7b-instruct.gguf",
            os.path.expanduser("~/models/mistral-7b-instruct-v0.1.Q4_K_M.gguf"),
            os.path.expanduser("~/models/mistral-7b-instruct.gguf"),
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                logger.info(f"Found model at: {path}")
                return path
        
        # Default path with instructions
        default_path = "models/mistral-7b-instruct-v0.1.Q4_K_M.gguf"
        logger.warning(f"Model not found. Expected at: {default_path}")
        return default_path
    
    def load_model(self) -> bool:
        """
        Load the GGUF model into memory
        
        Returns:
            True if successful, False otherwise
        """
        if self.is_loaded:
            return True
        
        if not os.path.exists(self.model_path):
            logger.error(f"Model file not found: {self.model_path}")
            return False
        
        try:
            logger.info(f"Loading model from: {self.model_path}")
            logger.info("This may take a few minutes on first load...")
            
            self.llm = Llama(
                model_path=self.model_path,
                n_ctx=self.config['n_ctx'],
                n_threads=self.config['n_threads'],
                n_gpu_layers=self.config['n_gpu_layers'],
                verbose=self.config['verbose'],
                use_mmap=self.config['use_mmap'],
                use_mlock=self.config['use_mlock'],
                n_batch=self.config['n_batch']
            )
            
            self.is_loaded = True
            logger.info("✅ Model loaded successfully!")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to load model: {str(e)}")
            return False
    
    def generate_response(self, prompt: str, max_tokens: int = None) -> str:
        """
        Generate a response using the loaded model
        
        Args:
            prompt: Input prompt for the model
            max_tokens: Maximum tokens to generate
            
        Returns:
            Generated response text
        """
        if not self.is_loaded:
            if not self.load_model():
                return "❌ Error: Model not loaded. Please check the model path and try again."
        
        try:
            max_tokens = max_tokens or self.config['max_tokens']
            
            # Generate response
            response = self.llm(
                prompt,
                max_tokens=max_tokens,
                temperature=self.config['temperature'],
                top_p=self.config['top_p'],
                top_k=self.config['top_k'],
                repeat_penalty=self.config['repeat_penalty'],
                stop=["</s>", "[INST]", "[/INST]"],  # Stop tokens for Mistral
                echo=False  # Don't echo the prompt
            )
            
            # Extract the generated text
            generated_text = response['choices'][0]['text'].strip()
            
            # Clean up the response
            generated_text = self._clean_response(generated_text)
            
            return generated_text
            
        except Exception as e:
            logger.error(f"❌ Error generating response: {str(e)}")
            return f"❌ Error generating response: {str(e)}"
    
    def _clean_response(self, text: str) -> str:
        """
        Clean and format the model response
        
        Args:
            text: Raw response from the model
            
        Returns:
            Cleaned response text
        """
        # Remove common artifacts
        text = text.replace("<|im_start|>", "").replace("<|im_end|>", "")
        text = text.replace("[INST]", "").replace("[/INST]", "")
        text = text.replace("</s>", "")
        
        # Remove excessive whitespace
        lines = [line.strip() for line in text.split('\n')]
        lines = [line for line in lines if line]  # Remove empty lines
        
        return '\n\n'.join(lines)
    
    def create_business_prompt(self, user_query: str, context_data: str, conversation_history: List[Dict] = None) -> str:
        """
        Create a structured prompt for business analysis
        
        Args:
            user_query: User's question
            context_data: Business data and analytics
            conversation_history: Previous conversation turns
            
        Returns:
            Formatted prompt for the model
        """
        # Build conversation context
        conversation_context = ""
        if conversation_history:
            recent_history = conversation_history[-4:]  # Last 4 turns
            for msg in recent_history:
                if msg['role'] == 'user':
                    conversation_context += f"Human: {msg['content']}\n"
                elif msg['role'] == 'assistant':
                    conversation_context += f"Assistant: {msg['content']}\n"
        
        prompt = f"""[INST] You are an expert business analyst specializing in customer segmentation and marketing strategy. You have access to real customer data and must provide data-driven insights.

CUSTOMER SEGMENTATION DATA:
{context_data}

CONVERSATION HISTORY:
{conversation_context}

CURRENT QUESTION: {user_query}

INSTRUCTIONS:
1. Analyze the provided customer data thoroughly
2. Provide specific, data-backed insights (use actual numbers from the data)
3. Explain business reasoning behind patterns
4. Give actionable marketing recommendations
5. Use professional business language
6. Structure your response clearly with headers
7. Do NOT make up data - only use the provided information

RESPONSE FORMAT:
📊 **Data Analysis**
[Specific findings from the data]

🧠 **Business Insights**
[Why these patterns exist]

🎯 **Recommendations**
[Actionable strategies]

Respond now: [/INST]"""

        return prompt
    
    def get_model_info(self) -> Dict:
        """
        Get information about the loaded model
        
        Returns:
            Dictionary with model information
        """
        return {
            'model_path': self.model_path,
            'is_loaded': self.is_loaded,
            'config': self.config,
            'model_exists': os.path.exists(self.model_path) if self.model_path else False
        }
    
    def unload_model(self):
        """Unload the model from memory"""
        if self.llm:
            del self.llm
            self.llm = None
            self.is_loaded = False
            logger.info("Model unloaded from memory")

# Singleton instance for caching
_llm_instance = None

def get_llm_instance(model_path: str = None) -> LLMLoader:
    """
    Get or create a singleton LLM instance
    
    Args:
        model_path: Path to the model file
        
    Returns:
        LLMLoader instance
    """
    global _llm_instance
    if _llm_instance is None:
        _llm_instance = LLMLoader(model_path)
    return _llm_instance