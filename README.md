# Amazon Customer Segmentation App

A professional Streamlit web application for customer segmentation using K-Means clustering. This app allows you to input customer characteristics and predict which segment they belong to, along with detailed insights and recommendations.

## Features

- **Customer Segmentation**: Predict customer segments using machine learning
- **Interactive Input**: Easy-to-use sliders for customer characteristics
- **Detailed Analysis**: Compare customer data with cluster averages
- **Visual Comparisons**: Charts and graphs for better understanding
- **Marketing Recommendations**: Actionable insights for each segment
- **Professional Dark Theme**: Clean, modern UI design

## Installation

### Local Setup

1. Clone or download this repository
2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Ensure you have the model files:
   - `kmeans_model.pkl`
   - `scaler_model.pkl`

4. Run the app:
```bash
streamlit run segmentation.py
```

## Deployment

### Option 1: Streamlit Cloud (Recommended - Free)

1. **Create a GitHub account** (if you don't have one)
   - Go to https://github.com

2. **Create a new repository**
   - Click "New repository"
   - Name it (e.g., "customer-segmentation-app")
   - Make it public (required for free tier)
   - Don't initialize with README

3. **Upload your files to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
   
   Or use GitHub Desktop/GitHub web interface to upload files

4. **Deploy to Streamlit Cloud**
   - Go to https://share.streamlit.io
   - Sign in with your GitHub account
   - Click "New app"
   - Select your repository
   - Set Main file path: `segmentation.py`
   - Click "Deploy"

5. **Your app will be live** at: `https://YOUR_APP_NAME.streamlit.app`

### Option 2: Heroku

1. Install Heroku CLI
2. Create a `Procfile`:
   ```
   web: streamlit run segmentation.py --server.port=$PORT --server.address=0.0.0.0
   ```
3. Deploy:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

### Option 3: Docker

1. Create a `Dockerfile`:
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   EXPOSE 8501
   CMD ["streamlit", "run", "segmentation.py", "--server.port=8501", "--server.address=0.0.0.0"]
   ```

2. Build and run:
   ```bash
   docker build -t customer-segmentation .
   docker run -p 8501:8501 customer-segmentation
   ```

## Required Files for Deployment

Make sure these files are in your repository:
- `segmentation.py` - Main application file
- `requirements.txt` - Python dependencies
- `kmeans_model.pkl` - Trained K-Means model
- `scaler_model.pkl` - StandardScaler model
- `README.md` - This file

## File Structure

```
Amazon Customer Segmentation/
├── segmentation.py          # Main Streamlit app
├── analysis_model.py       # Model training script
├── requirements.txt        # Python dependencies
├── kmeans_model.pkl        # Trained model
├── scaler_model.pkl       # Scaler model
├── customer_segmentation.csv  # Dataset
└── README.md              # Documentation
```

## Usage

1. Adjust the sliders to input customer characteristics:
   - Age
   - Income
   - Total Spending
   - Recency
   - Customer Since (days)
   - Web Purchases
   - Store Purchases
   - Web Visits per Month

2. Click "Predict Customer Segment"

3. View the results:
   - Assigned cluster
   - Comparison with cluster average
   - Visual charts
   - Marketing recommendations

## Model Information

- **Algorithm**: K-Means Clustering
- **Number of Clusters**: 6
- **Features**: 8 (Income, Age, Total Spending, Recency, Customer Since, Web Purchases, Store Purchases, Web Visits/Month)
- **Preprocessing**: StandardScaler normalization

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please open an issue on GitHub.
