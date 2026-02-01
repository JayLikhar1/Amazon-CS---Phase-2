"""
AI-Powered Amazon Customer Segmentation Assistant
A fully offline, free-forever chatbot using local LLMs for customer analytics
"""

import streamlit as st
import pandas as pd
import numpy as np
from datetime import datetime
import plotly.express as px
import plotly.graph_objects as go
from chatbot_controller import ChatbotController
from business_logic import BusinessLogic
import warnings
warnings.filterwarnings('ignore')

# Page configuration
st.set_page_config(
    page_title="AI Customer Segmentation Assistant",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for professional styling
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
        padding: 2rem;
        border-radius: 10px;
        margin-bottom: 2rem;
        color: white;
        text-align: center;
    }
    .metric-card {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #007bff;
        margin: 0.5rem 0;
    }
    .chat-message {
        padding: 1rem;
        border-radius: 10px;
        margin: 0.5rem 0;
    }
    .user-message {
        background: #e3f2fd;
        border-left: 4px solid #2196f3;
    }
    .assistant-message {
        background: #f3e5f5;
        border-left: 4px solid #9c27b0;
    }
    .sidebar-metric {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin: 0.5rem 0;
    }
</style>
""", unsafe_allow_html=True)

@st.cache_data
def load_data():
    """Load and cache customer segmentation data"""
    try:
        df = pd.read_csv('customer_segments.csv')
        return df
    except FileNotFoundError:
        st.error("❌ customer_segments.csv not found. Please ensure the file exists.")
        return None

@st.cache_resource
def initialize_chatbot():
    """Initialize and cache the chatbot controller"""
    return ChatbotController()

def display_header():
    """Display the main application header"""
    st.markdown("""
    <div class="main-header">
        <h1>🤖 AI-Powered Amazon Customer Segmentation Assistant</h1>
        <p>Enterprise-grade offline AI chatbot for customer analytics & business intelligence</p>
        <p><strong>🔒 100% Offline • 🆓 Free Forever • 🧠 Local LLM Powered</strong></p>
    </div>
    """, unsafe_allow_html=True)

def display_sidebar_metrics(df, business_logic):
    """Display key metrics in the sidebar"""
    st.sidebar.markdown("## 📊 Key Metrics")
    
    if df is not None:
        total_customers = len(df)
        total_revenue = df['Monetary'].sum()
        avg_frequency = df['Frequency'].mean()
        avg_recency = df['Recency'].mean()
        
        # Segment distribution
        segment_counts = df['Cluster'].value_counts().sort_index()
        
        st.sidebar.markdown(f"""
        <div class="sidebar-metric">
            <h4>👥 Total Customers</h4>
            <h2>{total_customers:,}</h2>
        </div>
        """, unsafe_allow_html=True)
        
        st.sidebar.markdown(f"""
        <div class="sidebar-metric">
            <h4>💰 Total Revenue</h4>
            <h2>${total_revenue:,.2f}</h2>
        </div>
        """, unsafe_allow_html=True)
        
        st.sidebar.markdown(f"""
        <div class="sidebar-metric">
            <h4>🔄 Avg Frequency</h4>
            <h2>{avg_frequency:.1f}</h2>
        </div>
        """, unsafe_allow_html=True)
        
        st.sidebar.markdown(f"""
        <div class="sidebar-metric">
            <h4>📅 Avg Recency</h4>
            <h2>{avg_recency:.0f} days</h2>
        </div>
        """, unsafe_allow_html=True)
        
        # Segment distribution chart
        st.sidebar.markdown("### 🎯 Segment Distribution")
        fig = px.pie(
            values=segment_counts.values,
            names=[f"Segment {i}" for i in segment_counts.index],
            title="Customer Segments"
        )
        fig.update_layout(height=300)
        st.sidebar.plotly_chart(fig, use_container_width=True)

def display_analytics_dashboard(df, business_logic):
    """Display analytics dashboard"""
    if df is None:
        return
        
    st.markdown("## 📈 Customer Segmentation Analytics")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # RFM Analysis
        st.markdown("### 🎯 RFM Analysis by Segment")
        segment_summary = business_logic.get_segment_summary()
        
        fig = go.Figure()
        segments = list(segment_summary.keys())
        
        fig.add_trace(go.Scatter(
            x=[segment_summary[s]['avg_recency'] for s in segments],
            y=[segment_summary[s]['avg_monetary'] for s in segments],
            mode='markers+text',
            marker=dict(
                size=[segment_summary[s]['avg_frequency']*5 for s in segments],
                color=segments,
                colorscale='viridis',
                showscale=True
            ),
            text=[f"Segment {s}" for s in segments],
            textposition="middle center",
            name="Segments"
        ))
        
        fig.update_layout(
            title="RFM Bubble Chart (Size = Frequency)",
            xaxis_title="Recency (Days)",
            yaxis_title="Monetary Value ($)",
            height=400
        )
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        # Customer Value Distribution
        st.markdown("### 💎 Customer Value Distribution")
        
        fig = px.box(
            df, 
            x='Cluster', 
            y='Monetary',
            title="Monetary Value by Segment",
            labels={'Cluster': 'Segment', 'Monetary': 'Monetary Value ($)'}
        )
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)

def display_chat_interface(chatbot_controller):
    """Display the chat interface"""
    st.markdown("## 💬 AI Assistant Chat")
    st.markdown("Ask me anything about your customer segments! I'll provide data-driven insights and recommendations.")
    
    # Initialize chat history
    if "messages" not in st.session_state:
        st.session_state.messages = []
        # Add welcome message
        welcome_msg = """👋 Hello! I'm your AI Customer Segmentation Assistant. 

