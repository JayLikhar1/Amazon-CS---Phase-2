# 🤖 AI-Powered Amazon Customer Segmentation Assistant

A fully **offline**, **free-forever** AI chatbot system that integrates customer segmentation analytics with local open-source LLMs. Built for enterprise-level customer intelligence and business insights.

## 🌟 Key Features

- **🔒 100% Offline**: No internet required, complete data privacy
- **🆓 Free Forever**: Uses open-source models, no API costs
- **🧠 Local LLM**: Powered by Mistral-7B-Instruct via llama-cpp-python
- **📊 Real Analytics**: Grounded in actual customer segmentation data
- **💬 Natural Language**: Ask business questions in plain English
- **🎯 Business Intelligence**: Actionable insights and recommendations

## 🏗️ System Architecture

```
Streamlit Chat UI
         ↓
Chat Controller (Python)
         ↓
Local LLM (Mistral via llama.cpp)
         ↓
Business Logic Layer
         ↓
Amazon Customer Segmentation Data (RFM + KMeans Clusters)
```

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd amazon-ai-chatbot
pip install -r requirements.txt
```

### 2. Download the LLM Model

Download Mistral-7B-Instruct GGUF model (recommended: Q4_K_M quantization for best CPU performance):

```bash
# Create models directory
mkdir models

# Download from Hugging Face (choose one):
# Option 1: Direct download (if you have huggingface-hub)
huggingface-cli download TheBloke/Mistral-7B-Instruct-v0.1-GGUF mistral-7b-instruct-v0.1.Q4_K_M.gguf --local-dir models

# Option 2: Manual download
# Visit: https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF
# Download: mistral-7b-instruct-v0.1.Q4_K_M.gguf (~4.1GB)
# Place in: models/mistral-7b-instruct-v0.1.Q4_K_M.gguf
```

### 3. Run the Application

```bash
streamlit run app.py
```

The application will be available at `http://localhost:8501`

## 📊 Sample Data

The system includes sample Amazon customer segmentation data (`customer_segments.csv`) with:
- **100 customers** across **3 segments**
- **RFM Analysis**: Recency, Frequency, Monetary values
- **K-Means Clustering**: Customer segments (0, 1, 2)

### Data Schema
```csv
CustomerID,Recency,Frequency,Monetary,Cluster
CUST_001,15,8,1250.50,0
CUST_002,45,3,450.25,1
...
```

## 💬 Example Conversations

### Segment Analysis
**You:** "Which customer segment is the most profitable?"

**AI:** "📊 **Data Analysis**
Based on the customer segmentation data, Segment 0 is the most profitable with $31,234.50 in total revenue (45.2% of total revenue).

🧠 **Business Insights**
This segment shows high-value characteristics:
- Average monetary value: $1,847.32
- Low recency: 14.3 days (very recent purchases)
- High frequency: 11.2 purchases per customer

🎯 **Recommendations**
- Implement VIP loyalty programs
- Offer premium product lines
- Provide personalized customer service"

### Comparative Analysis
**You:** "Compare Segment 1 and Segment 2"

**AI:** "⚖️ **Segment Comparison Analysis**
Segment 1 significantly outperforms Segment 2:

📊 **Key Differences:**
- Revenue: Segment 1 ($18,450) vs Segment 2 ($4,320)
- Average CLV: $542.35 vs $108.75
- Purchase frequency: 4.8 vs 1.6 times

🧠 **Business Insights**
Segment 1 represents your 'developing customers' while Segment 2 shows 'at-risk' patterns..."

## 🎯 Supported Query Types

1. **Segment Analysis**: "Analyze segment performance", "Which segment is best?"
2. **Comparisons**: "Compare segment 1 vs segment 2"
3. **Churn Analysis**: "Which customers are at risk?", "Explain churn patterns"
4. **Marketing Strategy**: "Suggest campaigns for high-value customers"
5. **Customer Behavior**: "Why do customers in segment 2 buy less?"
6. **Business Metrics**: "What's our total CLV?", "Revenue by segment"

## 🔧 Configuration

### Model Configuration
Edit `llm_loader.py` to adjust model parameters:

