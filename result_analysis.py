import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

# Set style for publication-grade graphs
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.sans-serif'] = 'Arial'
plt.rcParams['font.family'] = 'sans-serif'

# Define output folder
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "figures")
os.makedirs(OUTPUT_DIR, exist_ok=True)
print(f"[*] Saving figures to directory: {OUTPUT_DIR}")

# ==========================================
# 1. DATASET GENERATION / EXTRACTION
# ==========================================
np.random.seed(42)

categories = ["Power Tools", "Construction", "Cleaning", "Gardening", "Painting", "Heavy Machinery", "Scaffolding"]
locations = ["Kochi", "Ernakulam", "Thrissur", "Aluva", "Kottayam", "Trivandrum"]

# Seed Equipment Data
n_equipments = 60
equipment_ids = [f"EQP_{i:03d}" for i in range(1, n_equipments + 1)]

equipment_list = []
for eq_id in equipment_ids:
    cat = np.random.choice(categories, p=[0.25, 0.20, 0.15, 0.15, 0.10, 0.10, 0.05])
    loc = np.random.choice(locations)
    if cat == "Heavy Machinery":
        price = np.random.randint(2000, 5000)
    elif cat == "Construction":
        price = np.random.randint(600, 1800)
    elif cat == "Scaffolding":
        price = np.random.randint(400, 1000)
    elif cat == "Power Tools":
        price = np.random.randint(200, 600)
    elif cat == "Cleaning":
        price = np.random.randint(300, 700)
    elif cat == "Gardening":
        price = np.random.randint(250, 650)
    else: # Painting
        price = np.random.randint(300, 800)
        
    equipment_list.append({
        "equipment_id": eq_id,
        "name": f"{cat} Item {eq_id[-3:]}",
        "category": cat,
        "location": loc,
        "price_per_day": price,
        "is_available": np.random.choice([True, False], p=[0.75, 0.25])
    })

df_equipment = pd.DataFrame(equipment_list)

# Generate Synthetic Rental Data (500 Records over 12 months)
n_rentals = 500
dates = pd.date_range(start="2025-01-01", end="2025-12-31", freq="D")

rental_list = []
statuses = ["completed", "active", "confirmed", "pending", "cancelled"]
status_probs = [0.55, 0.18, 0.12, 0.10, 0.05]

for i in range(n_rentals):
    eq = df_equipment.sample(1).iloc[0]
    start_dt = np.random.choice(dates)
    duration = np.random.randint(1, 15)
    end_dt = pd.to_datetime(start_dt) + pd.Timedelta(days=duration)
    status = np.random.choice(statuses, p=status_probs)
    total_amount = duration * eq["price_per_day"]
    
    rental_list.append({
        "rental_id": f"RNT_{i:04d}",
        "equipment_id": eq["equipment_id"],
        "category": eq["category"],
        "location": eq["location"],
        "price_per_day": eq["price_per_day"],
        "start_date": pd.to_datetime(start_dt),
        "end_date": end_dt,
        "total_days": duration,
        "total_amount": total_amount,
        "status": status
    })

df_rentals = pd.DataFrame(rental_list)
df_rentals["month"] = df_rentals["start_date"].dt.strftime("%Y-%m (%b)")
df_rentals["month_num"] = df_rentals["start_date"].dt.month

# Generate Maintenance Data
maint_list = []
maint_statuses = ["Good", "Service Soon", "Overdue"]
for eq in equipment_list:
    m_status = np.random.choice(maint_statuses, p=[0.70, 0.20, 0.10])
    maint_list.append({
        "equipment_id": eq["equipment_id"],
        "category": eq["category"],
        "status": m_status,
        "last_service_days_ago": np.random.randint(10, 180)
    })
df_maint = pd.DataFrame(maint_list)

# Generate Feedback Data
feedback_list = []
for i in range(250):
    cat = np.random.choice(categories)
    rating = np.random.choice([5, 4, 3, 2, 1], p=[0.55, 0.25, 0.10, 0.06, 0.04])
    feedback_list.append({
        "feedback_id": f"FB_{i:03d}",
        "category": cat,
        "rating": rating
    })