I can help you with:
• **Segment Analysis**: "Which segment is most profitable?"
• **Customer Behavior**: "Why does Segment 2 have low churn risk?"
• **Marketing Strategy**: "Suggest campaigns for high-value customers"
• **Comparative Analysis**: "Compare Segment 1 vs Segment 3"
• **Business Insights**: "How to increase customer lifetime value?"

What would you like to know about your customers?"""
        
        st.session_state.messages.append({
            "role": "assistant", 
            "content": welcome_msg,
            "timestamp": datetime.now()
        })
    
    # Display chat history
    for message in st.session_state.messages:
        css_class = "user-message" if message["role"] == "user" else "assistant-message"
        role_icon = "👤" if message["role"] == "user" else "🤖"
        
        st.markdown(f"""
        <div class="chat-message {css_class}">
            <strong>{role_icon} {message["role"].title()}</strong>
            <br>{message["content"]}
            <br><small>🕒 {message["timestamp"].strftime("%H:%M:%S")}</small>
        </div>
        """, unsafe_allow_html=True)
    
    # Chat input
    if prompt := st.chat_input("Ask me about your customer segments..."):
        # Add user message
        st.session_state.messages.append({
            "role": "user", 
            "content": prompt,
            "timestamp": datetime.now()
        })
        
        # Get AI response
        with st.spinner("🧠 AI is analyzing your data..."):
            try:
                response = chatbot_controller.get_response(prompt, st.session_state.messages)
                
                # Add assistant response
                st.session_state.messages.append({
                    "role": "assistant", 
                    "content": response,
                    "timestamp": datetime.now()
                })
                
                # Rerun to display new messages
                st.rerun()
                
            except Exception as e:
                st.error(f"❌ Error generating response: {str(e)}")
                st.info("💡 Make sure the LLM model is properly loaded. Check the setup instructions in README.md")

def display_example_questions():
    """Display example questions users can ask"""
    st.markdown("## 💡 Example Questions")
    
    examples = [
        "Which customer segment is the most profitable?",
        "Explain why Segment 2 has low churn risk",
        "Suggest marketing strategy for low-frequency customers",
        "Compare Segment 1 and Segment 3 performance",
        "How can we increase CLV for high-frequency customers?",
        "What are the characteristics of our best customers?",
        "Which segments should we prioritize for retention campaigns?",
        "Analyze the purchasing patterns of each segment"
    ]
    
    cols = st.columns(2)
    for i, example in enumerate(examples):
        with cols[i % 2]:
            if st.button(f"💬 {example}", key=f"example_{i}"):
                # Add to chat
                st.session_state.messages.append({
                    "role": "user", 
                    "content": example,
                    "timestamp": datetime.now()
                })
                st.rerun()

def main():
    """Main application function"""
    # Display header
    display_header()
    
    # Load data
    df = load_data()
    if df is None:
        st.stop()
    
    # Initialize business logic and chatbot
    business_logic = BusinessLogic(df)
    chatbot_controller = initialize_chatbot()
    chatbot_controller.set_business_logic(business_logic)
    
    # Display sidebar metrics
    display_sidebar_metrics(df, business_logic)
    
    # Main content tabs
    tab1, tab2, tab3 = st.tabs(["💬 AI Chat", "📊 Analytics Dashboard", "💡 Example Questions"])
    
    with tab1:
        display_chat_interface(chatbot_controller)
    
    with tab2:
        display_analytics_dashboard(df, business_logic)
    
    with tab3:
        display_example_questions()
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style="text-align: center; color: #666; padding: 1rem;">
        🤖 <strong>AI-Powered Customer Segmentation Assistant</strong><br>
        Built with ❤️ using Streamlit + Local LLM (Mistral-7B) + Python<br>
        🔒 100% Offline • 🆓 Free Forever • 📊 Data-Driven Insights
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()