```python
self.config = {
    'n_ctx': 2048,          # Context window
    'n_threads': 4,         # CPU threads
    'temperature': 0.7,     # Response creativity
    'max_tokens': 512,      # Max response length
}
```

### Business Logic
Customize analytics in `business_logic.py`:
- Add new metrics
- Modify segment characteristics
- Create custom recommendations

## 📁 Project Structure

```
amazon-ai-chatbot/
│
├── app.py                    # Main Streamlit application
├── llm_loader.py            # LLM loading and inference
├── business_logic.py        # Customer analytics engine
├── chatbot_controller.py    # Conversation orchestration
├── customer_segments.csv    # Sample customer data
├── requirements.txt         # Python dependencies
├── README.md               # This file
│
└── models/                 # LLM models directory
    └── mistral-7b-instruct-v0.1.Q4_K_M.gguf
```

## 🛠️ Technical Details

### LLM Integration
- **Model**: Mistral-7B-Instruct (GGUF format)
- **Runtime**: llama-cpp-python
- **Quantization**: Q4_K_M (4-bit, optimal CPU performance)
- **Context Window**: 2048 tokens
- **Memory Usage**: ~4-6GB RAM

### Business Intelligence
- **RFM Analysis**: Recency, Frequency, Monetary scoring
- **Customer Lifetime Value**: Calculated CLV metrics
- **Churn Risk Assessment**: Risk categorization
- **Segment Profiling**: Detailed segment characteristics
- **Marketing Recommendations**: AI-generated strategies

### Performance Optimization
- **CPU-Only**: Optimized for CPU inference
- **Memory Mapping**: Efficient model loading
- **Conversation Memory**: Context-aware responses
- **Caching**: Streamlit caching for data and models

## 🔍 Troubleshooting

### Model Loading Issues
```bash
# If model fails to load:
1. Check model file exists in models/ directory
2. Verify file size (~4.1GB for Q4_K_M)
3. Check available RAM (need 6GB+)
4. Try different quantization (Q3_K_M for less RAM)
```

### Performance Issues
```bash
# For better performance:
1. Increase n_threads in llm_loader.py
2. Use SSD storage for model files
3. Close other applications to free RAM
4. Consider Q3_K_M quantization for faster inference
```

### Installation Issues
```bash
# For llama-cpp-python compilation issues:

# macOS (Apple Silicon):
CMAKE_ARGS="-DLLAMA_METAL=on" pip install llama-cpp-python

# Linux (with OpenBLAS):
CMAKE_ARGS="-DLLAMA_BLAS=ON -DLLAMA_BLAS_VENDOR=OpenBLAS" pip install llama-cpp-python

# Windows:
pip install llama-cpp-python --force-reinstall --no-cache-dir
```

## 📈 Extending the System

### Adding New Data Sources
1. Modify `customer_segments.csv` with your data
2. Update column mappings in `business_logic.py`
3. Adjust validation in `validate_data()` method

### Custom Analytics
1. Add new methods to `BusinessLogic` class
2. Update intent patterns in `ChatbotController`
3. Modify prompt templates in `LLMLoader`

### Different Models
1. Download alternative GGUF models
2. Update model path in `llm_loader.py`
3. Adjust prompt templates for model-specific formats

## 🎯 Business Value

This system demonstrates:
- **Enterprise AI Integration**: Production-ready chatbot architecture
- **Cost Optimization**: Zero ongoing API costs
- **Data Privacy**: Complete offline operation
- **Scalability**: Handles large customer datasets
- **Business Intelligence**: Actionable insights from data
- **Technical Excellence**: Modern Python, ML, and UI technologies

## 📊 Sample Business Insights

The system can generate insights like:

- **Segment 0**: "Champions" - High value, recent, frequent buyers
- **Segment 1**: "Potential Loyalists" - Recent customers with growth potential  
- **Segment 2**: "At Risk" - Low engagement, need retention campaigns

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Mistral AI** for the excellent Mistral-7B model
- **llama.cpp** team for the efficient inference engine
- **Streamlit** for the amazing web framework
- **Hugging Face** for model hosting and distribution

---

**🚀 Ready to revolutionize your customer analytics with AI?**

Start the application and ask: *"Which customer segment should I focus on for maximum ROI?"*