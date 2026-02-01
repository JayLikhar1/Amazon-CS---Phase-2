# Advanced Customer Segmentation Dashboard

A sophisticated customer segmentation dashboard built with Next.js, React, and Aceternity UI components. Features **advanced analytics** based on customer segmentation results with deep insights, comprehensive analysis, and a beautiful iOS-inspired design.

## ✨ Key Features

### 🎯 **Advanced Segmentation Analytics**
- **Prediction-Based Insights**: All analytics derived from actual customer segmentation predictions
- **Deep Segment Analysis**: Comprehensive breakdown of customer segments with detailed characteristics
- **Intelligent Insights**: AI-generated insights based on segmentation patterns and trends
- **Performance Tracking**: ML model confidence and accuracy monitoring

### 📊 **Comprehensive Analytics Dashboard**
- **Segment Overview**: Detailed analysis of each customer segment with descriptions and metrics
- **Performance Comparison**: Side-by-side comparison of segment performance and value
- **Advanced Insights**: Intelligent analysis of segment diversity, value concentration, and trends
- **Summary Metrics**: Key performance indicators for segmentation effectiveness

### 🎨 Modern iOS-Style Design
- **Glassmorphism Effects**: Beautiful frosted glass cards and components
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Gradient Backgrounds**: Dynamic color schemes with animated gradients
- **iOS-Style Shadows**: Authentic depth and elevation effects

### 🚀 Interactive Components
- **Dynamic Sliders**: Real-time customer data input with visual feedback
- **Animated Results**: Engaging prediction displays with bounce and fade effects
- **Floating Navigation**: Clean, minimal navigation bar
- **Responsive Design**: Perfect on all devices and screen sizes

### 🧠 **Intelligent Customer Segmentation**
- **AI-Powered Classification**: Advanced ML model for customer segmentation
- **Detailed Predictions**: Customer classification with confidence scores and detailed analysis
- **Segment Comparisons**: Compare customer data against segment averages
- **Actionable Recommendations**: Personalized marketing strategies per segment
- **Advanced Analytics**: Deep insights into segment performance and characteristics

### 🎨 **iOS-Style Design**
- **Glassmorphism Effects**: Beautiful frosted glass cards and components
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Gradient Backgrounds**: Dynamic color schemes with animated gradients
- **iOS-Style Shadows**: Authentic depth and elevation effects
- **Responsive Design**: Perfect experience on all devices

### 🔍 **Advanced Analytics Features**
- **Segment Overview**: Comprehensive analysis of each customer segment
- **Performance Ranking**: Segments ranked by value and performance metrics
- **Value Analysis**: Average spending, income, and value ratios per segment
- **Diversity Insights**: Analysis of customer portfolio diversity
- **Confidence Tracking**: ML model performance and prediction reliability

### 🎯 Key Components
- **Aceternity UI Integration**: Premium component library
- **Background Effects**: Animated beams and meteors
- **Bento Grid Layout**: Modern card-based information architecture
- **Custom Animations**: Tailored motion design

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion for smooth transitions
- **Components**: Aceternity UI + Custom components
- **Icons**: Custom SVG icons (no external dependencies)
- **Real-Time**: WebSocket service simulation
- **State Management**: React hooks and context

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Run development server**:
```bash
npm run dev
```

3. **Open your browser**:
Navigate to `http://localhost:3000`

## 📁 Project Structure

