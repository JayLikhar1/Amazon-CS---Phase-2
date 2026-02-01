"""
Demo Script for AI Customer Segmentation Chatbot
Demonstrates system capabilities without requiring the full LLM
"""

import pandas as pd
import sys
import os
from datetime import datetime

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from business_logic import BusinessLogic
from chatbot_controller import ChatbotController

def print_demo_header():
    """Print demo header"""
    print("🤖 AI Customer Segmentation Chatbot - DEMO")
    print("=" * 60)
    print("This demo shows the system's analytical capabilities")
    print("without requiring the full LLM model to be loaded.")
    print("=" * 60)
    print()

def demo_data_analysis():
    """Demonstrate data analysis capabilities"""
    print("📊 CUSTOMER DATA ANALYSIS")
    print("-" * 30)
    
    # Load and analyze data
    df = pd.read_csv('customer_segments.csv')
    business_logic = BusinessLogic(df)
    
    print(f"📈 Dataset Overview:")
    print(f"   • Total Customers: {len(df):,}")
    print(f"   • Customer Segments: {df['Cluster'].nunique()}")
    print(f"   • Total Revenue: ${df['Monetary'].sum():,.2f}")
    print(f"   • Average CLV: ${business_logic.df['CLV'].mean():.2f}")
    print()
    
    # Segment analysis
    segment_summary = business_logic.get_segment_summary()
    
    print("🎯 SEGMENT PERFORMANCE:")
    for segment_id, data in segment_summary.items():
        print(f"   Segment {segment_id}:")
        print(f"     • Customers: {data['customer_count']:,} ({data['percentage']:.1f}%)")
        print(f"     • Revenue: ${data['total_revenue']:,.2f}")
        print(f"     • Avg Monetary: ${data['avg_monetary']:.2f}")
        print(f"     • Avg Frequency: {data['avg_frequency']:.1f}")
        print(f"     • Avg Recency: {data['avg_recency']:.0f} days")
        print(f"     • RFM Score: {data['avg_rfm_score']:.1f}/100")
        print()
    
    return business_logic

def demo_business_insights(business_logic):
    """Demonstrate business insights generation"""
    print("🧠 BUSINESS INSIGHTS")
    print("-" * 20)
    
    # Most profitable segment
    most_profitable = business_logic.get_most_profitable_segment()
    print(f"💰 Most Profitable Segment: {most_profitable[0]}")
    print(f"   • Revenue: ${most_profitable[1]['total_revenue']:,.2f}")
    print(f"   • Customers: {most_profitable[1]['customer_count']:,}")
    print(f"   • Avg CLV: ${most_profitable[1]['avg_clv']:.2f}")
    print()
    
    # Highest CLV segment
    highest_clv = business_logic.get_highest_clv_segment()
    print(f"⭐ Highest CLV Segment: {highest_clv[0]}")
    print(f"   • Avg CLV: ${highest_clv[1]['avg_clv']:.2f}")
    print(f"   • Avg Monetary: ${highest_clv[1]['avg_monetary']:.2f}")
    print()
    
    # Churn risk analysis
    churn_analysis = business_logic.get_churn_risk_analysis()
    print("⚠️  Churn Risk Analysis:")
    print(f"   • Low Risk Segments: {churn_analysis['low_churn_segments']}")
    print(f"   • High Risk Segments: {churn_analysis['high_churn_segments']}")
    print(f"   • Overall Distribution: {churn_analysis['overall_churn_distribution']}")
    print()

def demo_segment_comparison(business_logic):
    """Demonstrate segment comparison"""
    print("⚖️  SEGMENT COMPARISON")
    print("-" * 20)
    
    segments = list(business_logic.get_segment_summary().keys())
    if len(segments) >= 2:
        comparison = business_logic.compare_segments(segments[0], segments[1])
        
        print(f"Comparing Segment {segments[0]} vs Segment {segments[1]}:")
        print(f"   • Revenue Difference: ${comparison['revenue_diff']:,.2f}")
        print(f"   • CLV Difference: ${comparison['clv_diff']:.2f}")
        print(f"   • Customer Count Difference: {comparison['customer_count_diff']}")
        print(f"   • Better Performing: Segment {comparison['better_segment']}")
        print()
        
        # Detailed comparison
        seg1_data = comparison['segment1_data']
        seg2_data = comparison['segment2_data']
        
        print(f"📊 Detailed Metrics:")
        print(f"   Segment {segments[0]}:")
        print(f"     • Customers: {seg1_data['customer_count']:,}")
        print(f"     • Revenue: ${seg1_data['total_revenue']:,.2f}")
        print(f"     • RFM Score: {seg1_data['avg_rfm_score']:.1f}")
        print(f"   Segment {segments[1]}:")
        print(f"     • Customers: {seg2_data['customer_count']:,}")
        print(f"     • Revenue: ${seg2_data['total_revenue']:,.2f}")
        print(f"     • RFM Score: {seg2_data['avg_rfm_score']:.1f}")
        print()

def demo_marketing_recommendations(business_logic):
    """Demonstrate marketing recommendations"""
    print("🎯 MARKETING RECOMMENDATIONS")
    print("-" * 30)
    
    segments = list(business_logic.get_segment_summary().keys())
    
    for segment_id in segments:
        recommendations = business_logic.get_marketing_recommendations(segment_id)
        print(f"Segment {segment_id} Marketing Strategy:")
        for i, rec in enumerate(recommendations, 1):
            print(f"   {i}. {rec}")
        print()