df_feedback = pd.DataFrame(feedback_list)

print("[*] Data generation complete. Starting exploratory result analysis...")

# ==========================================
# 2. ANALYSIS & PLOTTING FIGURES
# ==========================================

# Figure 1: Equipment Category Pricing & Distribution
plt.figure(figsize=(12, 6))
ax1 = plt.subplot(1, 2, 1)
sns.boxplot(data=df_equipment, x="category", y="price_per_day", hue="category", legend=False, palette="crest", ax=ax1)
plt.xticks(rotation=45, ha='right', fontsize=10)
plt.title("Daily Rental Price Distribution by Category", fontsize=12, fontweight='bold')
plt.xlabel("Category", fontsize=11)
plt.ylabel("Price Per Day (₹)", fontsize=11)

ax2 = plt.subplot(1, 2, 2)
cat_counts = df_equipment["category"].value_counts()
colors = sns.color_palette("viridis", len(cat_counts))
plt.pie(cat_counts, labels=cat_counts.index, autopct='%1.1f%%', startangle=140, colors=colors, explode=[0.05]*len(cat_counts))
plt.title("Equipment Inventory Distribution by Category", fontsize=12, fontweight='bold')

plt.tight_layout()
fig1_path = os.path.join(OUTPUT_DIR, "01_equipment_category_pricing.png")
plt.savefig(fig1_path, dpi=300)
plt.close()
print(f"[+] Saved: {fig1_path}")

# Figure 2: Rental Status & Category Breakdown
plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
status_counts = df_rentals["status"].value_counts()
palette = sns.color_palette("Set2", len(status_counts))
plt.pie(status_counts, labels=status_counts.index.str.capitalize(), autopct='%1.1f%%', 
        colors=palette, wedgeprops=dict(width=0.4, edgecolor='w'))
plt.title("Overall Rental Status Breakdown", fontsize=12, fontweight='bold')

plt.subplot(1, 2, 2)
sns.countplot(data=df_rentals, x="category", hue="status", palette="Set2")
plt.xticks(rotation=45, ha='right')
plt.title("Rental Status by Equipment Category", fontsize=12, fontweight='bold')
plt.xlabel("Category")
plt.ylabel("Rental Count")
plt.legend(title="Status", loc="upper right")

plt.tight_layout()
fig2_path = os.path.join(OUTPUT_DIR, "02_rental_status_distribution.png")
plt.savefig(fig2_path, dpi=300)
plt.close()
print(f"[+] Saved: {fig2_path}")

# Figure 3: Monthly Revenue & Rental Volume Trend
monthly_agg = df_rentals[df_rentals["status"] != "cancelled"].groupby(["month_num", "month"]).agg(
    total_revenue=("total_amount", "sum"),
    rental_count=("rental_id", "count")
).reset_index().sort_values("month_num")

fig, ax1 = plt.subplots(figsize=(12, 6))
color = 'tab:blue'
ax1.set_xlabel('Month (2025)', fontsize=12, fontweight='bold')
ax1.set_ylabel('Total Revenue (₹)', color=color, fontsize=12, fontweight='bold')
line1 = ax1.plot(monthly_agg['month'], monthly_agg['total_revenue'], color=color, marker='o', linewidth=2.5, label="Monthly Revenue (₹)")
ax1.tick_params(axis='y', labelcolor=color)
plt.xticks(rotation=30)

ax2 = ax1.twinx()  
color = 'tab:orange'
ax2.set_ylabel('Rental Order Count', color=color, fontsize=12, fontweight='bold')
line2 = ax2.plot(monthly_agg['month'], monthly_agg['rental_count'], color=color, marker='s', linestyle='--', linewidth=2, label="Rental Volume")
ax2.tick_params(axis='y', labelcolor=color)

# Added combined legend
lines = line1 + line2
labels = [l.get_label() for l in lines]
ax1.legend(lines, labels, loc='upper left')

