"""
System Test Script for AI Customer Segmentation Chatbot
Tests all components without requiring the LLM model
"""

import pandas as pd
import sys
import os
from datetime import datetime

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_data_loading():
    """Test customer data loading and validation"""
    print("🧪 Testing Data Loading...")
    
    try:
        df = pd.read_csv('customer_segments.csv')
        print(f"✅ Data loaded successfully: {len(df)} customers")
        
        # Check required columns
        required_cols = ['CustomerID', 'Recency', 'Frequency', 'Monetary', 'Cluster']
        missing_cols = [col for col in required_cols if col not in df.columns]
        
        if missing_cols:
            print(f"❌ Missing columns: {missing_cols}")
            return False
        else:
            print("✅ All required columns present")
        
        # Check data types and ranges
        print(f"📊 Data Summary:")
        print(f"   • Customers: {len(df)}")
        print(f"   • Segments: {df['Cluster'].nunique()}")
        print(f"   • Avg Recency: {df['Recency'].mean():.1f} days")
        print(f"   • Avg Frequency: {df['Frequency'].mean():.1f}")
        print(f"   • Avg Monetary: ${df['Monetary'].mean():.2f}")
        
        return True
        
    except Exception as e:
        print(f"❌ Data loading failed: {str(e)}")
        return False

def test_business_logic():
    """Test business logic calculations"""
    print("\n🧪 Testing Business Logic...")
    
    try:
        from business_logic import BusinessLogic
        
        # Load test data
        df = pd.read_csv('customer_segments.csv')
        business_logic = BusinessLogic(df)
        
        print("✅ BusinessLogic initialized successfully")
        
        # Test segment summary
        segment_summary = business_logic.get_segment_summary()
        print(f"✅ Segment summary generated for {len(segment_summary)} segments")
        
        for segment_id, data in segment_summary.items():
            print(f"   📊 Segment {segment_id}: {data['customer_count']} customers, ${data['total_revenue']:,.2f} revenue")
        
        # Test most profitable segment
        most_profitable = business_logic.get_most_profitable_segment()
        print(f"✅ Most profitable segment: {most_profitable[0]} (${most_profitable[1]['total_revenue']:,.2f})")
        
        # Test segment comparison
        segments = list(segment_summary.keys())
        if len(segments) >= 2:
            comparison = business_logic.compare_segments(segments[0], segments[1])
            print(f"✅ Segment comparison: {segments[0]} vs {segments[1]} completed")
        
        # Test churn analysis
        churn_analysis = business_logic.get_churn_risk_analysis()
        print(f"✅ Churn analysis completed")
        print(f"   • Low risk segments: {churn_analysis['low_churn_segments']}")
        print(f"   • High risk segments: {churn_analysis['high_churn_segments']}")
        
        # Test marketing recommendations
        recommendations = business_logic.get_marketing_recommendations(segments[0])
        print(f"✅ Marketing recommendations generated: {len(recommendations)} items")
        
        return True
        
    except Exception as e:
        print(f"❌ Business logic test failed: {str(e)}")
        return False

def test_chatbot_controller():
    """Test chatbot controller without LLM"""
    print("\n🧪 Testing Chatbot Controller...")
    
    try:
        from chatbot_controller import ChatbotController
        from business_logic import BusinessLogic
        
        # Initialize components
        df = pd.read_csv('customer_segments.csv')
        business_logic = BusinessLogic(df)
        chatbot = ChatbotController()
        chatbot.set_business_logic(business_logic)
        
        print("✅ ChatbotController initialized successfully")
        
        # Test intent detection
        test_queries = [
            "Which segment is most profitable?",
            "Compare segment 1 and segment 2",
            "What's the churn risk for segment 0?",
            "Suggest marketing strategy for high-value customers",
            "Analyze customer behavior patterns"
        ]
        
        for query in test_queries:
            intent = chatbot.detect_intent(query)
            segments = chatbot.extract_segment_numbers(query)
            print(f"✅ Query: '{query[:30]}...' → Intent: {intent}, Segments: {segments}")
        
        # Test context generation
        context = chatbot.generate_focused_context('segment_analysis', 'analyze segment 0')
        print(f"✅ Business context generated: {len(context)} characters")
        
        # Test fallback responses
        fallback = chatbot._generate_fallback_response("Which segment is best?", "segment_analysis", [0])
        print(f"✅ Fallback response generated: {len(fallback)} characters")
        
        # Test system status
        status = chatbot.get_system_status()
        print(f"✅ System status: LLM loaded: {status['llm_loaded']}, Business logic: {status['business_logic_connected']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Chatbot controller test failed: {str(e)}")
        return False

def test_llm_loader():
    """Test LLM loader (without actually loading the model)"""
    print("\n🧪 Testing LLM Loader...")
    
    try:
        from llm_loader import LLMLoader
        
        # Initialize loader
        llm_loader = LLMLoader()
        print("✅ LLMLoader initialized successfully")
        
        # Test model info
        model_info = llm_loader.get_model_info()
        print(f"✅ Model info retrieved:")
        print(f"   • Model path: {model_info['model_path']}")
        print(f"   • Model exists: {model_info['model_exists']}")
        print(f"   • Is loaded: {model_info['is_loaded']}")
        
        # Test prompt creation
        test_context = "Sample business context with customer data"
        test_query = "Which segment is most profitable?"
        
        prompt = llm_loader.create_business_prompt(test_query, test_context)
        print(f"✅ Business prompt created: {len(prompt)} characters")
        
        # Test response cleaning
        test_response = "  [INST] This is a test response </s>  \n\n  "
        cleaned = llm_loader._clean_response(test_response)
        print(f"✅ Response cleaning works: '{cleaned}'")
        
        return True
        
    except Exception as e:
        print(f"❌ LLM loader test failed: {str(e)}")
        return False

def test_streamlit_imports():
    """Test if all Streamlit dependencies are available"""
    print("\n🧪 Testing Streamlit Dependencies...")
    
    try:
        import streamlit as st
        print("✅ Streamlit imported successfully")
        
        import plotly.express as px
        import plotly.graph_objects as go
        print("✅ Plotly imported successfully")
        
        import pandas as pd
        import numpy as np
        print("✅ Data processing libraries imported successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ Streamlit dependencies test failed: {str(e)}")
        return False

def run_comprehensive_test():
    """Run all system tests"""
    print("🚀 Starting Comprehensive System Test")
    print("=" * 50)
    
    tests = [
        ("Data Loading", test_data_loading),
        ("Business Logic", test_business_logic),
        ("Chatbot Controller", test_chatbot_controller),
        ("LLM Loader", test_llm_loader),
        ("Streamlit Dependencies", test_streamlit_imports)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"❌ {test_name} test crashed: {str(e)}")
            results[test_name] = False
    
    # Summary
    print("\n" + "=" * 50)
    print("📋 TEST SUMMARY")
    print("=" * 50)
    
    passed = sum(results.values())
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print(f"\n🎯 Overall Result: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! System is ready to run.")
        print("\n🚀 Next steps:")
        print("1. Download the Mistral-7B model (see README.md)")
        print("2. Run: streamlit run app.py")
        print("3. Open http://localhost:8501")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
        print("📖 Refer to README.md for troubleshooting.")
    
    return passed == total

if __name__ == "__main__":
    success = run_comprehensive_test()
    sys.exit(0 if success else 1)