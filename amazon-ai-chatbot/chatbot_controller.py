"""
Chatbot Controller - Orchestrates LLM and Business Logic
Handles conversation flow, intent detection, and response generation
"""

import re
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

from llm_loader import get_llm_instance
from business_logic import BusinessLogic

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ChatbotController:
    """
    Main controller for the AI chatbot
    Handles conversation management and response generation
    """
    
    def __init__(self, model_path: str = None):
        """
        Initialize the chatbot controller
        
        Args:
            model_path: Path to the LLM model file
        """
        self.llm_loader = get_llm_instance(model_path)
        self.business_logic: Optional[BusinessLogic] = None
        self.conversation_memory: List[Dict] = []
        self.max_memory_turns = 10  # Keep last 10 conversation turns
        
        # Intent patterns for business queries
        self.intent_patterns = {
            'segment_analysis': [
                r'segment.*analysis', r'analyze.*segment', r'segment.*performance',
                r'which.*segment', r'best.*segment', r'profitable.*segment'
            ],
            'comparison': [
                r'compare.*segment', r'segment.*vs', r'difference.*between',
                r'segment.*comparison', r'versus', r'vs'
            ],
            'churn_analysis': [
                r'churn.*risk', r'retention', r'customer.*leaving',
                r'why.*churn', r'prevent.*churn', r'at.*risk'
            ],
            'marketing_strategy': [
                r'marketing.*strategy', r'campaign', r'promote',
                r'target.*customer', r'recommendation', r'suggest.*marketing'
            ],
            'customer_behavior': [
                r'customer.*behavior', r'buying.*pattern', r'purchase.*pattern',
                r'customer.*characteristics', r'why.*customer'
            ],
            'business_metrics': [
                r'revenue', r'profit', r'clv', r'lifetime.*value',
                r'total.*sales', r'performance.*metric'
            ]
        }
        
        logger.info("ChatbotController initialized")
    
    def set_business_logic(self, business_logic: BusinessLogic):
        """Set the business logic instance"""
        self.business_logic = business_logic
        logger.info("Business logic connected to chatbot")
    
    def detect_intent(self, user_query: str) -> str:
        """
        Detect the user's intent from their query
        
        Args:
            user_query: User's input text
            
        Returns:
            Detected intent category
        """
        query_lower = user_query.lower()
        
        for intent, patterns in self.intent_patterns.items():
            for pattern in patterns:
                if re.search(pattern, query_lower):
                    logger.info(f"Detected intent: {intent}")
                    return intent
        
        logger.info("Detected intent: general")
        return 'general'
    
    def extract_segment_numbers(self, user_query: str) -> List[int]:
        """
        Extract segment numbers mentioned in the query
        
        Args:
            user_query: User's input text
            
        Returns:
            List of segment numbers
        """
        # Look for patterns like "segment 1", "cluster 2", etc.
        patterns = [
            r'segment\s+(\d+)',
            r'cluster\s+(\d+)',
            r'group\s+(\d+)',
            r'\b(\d+)\b'  # Any standalone number
        ]
        
        segments = []
        for pattern in patterns:
            matches = re.findall(pattern, user_query.lower())
            segments.extend([int(match) for match in matches])
        
        # Remove duplicates and sort
        segments = sorted(list(set(segments)))
        
        # Filter to valid segment numbers if business logic is available
        if self.business_logic:
            valid_segments = self.business_logic.df['Cluster'].unique()
            segments = [s for s in segments if s in valid_segments]
        
        return segments
    
    def generate_focused_context(self, intent: str, user_query: str) -> str:
        """
        Generate focused business context based on detected intent
        
        Args:
            intent: Detected user intent
            user_query: Original user query
            
        Returns:
            Focused business context
        """
        if not self.business_logic:
            return "Business data not available."
        
        base_context = self.business_logic.get_business_context_for_llm(user_query)
        segments = self.extract_segment_numbers(user_query)
        
        focused_context = base_context
        
        # Add intent-specific context
        if intent == 'segment_analysis' and segments:
            for segment_id in segments:
                characteristics = self.business_logic.get_segment_characteristics(segment_id)
                if 'error' not in characteristics:
                    focused_context += f"\n\nDETAILED ANALYSIS FOR SEGMENT {segment_id}:\n"
                    focused_context += f"• Behavioral Pattern: {characteristics['behavioral_patterns']}\n"
                    focused_context += f"• Business Value: {characteristics['business_value']}\n"
                    focused_context += f"• Top Customers: {characteristics['top_customers']}\n"
        
        elif intent == 'comparison' and len(segments) >= 2:
            comparison = self.business_logic.compare_segments(segments[0], segments[1])
            if 'error' not in comparison:
                focused_context += f"\n\nSEGMENT COMPARISON ({segments[0]} vs {segments[1]}):\n"
                focused_context += f"• Revenue Difference: ${comparison['revenue_diff']:,.2f}\n"
                focused_context += f"• CLV Difference: ${comparison['clv_diff']:.2f}\n"
                focused_context += f"• Customer Count Difference: {comparison['customer_count_diff']}\n"
                focused_context += f"• Better Performing Segment: {comparison['better_segment']}\n"
        
        elif intent == 'churn_analysis':
            churn_analysis = self.business_logic.get_churn_risk_analysis()
            focused_context += f"\n\nCHURN RISK DETAILED ANALYSIS:\n"
            focused_context += f"• Low Churn Risk Segments: {churn_analysis['low_churn_segments']}\n"
            focused_context += f"• High Churn Risk Segments: {churn_analysis['high_churn_segments']}\n"
            focused_context += f"• Overall Churn Distribution: {churn_analysis['overall_churn_distribution']}\n"
        
        elif intent == 'marketing_strategy' and segments:
            for segment_id in segments:
                recommendations = self.business_logic.get_marketing_recommendations(segment_id)
                focused_context += f"\n\nMARKETING RECOMMENDATIONS FOR SEGMENT {segment_id}:\n"
                for rec in recommendations:
                    focused_context += f"• {rec}\n"
        
        return focused_context
    
    def update_conversation_memory(self, user_query: str, assistant_response: str):
        """
        Update conversation memory with the latest exchange
        
        Args:
            user_query: User's question
            assistant_response: Assistant's response
        """
        self.conversation_memory.append({
            'role': 'user',
            'content': user_query,
            'timestamp': datetime.now()
        })
        
        self.conversation_memory.append({
            'role': 'assistant',
            'content': assistant_response,
            'timestamp': datetime.now()
        })
        
        # Keep only the last N turns
        if len(self.conversation_memory) > self.max_memory_turns * 2:
            self.conversation_memory = self.conversation_memory[-self.max_memory_turns * 2:]
    
    def get_response(self, user_query: str, conversation_history: List[Dict] = None) -> str:
        """
        Generate a response to the user's query
        
        Args:
            user_query: User's input question
            conversation_history: Previous conversation turns
            
        Returns:
            Generated response from the AI
        """
        try:
            # Detect intent and extract relevant information
            intent = self.detect_intent(user_query)
            segments = self.extract_segment_numbers(user_query)
            
            logger.info(f"Processing query: '{user_query[:50]}...'")
            logger.info(f"Intent: {intent}, Segments: {segments}")
            
            # Generate focused business context
            business_context = self.generate_focused_context(intent, user_query)
            
            # Use provided conversation history or internal memory
            history = conversation_history or self.conversation_memory
            
            # Create the prompt for the LLM
            prompt = self.llm_loader.create_business_prompt(
                user_query=user_query,
                context_data=business_context,
                conversation_history=history
            )
            
            # Generate response using the LLM
            response = self.llm_loader.generate_response(prompt)
            
            # Post-process the response
            response = self._post_process_response(response, intent, segments)
            
            # Update conversation memory
            self.update_conversation_memory(user_query, response)
            
            logger.info("Response generated successfully")
            return response
            
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            return self._generate_fallback_response(user_query, intent, segments)
    
    def _post_process_response(self, response: str, intent: str, segments: List[int]) -> str:
        """
        Post-process the LLM response for better formatting
        
        Args:
            response: Raw LLM response
            intent: Detected intent
            segments: Extracted segment numbers
            
        Returns:
            Processed response
        """
        # Add relevant emojis based on intent
        emoji_map = {
            'segment_analysis': '📊',
            'comparison': '⚖️',
            'churn_analysis': '⚠️',
            'marketing_strategy': '🎯',
            'customer_behavior': '👥',
            'business_metrics': '💰'
        }
        
        if intent in emoji_map and not response.startswith(emoji_map[intent]):
            response = f"{emoji_map[intent]} {response}"
        
        # Ensure proper formatting
        if not response.endswith('.') and not response.endswith('!') and not response.endswith('?'):
            response += '.'
        
        return response
    
    def _generate_fallback_response(self, user_query: str, intent: str, segments: List[int]) -> str:
        """
        Generate a fallback response when LLM fails
        
        Args:
            user_query: User's query
            intent: Detected intent
            segments: Extracted segments
            
        Returns:
            Fallback response with basic analytics
        """
        if not self.business_logic:
            return "❌ I'm sorry, but I don't have access to the customer data right now. Please ensure the data is loaded properly."
        
        try:
            if intent == 'segment_analysis' and segments:
                segment_id = segments[0]
                summary = self.business_logic.get_segment_summary()
                if segment_id in summary:
                    data = summary[segment_id]
                    return f"""📊 **Segment {segment_id} Analysis**
                    
**Key Metrics:**
• Customer Count: {data['customer_count']:,}
• Total Revenue: ${data['total_revenue']:,.2f}
• Average Monetary Value: ${data['avg_monetary']:.2f}
• Average Frequency: {data['avg_frequency']:.1f}
• Average Recency: {data['avg_recency']:.0f} days

This segment represents {data['percentage']:.1f}% of your customer base."""
            
            elif intent == 'comparison' and len(segments) >= 2:
                comparison = self.business_logic.compare_segments(segments[0], segments[1])
                if 'error' not in comparison:
                    return f"""⚖️ **Segment Comparison: {segments[0]} vs {segments[1]}**
                    
**Revenue Difference:** ${comparison['revenue_diff']:,.2f}
**CLV Difference:** ${comparison['clv_diff']:.2f}
**Better Performing:** Segment {comparison['better_segment']}

Segment {comparison['better_segment']} shows superior performance in overall revenue generation."""
            
            # General fallback
            most_profitable = self.business_logic.get_most_profitable_segment()
            return f"""📊 **Customer Segmentation Overview**
            
I can help you analyze your customer segments! Here's a quick overview:

**Most Profitable Segment:** Segment {most_profitable[0]}
• Revenue: ${most_profitable[1]['total_revenue']:,.2f}
• Customers: {most_profitable[1]['customer_count']:,}

Ask me about specific segments, comparisons, or marketing strategies!"""
            
        except Exception as e:
            logger.error(f"Fallback response generation failed: {str(e)}")
            return "❌ I'm experiencing technical difficulties. Please try rephrasing your question or check if the customer data is properly loaded."
    
    def get_conversation_summary(self) -> Dict[str, Any]:
        """
        Get a summary of the current conversation
        
        Returns:
            Conversation summary statistics
        """
        return {
            'total_turns': len(self.conversation_memory),
            'user_queries': len([msg for msg in self.conversation_memory if msg['role'] == 'user']),
            'assistant_responses': len([msg for msg in self.conversation_memory if msg['role'] == 'assistant']),
            'conversation_start': self.conversation_memory[0]['timestamp'] if self.conversation_memory else None,
            'last_interaction': self.conversation_memory[-1]['timestamp'] if self.conversation_memory else None
        }
    
    def clear_conversation_memory(self):
        """Clear the conversation memory"""
        self.conversation_memory = []
        logger.info("Conversation memory cleared")
    
    def get_system_status(self) -> Dict[str, Any]:
        """
        Get the current system status
        
        Returns:
            System status information
        """
        llm_info = self.llm_loader.get_model_info()
        
        return {
            'llm_loaded': llm_info['is_loaded'],
            'model_path': llm_info['model_path'],
            'model_exists': llm_info['model_exists'],
            'business_logic_connected': self.business_logic is not None,
            'conversation_turns': len(self.conversation_memory),
            'supported_intents': list(self.intent_patterns.keys())
        }