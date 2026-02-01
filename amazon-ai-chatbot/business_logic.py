"""
Business Logic Layer for Customer Segmentation Analysis
Provides data-driven insights and analytics for the AI chatbot
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Tuple, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BusinessLogic:
    """
    Core business logic for customer segmentation analysis
    Provides real data computations to ground LLM responses
    """
    
    def __init__(self, df: pd.DataFrame):
        """
        Initialize with customer segmentation data
        
        Args:
            df: DataFrame with columns [CustomerID, Recency, Frequency, Monetary, Cluster]
        """
        self.df = df.copy()
        self.validate_data()
        self.compute_derived_metrics()
        
        logger.info(f"Initialized BusinessLogic with {len(self.df)} customers")
    
    def validate_data(self):
        """Validate the input data structure"""
        required_columns = ['CustomerID', 'Recency', 'Frequency', 'Monetary', 'Cluster']
        missing_columns = [col for col in required_columns if col not in self.df.columns]
        
        if missing_columns:
            raise ValueError(f"Missing required columns: {missing_columns}")
        
        # Handle missing values
        self.df = self.df.dropna()
        
        # Ensure proper data types
        self.df['CustomerID'] = self.df['CustomerID'].astype(str)
        self.df['Recency'] = pd.to_numeric(self.df['Recency'], errors='coerce')
        self.df['Frequency'] = pd.to_numeric(self.df['Frequency'], errors='coerce')
        self.df['Monetary'] = pd.to_numeric(self.df['Monetary'], errors='coerce')
        self.df['Cluster'] = pd.to_numeric(self.df['Cluster'], errors='coerce')
        
        # Remove any rows with invalid data
        self.df = self.df.dropna()
        
        logger.info(f"Data validation complete. {len(self.df)} valid records.")
    
    def compute_derived_metrics(self):
        """Compute additional business metrics"""
        # Customer Lifetime Value (simplified)
        self.df['CLV'] = self.df['Frequency'] * self.df['Monetary']
        
        # Recency Score (lower recency = higher score)
        max_recency = self.df['Recency'].max()
        self.df['RecencyScore'] = (max_recency - self.df['Recency']) / max_recency * 100
        
        # Frequency Score (normalized)
        max_frequency = self.df['Frequency'].max()
        self.df['FrequencyScore'] = self.df['Frequency'] / max_frequency * 100
        
        # Monetary Score (normalized)
        max_monetary = self.df['Monetary'].max()
        self.df['MonetaryScore'] = self.df['Monetary'] / max_monetary * 100
        
        # Overall RFM Score
        self.df['RFMScore'] = (
            self.df['RecencyScore'] * 0.3 + 
            self.df['FrequencyScore'] * 0.3 + 
            self.df['MonetaryScore'] * 0.4
        )
        
        # Customer Value Tier
        self.df['ValueTier'] = pd.cut(
            self.df['RFMScore'], 
            bins=[0, 25, 50, 75, 100], 
            labels=['Low', 'Medium', 'High', 'Premium']
        )
        
        # Churn Risk (based on recency)
        self.df['ChurnRisk'] = pd.cut(
            self.df['Recency'], 
            bins=[0, 30, 90, 180, float('inf')], 
            labels=['Low', 'Medium', 'High', 'Critical']
        )
    
    def get_segment_summary(self) -> Dict[int, Dict[str, Any]]:
        """
        Get comprehensive summary for each customer segment
        
        Returns:
            Dictionary with segment statistics
        """
        summary = {}
        
        for cluster in sorted(self.df['Cluster'].unique()):
            cluster_data = self.df[self.df['Cluster'] == cluster]
            
            summary[cluster] = {
                'customer_count': len(cluster_data),
                'percentage': len(cluster_data) / len(self.df) * 100,
                'avg_recency': cluster_data['Recency'].mean(),
                'avg_frequency': cluster_data['Frequency'].mean(),
                'avg_monetary': cluster_data['Monetary'].mean(),
                'total_revenue': cluster_data['Monetary'].sum(),
                'avg_clv': cluster_data['CLV'].mean(),
                'avg_rfm_score': cluster_data['RFMScore'].mean(),
                'churn_risk_distribution': cluster_data['ChurnRisk'].value_counts().to_dict(),
                'value_tier_distribution': cluster_data['ValueTier'].value_counts().to_dict(),
                'median_monetary': cluster_data['Monetary'].median(),
                'std_monetary': cluster_data['Monetary'].std(),
                'min_monetary': cluster_data['Monetary'].min(),
                'max_monetary': cluster_data['Monetary'].max()
            }
        
        return summary
    
    def get_most_profitable_segment(self) -> Tuple[int, Dict[str, Any]]:
        """
        Identify the most profitable customer segment
        
        Returns:
            Tuple of (segment_id, segment_details)
        """
        segment_summary = self.get_segment_summary()
        
        most_profitable = max(
            segment_summary.items(), 
            key=lambda x: x[1]['total_revenue']
        )
        
        return most_profitable
    
    def get_highest_clv_segment(self) -> Tuple[int, Dict[str, Any]]:
        """
        Identify segment with highest average CLV
        
        Returns:
            Tuple of (segment_id, segment_details)
        """
        segment_summary = self.get_segment_summary()
        
        highest_clv = max(
            segment_summary.items(), 
            key=lambda x: x[1]['avg_clv']
        )
        
        return highest_clv
    
    def compare_segments(self, segment1: int, segment2: int) -> Dict[str, Any]:
        """
        Compare two customer segments
        
        Args:
            segment1: First segment ID
            segment2: Second segment ID
            
        Returns:
            Comparison analysis
        """
        summary = self.get_segment_summary()
        
        if segment1 not in summary or segment2 not in summary:
            return {"error": "Invalid segment IDs"}
        
        seg1 = summary[segment1]
        seg2 = summary[segment2]
        
        comparison = {
            'segment1_id': segment1,
            'segment2_id': segment2,
            'customer_count_diff': seg1['customer_count'] - seg2['customer_count'],
            'revenue_diff': seg1['total_revenue'] - seg2['total_revenue'],
            'clv_diff': seg1['avg_clv'] - seg2['avg_clv'],
            'recency_diff': seg1['avg_recency'] - seg2['avg_recency'],
            'frequency_diff': seg1['avg_frequency'] - seg2['avg_frequency'],
            'monetary_diff': seg1['avg_monetary'] - seg2['avg_monetary'],
            'rfm_score_diff': seg1['avg_rfm_score'] - seg2['avg_rfm_score'],
            'better_segment': segment1 if seg1['total_revenue'] > seg2['total_revenue'] else segment2,
            'segment1_data': seg1,
            'segment2_data': seg2
        }
        
        return comparison
    
    def get_churn_risk_analysis(self) -> Dict[str, Any]:
        """
        Analyze churn risk across segments
        
        Returns:
            Churn risk analysis
        """
        churn_by_segment = self.df.groupby(['Cluster', 'ChurnRisk']).size().unstack(fill_value=0)
        churn_percentages = churn_by_segment.div(churn_by_segment.sum(axis=1), axis=0) * 100
        
        # Find segments with lowest/highest churn risk
        low_churn_segments = []
        high_churn_segments = []
        
        for segment in churn_percentages.index:
            low_risk_pct = churn_percentages.loc[segment, 'Low'] if 'Low' in churn_percentages.columns else 0
            critical_risk_pct = churn_percentages.loc[segment, 'Critical'] if 'Critical' in churn_percentages.columns else 0
            
            if low_risk_pct > 50:
                low_churn_segments.append(segment)
            if critical_risk_pct > 30:
                high_churn_segments.append(segment)
        
        return {
            'churn_by_segment': churn_by_segment.to_dict(),
            'churn_percentages': churn_percentages.to_dict(),
            'low_churn_segments': low_churn_segments,
            'high_churn_segments': high_churn_segments,
            'overall_churn_distribution': self.df['ChurnRisk'].value_counts().to_dict()
        }
    
    def get_marketing_recommendations(self, segment_id: int) -> List[str]:
        """
        Generate marketing recommendations for a specific segment
        
        Args:
            segment_id: Target segment ID
            
        Returns:
            List of marketing recommendations
        """
        segment_summary = self.get_segment_summary()
        
        if segment_id not in segment_summary:
            return ["Invalid segment ID"]
        
        segment = segment_summary[segment_id]
        recommendations = []
        
        # Based on RFM characteristics
        if segment['avg_rfm_score'] > 75:
            recommendations.extend([
                "🌟 VIP Treatment: Offer exclusive premium services and early access to new products",
                "💎 Loyalty Rewards: Implement high-tier loyalty program with personalized benefits",
                "🎯 Upselling: Focus on premium product recommendations and bundle offers"
            ])
        elif segment['avg_rfm_score'] > 50:
            recommendations.extend([
                "📈 Growth Strategy: Encourage increased purchase frequency with targeted promotions",
                "🔄 Cross-selling: Introduce complementary products based on purchase history",
                "💌 Personalized Communication: Send tailored offers based on preferences"
            ])
        else:
            recommendations.extend([
                "🎁 Win-back Campaigns: Offer attractive discounts to re-engage customers",
                "📧 Re-engagement: Implement email marketing campaigns with special offers",
                "🆕 Product Discovery: Introduce new products at competitive prices"
            ])
        
        # Based on recency
        if segment['avg_recency'] > 90:
            recommendations.append("⏰ Urgency Campaigns: Create time-limited offers to encourage immediate action")
        
        # Based on frequency
        if segment['avg_frequency'] < 2:
            recommendations.append("🔄 Frequency Building: Implement subscription models or repeat purchase incentives")
        
        # Based on monetary value
        if segment['avg_monetary'] < 100:
            recommendations.append("💰 Value Perception: Focus on budget-friendly options and value propositions")
        
        return recommendations
    
    def get_business_context_for_llm(self, user_query: str = "") -> str:
        """
        Generate comprehensive business context for LLM
        
        Args:
            user_query: User's question to focus the context
            
        Returns:
            Formatted business context string
        """
        segment_summary = self.get_segment_summary()
        churn_analysis = self.get_churn_risk_analysis()
        most_profitable = self.get_most_profitable_segment()
        highest_clv = self.get_highest_clv_segment()
        
        # Overall statistics
        total_customers = len(self.df)
        total_revenue = self.df['Monetary'].sum()
        avg_clv = self.df['CLV'].mean()
        
        context = f"""
