import streamlit as st
import pandas as pd
import joblib
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Load models
kmeans_model = joblib.load("kmeans_model.pkl")
scaler_model = joblib.load("scaler_model.pkl")

# Load cluster statistics from training data (approximate values based on analysis)
cluster_stats = {
    0: {
        "name": "High-Value Loyal",
        "income": 76667,
        "age": 57,
        "total_spending": 1200,
        "recency": 45,
        "customer_since": 2500,
        "numwebpurchases": 5,
        "numstorepurchases": 9,
        "numwebvisitsmonth": 2,
        "description": "High-value, loyal customers with strong purchasing power",
        "recommendations": [
            "Offer premium loyalty rewards",
            "Provide exclusive early access to new products",
            "Personalized high-end product recommendations"
        ]
    },
    1: {
        "name": "Budget-Conscious",
        "income": 29382,
        "age": 50,
        "total_spending": 400,
        "recency": 55,
        "customer_since": 2000,
        "numwebpurchases": 2,
        "numstorepurchases": 3,
        "numwebvisitsmonth": 7,
        "description": "Budget-conscious customers with moderate engagement",
        "recommendations": [
            "Promote deals and discounts",
            "Bundle offers for better value",
            "Highlight budget-friendly alternatives"
        ]
    },
    2: {
        "name": "Senior Customers",
        "income": 49086,
        "age": 68,
        "total_spending": 600,
        "recency": 50,
        "customer_since": 3000,
        "numwebpurchases": 3,
        "numstorepurchases": 5,
        "numwebvisitsmonth": 6,
        "description": "Senior customers with consistent but lower spending",
        "recommendations": [
            "Focus on traditional communication channels",
            "Offer senior discounts",
            "Provide clear product information"
        ]
    },
    3: {
        "name": "Active Balanced",
        "income": 61240,
        "age": 60,
        "total_spending": 900,
        "recency": 40,
        "customer_since": 2200,
        "numwebpurchases": 6,
        "numstorepurchases": 8,
        "numwebvisitsmonth": 6,
        "description": "Active customers with balanced online and store purchases",
        "recommendations": [
            "Omnichannel marketing approach",
            "Cross-channel promotions",
            "Flexible delivery options"
        ]
    },
    4: {
        "name": "Premium",
        "income": 666666,
        "age": 49,
        "total_spending": 5000,
        "recency": 30,
        "customer_since": 1500,
        "numwebpurchases": 8,
        "numstorepurchases": 3,
        "numwebvisitsmonth": 6,
        "description": "Premium customers with exceptional spending patterns",
        "recommendations": [
            "VIP customer service",
            "Exclusive premium products",
            "Personal shopping assistance"
        ]
    },
    5: {
        "name": "Moderate",
        "income": 39446,
        "age": 54,
        "total_spending": 500,
        "recency": 48,
        "customer_since": 1800,
        "numwebpurchases": 2,
        "numstorepurchases": 3,
        "numwebvisitsmonth": 5,
        "description": "Moderate customers with average engagement levels",
        "recommendations": [
            "Re-engagement campaigns",
            "Win-back offers",
            "Increase communication frequency"
        ]
    }
}