def demo_chatbot_intelligence():
    """Demonstrate chatbot intelligence without LLM"""
    print("🤖 CHATBOT INTELLIGENCE DEMO")
    print("-" * 30)
    
    # Initialize chatbot
    df = pd.read_csv('customer_segments.csv')
    business_logic = BusinessLogic(df)
    chatbot = ChatbotController()
    chatbot.set_business_logic(business_logic)
    
    # Test queries
    test_queries = [
        "Which customer segment is the most profitable?",
        "Compare segment 0 and segment 1 performance",
        "What's the churn risk for our customers?",
        "Suggest marketing strategy for segment 2",
        "Analyze customer behavior in segment 0",
        "How can we increase revenue from segment 1?"
    ]
    
    print("🧪 Testing Intent Detection & Context Generation:")
    print()
    
    for query in test_queries:
        print(f"❓ Query: '{query}'")
        
        # Detect intent
        intent = chatbot.detect_intent(query)
        segments = chatbot.extract_segment_numbers(query)
        
        print(f"   🎯 Detected Intent: {intent}")
        print(f"   📊 Extracted Segments: {segments}")
        
        # Generate focused context
        context = chatbot.generate_focused_context(intent, query)
        context_preview = context[:200] + "..." if len(context) > 200 else context
        print(f"   📋 Context Generated: {len(context)} characters")
        print(f"   📝 Preview: {context_preview}")
        
        # Generate fallback response (simulates what user would see)
        fallback_response = chatbot._generate_fallback_response(query, intent, segments)
        print(f"   🤖 Sample Response: {fallback_response[:150]}...")
        print()

def demo_real_time_analytics():
    """Demonstrate real-time analytics capabilities"""
    print("⚡ REAL-TIME ANALYTICS SIMULATION")
    print("-" * 35)
    
    df = pd.read_csv('customer_segments.csv')
    business_logic = BusinessLogic(df)
    
    # Simulate different analytical queries
    analytics_scenarios = [
        {
            "question": "What's our customer distribution across segments?",
            "analysis": lambda: df['Cluster'].value_counts().to_dict()
        },
        {
            "question": "Which segment has the highest average order value?",
            "analysis": lambda: business_logic.get_segment_summary()
        },
        {
            "question": "What's the revenue contribution by segment?",
            "analysis": lambda: {
                seg: data['total_revenue'] / df['Monetary'].sum() * 100 
                for seg, data in business_logic.get_segment_summary().items()
            }
        }
    ]
    
    for scenario in analytics_scenarios:
        print(f"❓ {scenario['question']}")
        result = scenario['analysis']()
        
        if isinstance(result, dict):
            for key, value in result.items():
                if isinstance(value, (int, float)):
                    if 'revenue' in scenario['question'].lower():
                        print(f"   📊 Segment {key}: {value:.1f}%")
                    else:
                        print(f"   📊 Segment {key}: {value}")
                else:
                    print(f"   📊 {key}: {value}")
        print()

def demo_system_capabilities():
    """Show overall system capabilities"""
    print("🚀 SYSTEM CAPABILITIES OVERVIEW")
    print("-" * 35)
    
    capabilities = [
        "✅ Offline Operation - No internet required",
        "✅ Free Forever - No API costs",
        "✅ Real-time Analytics - Instant data processing",
        "✅ Natural Language Queries - Ask in plain English",
        "✅ Business Intelligence - Actionable insights",
        "✅ Customer Segmentation - RFM analysis",
        "✅ Churn Risk Assessment - Identify at-risk customers",
        "✅ Marketing Recommendations - AI-generated strategies",
        "✅ Comparative Analysis - Segment comparisons",
        "✅ Data Visualization - Interactive charts",
        "✅ Conversation Memory - Context-aware responses",
        "✅ Intent Detection - Understand business questions",
        "✅ Scalable Architecture - Handle large datasets",
        "✅ Professional UI - Streamlit-powered interface"
    ]
    
    for capability in capabilities:
        print(f"   {capability}")
    print()
    
    print("🎯 Business Value:")
    print("   • Reduce customer analysis time from hours to seconds")
    print("   • Generate data-driven marketing strategies instantly")
    print("   • Identify revenue opportunities through segment analysis")
    print("   • Prevent customer churn with risk assessment")
    print("   • Make informed business decisions with AI insights")
    print()

def main():
    """Run the complete demo"""
    print_demo_header()
    
    try:
        # Data analysis demo
        business_logic = demo_data_analysis()
        
        # Business insights demo
        demo_business_insights(business_logic)
        
        # Segment comparison demo
        demo_segment_comparison(business_logic)
        
        # Marketing recommendations demo
        demo_marketing_recommendations(business_logic)
        
        # Chatbot intelligence demo
        demo_chatbot_intelligence()
        
        # Real-time analytics demo
        demo_real_time_analytics()
        
        # System capabilities overview
        demo_system_capabilities()
        
        print("🎉 DEMO COMPLETE!")
        print("=" * 20)
        print("This demo showcased the analytical engine powering the AI chatbot.")
        print("With the full LLM loaded, users can ask these questions in natural language")
        print("and receive comprehensive, data-driven responses.")
        print()
        print("🚀 To experience the full interactive chatbot:")
        print("   1. Download the Mistral-7B model (see README.md)")
        print("   2. Run: streamlit run app.py")
        print("   3. Ask questions like: 'Which segment should I focus on for maximum ROI?'")
        print()
        print("🔒 Remember: Everything runs offline with complete data privacy!")
        
    except Exception as e:
        print(f"❌ Demo failed: {str(e)}")
        print("📖 Please ensure all dependencies are installed and data file exists.")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)