plt.title("Monthly Revenue & Rental Demand Trend (2025)", fontsize=14, fontweight='bold', pad=15)
plt.tight_layout()
fig3_path = os.path.join(OUTPUT_DIR, "03_monthly_revenue_trend.png")
plt.savefig(fig3_path, dpi=300)
plt.close()
print(f"[+] Saved: {fig3_path}")

# Figure 4: Equipment Maintenance Health Status Analysis
plt.figure(figsize=(10, 5))
plt.subplot(1, 2, 1)
maint_counts = df_maint["status"].value_counts()
maint_colors = {"Good": "#2ecc71", "Service Soon": "#f39c12", "Overdue": "#e74c3c"}
sns.barplot(x=maint_counts.index, y=maint_counts.values, hue=maint_counts.index, legend=False, palette=[maint_colors[k] for k in maint_counts.index])
plt.title("Equipment Health Status Breakdown", fontsize=12, fontweight='bold')
plt.xlabel("Maintenance Status")
plt.ylabel("Number of Equipments")
for i, v in enumerate(maint_counts.values):
    plt.text(i, v + 0.5, str(v), ha='center', fontweight='bold')

plt.subplot(1, 2, 2)
sns.boxplot(data=df_maint, x="status", y="last_service_days_ago", hue="status", legend=False, palette=[maint_colors[k] for k in ["Good", "Service Soon", "Overdue"] if k in df_maint["status"].values])
plt.title("Days Since Last Service by Status", fontsize=12, fontweight='bold')
plt.xlabel("Maintenance Status")
plt.ylabel("Days Since Last Service")

plt.tight_layout()
fig4_path = os.path.join(OUTPUT_DIR, "04_equipment_maintenance_status.png")
plt.savefig(fig4_path, dpi=300)
plt.close()
print(f"[+] Saved: {fig4_path}")

# Figure 5: Customer Rating & Satisfaction Analysis
plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
rating_counts = df_feedback["rating"].value_counts().sort_index(ascending=False)
sns.barplot(x=rating_counts.index, y=rating_counts.values, hue=rating_counts.index, legend=False, palette="YlGn_r")
plt.title("Customer Feedback Rating Distribution", fontsize=12, fontweight='bold')
plt.xlabel("Star Rating (1-5 Stars)")
plt.ylabel("Count")

plt.subplot(1, 2, 2)
avg_ratings = df_feedback.groupby("category")["rating"].mean().reset_index().sort_values("rating", ascending=False)
sns.barplot(data=avg_ratings, x="rating", y="category", hue="category", legend=False, palette="viridis")
plt.title("Average Rating by Equipment Category", fontsize=12, fontweight='bold')
plt.xlabel("Average Rating (Out of 5)")
plt.ylabel("Category")
plt.xlim(0, 5)

plt.tight_layout()
fig5_path = os.path.join(OUTPUT_DIR, "05_customer_feedback_ratings.png")
plt.savefig(fig5_path, dpi=300)
plt.close()
print(f"[+] Saved: {fig5_path}")

# Figure 6: Top Revenue-Generating Equipment Items
top_equip = df_rentals[df_rentals["status"] == "completed"].groupby(["equipment_id", "category"])["total_amount"].sum().reset_index()
top_equip = top_equip.sort_values("total_amount", ascending=False).head(10)

plt.figure(figsize=(10, 5))
sns.barplot(data=top_equip, x="total_amount", y="equipment_id", hue="category", dodge=False, palette="mako")
plt.title("Top 10 Revenue Generating Equipment Items", fontsize=12, fontweight='bold')
plt.xlabel("Total Generated Revenue (₹)")
plt.ylabel("Equipment ID")
plt.legend(title="Category", loc="lower right")

plt.tight_layout()
fig6_path = os.path.join(OUTPUT_DIR, "06_top_rented_equipment_revenue.png")
plt.savefig(fig6_path, dpi=300)
plt.close()
print(f"[+] Saved: {fig6_path}")

# Figure 7: Machine Learning - Rental Revenue Prediction Model Results
df_ml = df_rentals.copy()
df_ml["category_code"] = df_ml["category"].astype("category").cat.codes
df_ml["location_code"] = df_ml["location"].astype("category").cat.codes