# Professional dark theme CSS
st.markdown("""
<style>
    /* Dark background */
    .stApp {
        background-color: #1e1e1e;
    }
    
    /* Main content area */
    .main .block-container {
        padding-top: 2rem;
        padding-bottom: 2rem;
        max-width: 1200px;
    }
    
    /* Header styling */
    .header-container {
        background-color: #2d2d2d;
        border: 1px solid #404040;
        border-radius: 8px;
        padding: 2rem;
        margin-bottom: 2rem;
    }
    
    .main-title {
        font-size: 2rem;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 0.5rem;
        text-align: center;
    }
    
    .subtitle {
        font-size: 1rem;
        color: #b0b0b0;
        text-align: center;
        margin-top: 0.5rem;
    }
    
    /* Card styling */
    .card {
        background-color: #2d2d2d;
        border: 1px solid #404040;
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
    }
    
    /* Text colors */
    h1, h2, h3, h4, h5, h6 {
        color: #ffffff !important;
    }
    
    p, div {
        color: #e0e0e0 !important;
    }
    
    /* Slider label */
    .slider-label {
        font-size: 0.9rem;
        font-weight: 500;
        color: #ffffff;
        margin-bottom: 0.5rem;
        display: block;
    }
    
    /* Button styling */
    .stButton > button {
        width: 100%;
        background-color: #0d7377;
        color: #ffffff;
        font-size: 1rem;
        font-weight: 500;
        padding: 0.75rem 2rem;
        border-radius: 6px;
        border: none;
        transition: background-color 0.2s;
    }
    
    .stButton > button:hover {
        background-color: #14a085;
    }
    
    /* Result card */
    .result-card {
        background-color: #2d2d2d;
        border: 2px solid #0d7377;
        border-radius: 8px;
        padding: 2rem;
        text-align: center;
        color: #ffffff;
        margin-top: 1.5rem;
    }
    
    .result-number {
        font-size: 3.5rem;
        font-weight: 700;
        color: #14a085;
        margin: 0.5rem 0;
    }
    
    .result-text {
        font-size: 1.2rem;
        font-weight: 500;
        color: #e0e0e0;
    }
    
    /* Info box styling */
    .stInfo {
        background-color: #2d2d2d;
        border-left: 4px solid #0d7377;
        color: #e0e0e0;
    }
    
    /* Metric styling */
    .metric-container {
        background-color: #2d2d2d;
        border: 1px solid #404040;
        border-radius: 6px;
        padding: 1rem;
        margin: 0.5rem 0;
    }
    
    /* Hide Streamlit default elements */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    
    /* Streamlit widget styling */
    .stSlider label {
        color: #ffffff !important;
    }
    
    .stSlider div {
        color: #ffffff !important;
    }
    
    /* Markdown text */
    .stMarkdown {
        color: #e0e0e0;
    }
    
    /* Selectbox and other widgets */
    .stSelectbox label, .stNumberInput label {
        color: #ffffff !important;
    }
    
    /* Table styling */
    .dataframe {
        background-color: #2d2d2d;
        color: #e0e0e0;
    }
</style>
""", unsafe_allow_html=True)

# Set matplotlib style for dark theme
plt.style.use('dark_background')
sns.set_style("darkgrid")

# Header Section
st.markdown("""
<div class="header-container">
    <div class="main-title">Amazon Customer Segmentation</div>
    <div class="subtitle">Customer Analysis & Segmentation Tool</div>
</div>
""", unsafe_allow_html=True)

# Main Content Container
st.markdown('<div class="card">', unsafe_allow_html=True)

st.markdown("### Customer Information")
st.markdown("Adjust the sliders below to input customer characteristics:")

# Two-column layout for sliders
col1, col2 = st.columns(2)

with col1:
    st.markdown('<div class="slider-container">', unsafe_allow_html=True)
    st.markdown('<div class="slider-label">Age</div>', unsafe_allow_html=True)
    age = st.slider("Age", min_value=18, max_value=90, value=30, label_visibility="collapsed")
    
    st.markdown('<div class="slider-label">Income</div>', unsafe_allow_html=True)
    income = st.slider("Income", min_value=0, max_value=100000, value=50000, step=1000, label_visibility="collapsed")
    
    st.markdown('<div class="slider-label">Total Spending</div>', unsafe_allow_html=True)
    total_spending = st.slider("Total Spending", min_value=0, max_value=100000, value=50000, step=1000, label_visibility="collapsed")
    
    st.markdown('<div class="slider-label">Recency</div>', unsafe_allow_html=True)
    recency = st.slider("Recency", min_value=0, max_value=100, value=30, label_visibility="collapsed")
    st.markdown('</div>', unsafe_allow_html=True)