CUSTOMER SEGMENTATION ANALYSIS REPORT
=====================================

OVERALL BUSINESS METRICS:
• Total Customers: {total_customers:,}
• Total Revenue: ${total_revenue:,.2f}
• Average Customer Lifetime Value: ${avg_clv:.2f}
• Number of Segments: {len(segment_summary)}

SEGMENT PERFORMANCE SUMMARY:
"""
        
        for segment_id, data in segment_summary.items():
            context += f"""
SEGMENT {segment_id}:
• Customer Count: {data['customer_count']:,} ({data['percentage']:.1f}% of total)
• Total Revenue: ${data['total_revenue']:,.2f}
• Average Monetary Value: ${data['avg_monetary']:.2f}
• Average Frequency: {data['avg_frequency']:.1f} purchases
• Average Recency: {data['avg_recency']:.0f} days
• Average CLV: ${data['avg_clv']:.2f}
• RFM Score: {data['avg_rfm_score']:.1f}/100
• Churn Risk Distribution: {data['churn_risk_distribution']}
• Value Tier Distribution: {data['value_tier_distribution']}
"""
        
        context += f"""
KEY INSIGHTS:
• Most Profitable Segment: Segment {most_profitable[0]} (${most_profitable[1]['total_revenue']:,.2f} revenue)
• Highest CLV Segment: Segment {highest_clv[0]} (${highest_clv[1]['avg_clv']:.2f} average CLV)
• Low Churn Risk Segments: {churn_analysis['low_churn_segments']}
• High Churn Risk Segments: {churn_analysis['high_churn_segments']}

