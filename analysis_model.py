import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# ==============================
# Load Dataset
# ==============================
df = pd.read_csv("customer_segmentation.csv")

# ==============================
# Clean Column Names
# ==============================
df.columns = (
    df.columns
    .str.strip()
    .str.lower()
    .str.replace(" ", "_")
)

# ==============================
# Basic EDA
# ==============================
print(df.head())
print(df.describe())
print(df.isnull().sum())
print("Duplicates:", df.duplicated().sum())
print(df.nunique())
print(df.columns)
print("Shape:", df.shape)
print(df.info())

# ==============================
# Missing Values Heatmap
# ==============================
sns.heatmap(df.isnull(), cbar=False, cmap="viridis")
plt.title("Missing Values Heatmap")
plt.show()

# ==============================
# Feature Engineering
# ==============================

# ---- Total Spending ----
spend_cols = [
    "mntwines",
    "mntfruits",
    "mntmeatproducts",
    "mntfishproducts",
    "mntsweetproducts",
    "mntgoldprods"
]

df["total_spending"] = df[spend_cols].sum(axis=1)

sns.histplot(df["total_spending"], bins=30, kde=True)
plt.title("Total Customer Spending Distribution")
plt.show()

# ---- Customer Tenure ----
df["dt_customer"] = pd.to_datetime(df["dt_customer"], errors="coerce")
df["customer_since"] = (pd.Timestamp.today() - df["dt_customer"]).dt.days

sns.histplot(df["customer_since"], bins=30, kde=True)
plt.title("Customer Tenure Distribution")
plt.show()

# ---- Age ----
current_year = pd.Timestamp.today().year
df["age"] = current_year - df["year_birth"]

# ==============================
# Distribution Analysis
# ==============================

sns.histplot(df["income"], bins=30, kde=True)
plt.title("Income Distribution")
plt.show()

sns.boxplot(x="education", y="income", data=df)
plt.xticks(rotation=45)
plt.title("Income by Education")
plt.show()

sns.boxplot(x="marital_status", y="total_spending", data=df)
plt.xticks(rotation=45)
plt.title("Spending by Marital Status")
plt.show()

# ==============================
# Correlation Analysis
# ==============================
corr_features = [
    "income",
    "age",
    "total_spending",
    "recency",
    "customer_since",
    "numwebpurchases",
    "numstorepurchases"
]

corr = df[corr_features].corr()
sns.heatmap(corr, annot=True, cmap="coolwarm", fmt=".2f")
plt.title("Correlation Heatmap")
plt.show()

# ==============================
# Pivot Analysis
# ==============================
pivot_income = df.pivot_table(
    index="education",
    columns="marital_status",
    values="income",
    aggfunc="mean"
)

sns.heatmap(pivot_income, annot=True, cmap="coolwarm", fmt=".0f")
plt.title("Avg Income by Education & Marital Status")
plt.show()

# ==============================
# Campaign Acceptance
# ==============================
accepted_cols = [
    "acceptedcmp1",
    "acceptedcmp2",
    "acceptedcmp3",
    "acceptedcmp4",
    "acceptedcmp5",
    "response"
]

df["accepted_any"] = df[accepted_cols].sum(axis=1)
df["accepted_any"] = df["accepted_any"].apply(lambda x: "Yes" if x > 0 else "No")

sns.countplot(x="accepted_any", data=df)
plt.title("Campaign Acceptance")
plt.show()

# Acceptance rate by marital status
df["accepted_flag"] = df["accepted_any"].map({"Yes": 1, "No": 0})

group2 = df.groupby("marital_status")["accepted_flag"].mean().sort_values(ascending=False)
print(group2)

group2.plot(kind="bar", color="orange")
plt.title("Campaign Acceptance Rate by Marital Status")
plt.ylabel("Acceptance Rate")
plt.show()


bins = [18, 30, 40, 50, 60, 70, 90]
labels = ["18-29", "30-39", "40-49", "50-59", "60-69", "70-90"]

df["age_group"] = pd.cut(df["age"], bins=bins, labels=labels)

group3 = df.groupby("age_group", observed=True)["income"].mean()

group3.plot(kind="barh", color="green")
plt.title("Average Income by Age Group")
plt.xlabel("Average Income")
plt.ylabel("Age Group")
plt.show()

features = ["income", "age", "total_spending", "recency", "customer_since", "numwebpurchases", "numstorepurchases", "numwebvisitsmonth"]

# Handle missing values before scaling
df_features = df[features].copy()
df_features = df_features.dropna()  # Remove rows with missing values

sns.pairplot(df_features)
plt.show()


from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df_features)
print(X_scaled)

from sklearn.cluster import KMeans
wcss = []
for i in range(2, 10):
    kmeans = KMeans(n_clusters=i, init="k-means++", random_state=42)
    kmeans.fit(X_scaled)
    wcss.append(kmeans.inertia_)

plt.plot(range(2, 10), wcss)
plt.title("Elbow Method")
plt.xlabel("Number of clusters")
plt.ylabel("WCSS")
plt.show()

kmeans = KMeans(n_clusters=6, init="k-means++", random_state=42)
cluster_labels = kmeans.fit_predict(X_scaled)

# Add cluster labels back to dataframe (only for rows without missing values)
df.loc[df_features.index, "cluster"] = cluster_labels

cluster_summary = df.groupby("cluster")[features].mean()
    
print(cluster_summary)

print("\nCluster Distribution:")
print(df["cluster"].value_counts().sort_index())


from sklearn.decomposition import PCA

pca = PCA(n_components=2)
pca_data = pca.fit_transform(X_scaled)

# Only assign PCA values to rows that have valid data (matching df_features.index)
df.loc[df_features.index, "pca_1"] = pca_data[:, 0]
df.loc[df_features.index, "pca_2"] = pca_data[:, 1]

# Filter dataframe to only include rows with valid clusters for visualization
df_plot = df.dropna(subset=["cluster", "pca_1", "pca_2"])

sns.scatterplot(x="pca_1", y="pca_2", data=df_plot, hue="cluster", palette="viridis")
plt.title("Customer Segmentation PCA Scatter Plot")
plt.show()

import joblib
joblib.dump(kmeans, "kmeans_model.pkl")
joblib.dump(scaler, "scaler_model.pkl")