with col2:
    st.markdown('<div class="slider-container">', unsafe_allow_html=True)
    st.markdown('<div class="slider-label">Customer Since (days)</div>', unsafe_allow_html=True)
    customer_since = st.slider("Customer Since", min_value=0, max_value=10000, value=1000, step=100, label_visibility="collapsed")
    
    st.markdown('<div class="slider-label">Web Purchases</div>', unsafe_allow_html=True)
    numwebpurchases = st.slider("Web Purchases", min_value=0, max_value=100, value=30, label_visibility="collapsed")
    
    st.markdown('<div class="slider-label">Store Purchases</div>', unsafe_allow_html=True)
    numstorepurchases = st.slider("Store Purchases", min_value=0, max_value=100, value=30, label_visibility="collapsed")
    
    st.markdown('<div class="slider-label">Web Visits per Month</div>', unsafe_allow_html=True)
    numwebvisitsmonth = st.slider("Web Visits per Month", min_value=0, max_value=100, value=30, label_visibility="collapsed")
    st.markdown('</div>', unsafe_allow_html=True)

st.markdown('</div>', unsafe_allow_html=True)

# Input Summary Section
st.markdown('<div class="card">', unsafe_allow_html=True)
st.markdown("### Input Summary")
summary_col1, summary_col2, summary_col3, summary_col4 = st.columns(4)
with summary_col1:
    st.metric("Age", f"{age}")
with summary_col2:
    st.metric("Income", f"${income:,}")
with summary_col3:
    st.metric("Total Spending", f"${total_spending:,}")
with summary_col4:
    st.metric("Recency", f"{recency} days")
st.markdown('</div>', unsafe_allow_html=True)

# Feature order must match the training order
input_data = pd.DataFrame({
    "income": [income],
    "age": [age],
    "total_spending": [total_spending],
    "recency": [recency],
    "customer_since": [customer_since],
    "numwebpurchases": [numwebpurchases],
    "numstorepurchases": [numstorepurchases],
    "numwebvisitsmonth": [numwebvisitsmonth]
})

input_scaled = scaler_model.transform(input_data)

# Predict Button
st.markdown("<br>", unsafe_allow_html=True)