CHURN RISK ANALYSIS:
{churn_analysis['overall_churn_distribution']}
"""
        
        return context
    
    def get_segment_characteristics(self, segment_id: int) -> Dict[str, Any]:
        """
        Get detailed characteristics of a specific segment
        
        Args:
            segment_id: Target segment ID
            
        Returns:
            Detailed segment characteristics
        """
        if segment_id not in self.df['Cluster'].unique():
            return {"error": f"Segment {segment_id} not found"}
        
        segment_data = self.df[self.df['Cluster'] == segment_id]
        summary = self.get_segment_summary()[segment_id]
        
        # Calculate additional insights
        top_customers = segment_data.nlargest(5, 'Monetary')[['CustomerID', 'Monetary', 'Frequency', 'Recency']]
        
        characteristics = {
            'basic_stats': summary,
            'top_customers': top_customers.to_dict('records'),
            'behavioral_patterns': {
                'purchase_frequency_pattern': 'High' if summary['avg_frequency'] > 5 else 'Medium' if summary['avg_frequency'] > 2 else 'Low',
                'spending_pattern': 'High' if summary['avg_monetary'] > 500 else 'Medium' if summary['avg_monetary'] > 200 else 'Low',
                'engagement_level': 'Active' if summary['avg_recency'] < 60 else 'Moderate' if summary['avg_recency'] < 120 else 'Inactive'
            },
            'business_value': {
                'revenue_contribution': summary['total_revenue'] / self.df['Monetary'].sum() * 100,
                'customer_share': summary['percentage'],
                'avg_order_value': summary['avg_monetary'] / summary['avg_frequency'] if summary['avg_frequency'] > 0 else 0
            }
        }
        
        return characteristics