```
├── app/
│   ├── globals.css          # Global styles and CSS variables
│   ├── layout.tsx           # Root layout with dark theme
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── aceternity/          # Aceternity UI components
│   │   ├── background-beams.tsx
│   │   ├── bento-grid.tsx
│   │   ├── floating-navbar.tsx
│   │   └── meteors.tsx
│   ├── ui/                  # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── slider.tsx
│   │   └── tabs.tsx
│   ├── customer-input-form.tsx      # Customer data input form
│   ├── prediction-results.tsx       # Results display component
│   ├── real-time-analytics.tsx      # Real-time metrics dashboard
│   ├── live-dashboard.tsx           # Main live dashboard
│   └── performance-monitor.tsx      # System performance tracking
├── lib/
│   ├── utils.ts             # Utility functions
│   └── analytics-store.ts   # Analytics data store for tracking predictions
└── Configuration files...
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue to Purple gradients
- **Background**: Dark slate with purple accents
- **Glass Effects**: Semi-transparent whites with blur
- **Text**: High contrast whites and grays

### Typography
- **Font**: Inter (Google Fonts)
- **Hierarchy**: Clear size and weight distinctions
- **Readability**: Optimized contrast ratios

### Animations
- **Entrance**: Fade-in and slide-up effects
- **Interactions**: Scale and color transitions
- **Background**: Subtle floating and meteor effects

## 🔮 **Advanced Analytics Engine**

### **Analytics Store**
The dashboard includes a sophisticated analytics store (`lib/analytics-store.ts`) that:
- **Tracks Every Prediction**: Stores complete customer data and prediction results
- **Generates Advanced Metrics**: Calculates comprehensive statistics from actual predictions
- **Creates Intelligent Insights**: AI-generated insights based on segmentation patterns
- **Maintains History**: Complete audit trail of all customer classifications

### **Key Analytics Features**
- **Segment Overview**: Detailed analysis of each customer segment with descriptions
- **Performance Comparison**: Segments ranked by spending, value ratios, and customer count
- **Advanced Insights**: Intelligent analysis of segment diversity, value concentration, and model confidence
- **Summary Metrics**: Key performance indicators for segmentation effectiveness

## 🚀 **How It Works**

1. **Make a Prediction**: Use the customer input form to classify a customer
2. **Analytics Update**: The prediction is automatically added to the analytics store
3. **View Analytics**: All metrics and insights update instantly with new data
4. **Historical Tracking**: All predictions contribute to comprehensive analysis

## 🎯 **Analytics Examples**

When you make predictions, you'll see:
- **Segment Overview**: Detailed breakdown of each customer segment with characteristics
- **Performance Comparison**: Segments ranked by value and performance metrics
- **Advanced Insights**: AI-generated insights about segment diversity and patterns
- **Value Analysis**: Average spending, income, and value ratios per segment
- **Confidence Tracking**: ML model performance across all predictions

## 🔧 Customization

### Real-Time Data Sources
Replace the simulated WebSocket service in `lib/websocket-service.ts` with your actual backend:

```typescript
// Update the WebSocket URL to your backend
const wsService = new WebSocketService('wss://your-backend.com/ws')
```

### Adding New Metrics
Add new real-time metrics in `components/real-time-analytics.tsx`:

```typescript
const newMetric = {
  id: 'custom_metric',
  label: 'Custom Metric',
  value: yourValue,
  icon: YourIcon,
  color: 'from-color-500 to-color-600',
  formatter: (value) => `${value} units`
}
```

### Adding New Segments
Update the `clusterStats` object in `app/page.tsx`:

```typescript
const clusterStats = {
  6: {
    name: "New Segment",
    description: "Description here",
    recommendations: ["Rec 1", "Rec 2"],
    // ... other properties
  }
}
```

### Styling Modifications
- **Colors**: Edit CSS variables in `app/globals.css`
- **Components**: Modify component files in `components/ui/`
- **Animations**: Adjust Framer Motion configs in component files

### ML Model Integration
Replace the mock `predictCluster` function in `app/page.tsx` with your actual ML model API calls.

## 📱 Mobile Optimization

- **Responsive Grid**: Adapts from 1 to 4 columns based on screen size
- **Touch Interactions**: Optimized slider controls for mobile
- **Performance**: Lazy loading and optimized animations
- **Accessibility**: ARIA labels and keyboard navigation

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Docker
```bash
# Build image
docker build -t customer-dashboard .

# Run container
docker run -p 3000:3000 customer-dashboard
```

### Static Export
```bash
npm run build
npm run export
```

## 🔮 Future Enhancements

- **WebSocket Backend**: Full WebSocket server integration
- **Database Integration**: Real customer data persistence
- **Advanced ML Models**: More sophisticated segmentation algorithms
- **Export Features**: PDF reports and data export capabilities
- **Multi-language**: Internationalization support
- **Dark/Light Mode**: Theme switching capability
- **Mobile App**: React Native companion app
- **API Integration**: RESTful API for external integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For questions or issues:
- Check the documentation
- Open an issue on GitHub
- Review the component examples

---

**Built with ❤️ using Next.js and Aceternity UI**