X = df_ml[["category_code", "location_code", "price_per_day", "total_days", "month_num"]]
y = df_ml["total_amount"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
r2 = r2_score(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))

plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
plt.scatter(y_test, y_pred, alpha=0.7, color='teal')
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
plt.title(f"ML Model: Actual vs Predicted Revenue\n(R² = {r2:.4f}, RMSE = ₹{rmse:.2f})", fontsize=12, fontweight='bold')
plt.xlabel("Actual Total Amount (₹)")
plt.ylabel("Predicted Total Amount (₹)")

plt.subplot(1, 2, 2)
feature_imp = pd.Series(model.feature_importances_, index=X.columns).sort_values(ascending=True)
feature_imp.plot(kind='barh', color='darkcyan')
plt.title("Feature Importance in Revenue Prediction", fontsize=12, fontweight='bold')
plt.xlabel("Relative Importance score")
plt.ylabel("Feature")

plt.tight_layout()
fig7_path = os.path.join(OUTPUT_DIR, "07_ml_rental_demand_prediction.png")
plt.savefig(fig7_path, dpi=300)
plt.close()
print(f"[+] Saved: {fig7_path}")

# Figure 8: Duration vs Total Amount Regression & Correlation
plt.figure(figsize=(9, 5))
sns.regplot(data=df_rentals, x="total_days", y="total_amount", scatter_kws={'alpha':0.5, 'color':'indigo'}, line_kws={'color':'crimson', 'lw':2})
plt.title("Rental Duration (Days) vs Total Rental Cost (₹)", fontsize=12, fontweight='bold')
plt.xlabel("Rental Duration (Days)")
plt.ylabel("Total Rental Amount (₹)")

plt.tight_layout()
fig8_path = os.path.join(OUTPUT_DIR, "08_rental_duration_vs_cost.png")
plt.savefig(fig8_path, dpi=300)
plt.close()
print(f"[+] Saved: {fig8_path}")

# Write summary markdown report
summary_text = f"""# Renton Project - Data Analytics & ML Model Results Report

## 1. Overview
This report summarizes the performance, revenue analytics, customer feedback, maintenance risk, and predictive machine learning results for the **Renton Equipment Rental System**.

## 2. Key Metrics & Insights
- **Total Equipment Managed**: {len(df_equipment)} items across {len(categories)} categories.
- **Total Rental Orders Evaluated**: {len(df_rentals)} transactions.
- **Total Completed Revenue**: ₹{df_rentals[df_rentals['status']=='completed']['total_amount'].sum():,.2f}
- **Machine Learning Model Accuracy (R² Score)**: `{r2:.4f}` (Random Forest Regressor)
- **Revenue Prediction RMSE**: `₹{rmse:.2f}`

## 3. Generated Figures Checklist
All high-resolution figures have been saved to the **`figures/`** directory:
1. `01_equipment_category_pricing.png` - Distribution of daily rental prices and inventory allocation per category.
2. `02_rental_status_distribution.png` - Breakdown of rental statuses (Completed, Active, Confirmed, Pending, Cancelled).
3. `03_monthly_revenue_trend.png` - Time series of monthly revenue and total rental volume throughout the year.
4. `04_equipment_maintenance_status.png` - Equipment health condition monitoring (Good, Service Soon, Overdue).
5. `05_customer_feedback_ratings.png` - Customer rating distributions (1-5 stars) and category satisfaction.
6. `06_top_rented_equipment_revenue.png` - Top 10 highest revenue generating equipment items.
7. `07_ml_rental_demand_prediction.png` - Machine learning actual vs predicted revenue evaluation & feature importance plot.
8. `08_rental_duration_vs_cost.png` - Regression plot showing correlation between duration and revenue.

---
*Report generated automatically by Renton Python Result Analysis Engine.*
"""

summary_path = os.path.join(OUTPUT_DIR, "analysis_summary.md")
with open(summary_path, "w", encoding="utf-8") as f:
    f.write(summary_text)

print(f"\n[+] Analysis complete! Summary saved to {summary_path}")