if st.button("Predict Customer Segment", use_container_width=True):
    cluster = kmeans_model.predict(input_scaled)[0]
    cluster_data = cluster_stats[cluster]
    
    # Result Display
    st.markdown(f"""
    <div class="result-card">
        <div style="font-size: 1rem; color: #b0b0b0; margin-bottom: 0.5rem;">Customer Segment</div>
        <div class="result-number">{cluster}</div>
        <div style="font-size: 1.1rem; color: #14a085; margin-bottom: 0.5rem; font-weight: 600;">{cluster_data['name']}</div>
        <div class="result-text">{cluster_data['description']}</div>
    </div>
    """, unsafe_allow_html=True)
    
    # Cluster Characteristics Comparison
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.markdown("### Cluster Characteristics Comparison")
    
    comparison_data = {
        "Feature": ["Income", "Age", "Total Spending", "Recency", "Customer Since", "Web Purchases", "Store Purchases", "Web Visits/Month"],
        "Your Customer": [
            f"${income:,}",
            age,
            f"${total_spending:,}",
            recency,
            customer_since,
            numwebpurchases,
            numstorepurchases,
            numwebvisitsmonth
        ],
        f"Cluster {cluster} Average": [
            f"${cluster_data['income']:,.0f}",
            cluster_data['age'],
            f"${cluster_data['total_spending']:,.0f}",
            cluster_data['recency'],
            cluster_data['customer_since'],
            cluster_data['numwebpurchases'],
            cluster_data['numstorepurchases'],
            cluster_data['numwebvisitsmonth']
        ],
        "Difference": [
            f"${income - cluster_data['income']:+,.0f}",
            f"{age - cluster_data['age']:+d}",
            f"${total_spending - cluster_data['total_spending']:+,.0f}",
            f"{recency - cluster_data['recency']:+d}",
            f"{customer_since - cluster_data['customer_since']:+d}",
            f"{numwebpurchases - cluster_data['numwebpurchases']:+d}",
            f"{numstorepurchases - cluster_data['numstorepurchases']:+d}",
            f"{numwebvisitsmonth - cluster_data['numwebvisitsmonth']:+d}"
        ]
    }
    
    comparison_df = pd.DataFrame(comparison_data)
    st.dataframe(comparison_df, use_container_width=True, hide_index=True)
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Visual Comparison Chart
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.markdown("### Visual Comparison")
    
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    fig.patch.set_facecolor('#1e1e1e')
    
    # Normalize values for comparison (0-1 scale)
    features_to_compare = ['income', 'total_spending', 'numwebpurchases', 'numstorepurchases']
    customer_values = [income/100000, total_spending/100000, numwebpurchases/100, numstorepurchases/100]
    cluster_values = [cluster_data['income']/100000, cluster_data['total_spending']/100000, 
                     cluster_data['numwebpurchases']/100, cluster_data['numstorepurchases']/100]
    
    axes[0, 0].barh(['Your Customer', f'Cluster {cluster} Avg'], 
                    [customer_values[0], cluster_values[0]], 
                    color=['#14a085', '#0d7377'])
    axes[0, 0].set_title('Income (Normalized)', color='white')
    axes[0, 0].set_facecolor('#2d2d2d')
    axes[0, 0].tick_params(colors='white')
    
    axes[0, 1].barh(['Your Customer', f'Cluster {cluster} Avg'], 
                    [customer_values[1], cluster_values[1]], 
                    color=['#14a085', '#0d7377'])
    axes[0, 1].set_title('Total Spending (Normalized)', color='white')
    axes[0, 1].set_facecolor('#2d2d2d')
    axes[0, 1].tick_params(colors='white')
    
    axes[1, 0].barh(['Your Customer', f'Cluster {cluster} Avg'], 
                    [customer_values[2], cluster_values[2]], 
                    color=['#14a085', '#0d7377'])
    axes[1, 0].set_title('Web Purchases (Normalized)', color='white')
    axes[1, 0].set_facecolor('#2d2d2d')
    axes[1, 0].tick_params(colors='white')
    
    axes[1, 1].barh(['Your Customer', f'Cluster {cluster} Avg'], 
                    [customer_values[3], cluster_values[3]], 
                    color=['#14a085', '#0d7377'])
    axes[1, 1].set_title('Store Purchases (Normalized)', color='white')
    axes[1, 1].set_facecolor('#2d2d2d')
    axes[1, 1].tick_params(colors='white')
    
    plt.tight_layout()
    st.pyplot(fig)
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Recommendations Section
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.markdown("### Marketing Recommendations")
    st.markdown(f"**Based on Cluster {cluster} ({cluster_data['name']}) characteristics:**")
    for i, rec in enumerate(cluster_data['recommendations'], 1):
        st.markdown(f"{i}. {rec}")
    st.markdown('</div>', unsafe_allow_html=True)
    
    # All Clusters Overview
    with st.expander("View All Cluster Profiles"):
        st.markdown("### Cluster Profiles Overview")
        cluster_overview = []
        for cl_id, cl_data in cluster_stats.items():
            cluster_overview.append({
                "Cluster": cl_id,
                "Name": cl_data['name'],
                "Avg Income": f"${cl_data['income']:,.0f}",
                "Avg Age": cl_data['age'],
                "Avg Spending": f"${cl_data['total_spending']:,.0f}",
                "Description": cl_data['description']
            })
        overview_df = pd.DataFrame(cluster_overview)
        st.dataframe(overview_df, use_container_width=True, hide_index=True)
    
    # Additional Insights
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.markdown("### Additional Insights")
    
    # Calculate similarity score
    differences = [
        abs(income - cluster_data['income']) / max(income, cluster_data['income']) if max(income, cluster_data['income']) > 0 else 0,
        abs(age - cluster_data['age']) / max(age, cluster_data['age']) if max(age, cluster_data['age']) > 0 else 0,
        abs(total_spending - cluster_data['total_spending']) / max(total_spending, cluster_data['total_spending']) if max(total_spending, cluster_data['total_spending']) > 0 else 0,
    ]
    similarity_score = (1 - np.mean(differences)) * 100
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Cluster Match Score", f"{similarity_score:.1f}%")
    with col2:
        st.metric("Segment Size", "Medium" if cluster in [0, 3, 5] else "Small")
    with col3:
        st.metric("Customer Value", "High" if cluster in [0, 4] else "Medium" if cluster in [3] else "Standard")
    
    st.markdown('</div>', unsafe_allow_html=True)
