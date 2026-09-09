# Farm Direct Connect

 FarmNex 🌾



FarmNex is a digital marketplace that aims at connecting farmers and FPOs to consumers and bulk buyers.



The idea is to remove any unnecessary intermediaries in order to ensure that farmers sell at a higher price and consumers and bulk buyers buy at a lower price.



It also provides tools for price analysis, demand forecasting and delivery route optimization.

---



## 🚜 The Problem



Agricultural supply chains often have a number of intermediaries:



```text

Farmer → Local Trader → Wholesaler → Distributor → Retailer → Consumer

```



As a consequence of the multiple steps in the supply chain, the farmer does not recieve the majority of the selling price and the consumer has to pay a higher price than what the farmer recieved.



In addition there are other problems:



Farmers might not have a buyer in advance.

It might be challenging to estimate the demand.

Transportation might not be optimized.

Perishable goods might end up being wasted.

Bulk buyers might have to spend a lot of time searching for suppliers.



FarmNex aims at solving the problems by providing a digital platform.

---



## 💡 Our Approach



FarmNex provides a more direct connection between producers and buyers:



```text

Farmer / FPO

│

▼

FarmNex

│

┌────┴─────┐

▼ ▼

Consumer Bulk Buyer

```



It provides the marketplace and additional tools for pricing, demand analysis and logistics.

---



## 👨‍🌾 Farmer & FPO Portal



Farmers and FPOs can create a profile and put up the products that are currently available for sale.



They can input information such as:



Crop/product name

Available quantity

Expected price

Location

Harvest date

Product images

Availability

An example of an FPO listing would be:



```text

Product: Tomato

Quantity: 2,000 kg

Location: Hyderabad

Harvest Date: 10 September

Expected Price: ₹25/kg

```



Farmers can also check buyer requirements, recieve orders, get payment and track pickup/delivery status.

---



## 🛒 Consumer Marketplace



Consumers can browse products from farmers and FPOs.



It is possible to search and filter products by:



Product

Location

Price

Quantity

Availability

It is also possible to display an estimated price which takes into account the logistics cost such as:



```text

Farmer/FPO Price: ₹27/kg

Logistics: ₹3/kg

------------------

Estimated Price: ₹30/kg

```

The intent is to provide a streamlined yet transparent marketplace.

---



## 🏢 Bulk Buyer Portal

FarmNex also provides a marketplace specifically for those seeking to buy large amounts of agricultural produce.



Potential buyers are:



Restaurants

Hotels

Supermarkets

Food-processing companies

Institutional buyers

Other businesses



A buyer can put forward a request such as:



```text

Product: Onion

Quantity: 5,000 kg

Maximum Price: ₹30/kg

Location: Hyderabad

Required By: 12 September

```



The system can then identify farmers or FPOs that have the onion in stock or who might have harvested it before the required date.



In a future version it will also be possible to have B2B reverse bidding where those put up for sale can bid to sell to the buyer.

---



## 🤖 Demand Forecasting



Based on historical or market data the expected demand for a product can be estimated.

Examples of inputs are:

Past sales

Seasonal trends

Market prices



Crop availability

Weather conditions

Festival periods

Location

Past orders

An example of a demand forecast is:

```text

Crop Current Demand Forecast

--------------------------------------

Tomato 10,000 kg 12,500 kg

Onion 15,000 kg 16,000 kg

Potato 8,000 kg 7,200 kg

```

---

## 💰 Price Intelligence

One of the key challenges for a farmer selling their goods is whether or not they are getting a fair price.

For example:

```text

Product: Tomato

Location: Hyderabad

Quantity: 2,000 kg

Current Market Range: ₹22–₹28/kg

Demand: High

Expected Demand: +18%

Suggested Price: ₹26/kg

Potential Buyers: 8

```

The suggested price can be calculated based on market prices, demand, and other factors.

---

## 🚚 Logistics & Route Optimization

An important feature of the agricultural supply chain is the transportation of goods.

To reduce overall costs it can be beneficial to combine multiple farmers delivering their goods to multiple buyers.

A route suggestion engine can take into account:

Distance

Vehicle capacity

Number of stops

Delivery deadlines

Fuel cost

Produce type

Perishability

It would utilize OpenStreetMap and OSRM combined with other route suggestion algorithms.

A high-level overview would be something similar to:

```text

Farmer A ─┐

Farmer B ─┼──► Collection Point ───► Buyer A

Farmer C ─┘ └──► Buyer B

```

---

## 🏗️ System Architecture

```text

FARMNEX

│

┌──────────────┼──────────────┐

│ │ │

Farmers Consumers Bulk Buyers

│ │ │

└──────────────┼──────────────┘

│

DIGITAL MARKETPLACE

│

┌────────────┼────────────┐

│ │ │

Pricing Demand Logistics

Engine Forecasting Engine

│ │ │

└────────────┼────────────┘

│

Delivery Tracking

```

---

## 🛠️ Technology Stack

### Frontend

React

TypeScript

Vite

Tailwind CSS

shadcn/ui

### Backend

Node.js

Express.js

REST APIs

JWT Authentication

### Database

PostgreSQL

Prisma ORM

### AI & Data Processing

Python

FastAPI

Scikit-learn

XGBoost

Pandas

NumPy

### Maps & Routing

OpenStreetMap

OSRM

Dijkstra / A

Vehicle Routing Problem (VRP) optimization

### Deployment

Vercel / Render

PostgreSQL hosting through Supabase or Neon

---

## 🔄 Basic Workflow

The main workflow in FarmNex is:

```text

1. Farmer/FPO registers

↓

2. Farmer lists available produce

↓

3. Consumer or bulk buyer searches

↓

4. Suitable suppliers are identified

↓

5. Price information is displayed

↓

6. Buyer places an order

↓

7. Logistics system plans pickup/delivery

↓

8. Order is delivered

↓

9. Payment and order status are updated

```

---

## 🎯 Project Goal



FarmNex is being developed as a prototype for Smart India Hackathon (SIH).

The intent is not to build a regular agricultural shopping site. It would be beneficial to connect different aspects of the agricultural supply chain to optimize pricing, demand forecasting and logistics.

---

## 💻 Running the Project Locally

Ensure that you have Node.js and npm installed.

Clone the repository:

```bash

git clone

```

Go to the project directory:

```bash

cd farm-direct-connect

```

Install the dependencies:

```bash

npm install

```

Start the development server:

```bash

npm run dev

```

The application should then be available at the local development URL that is displayed in your terminal.

---

## 🚀 Current Status

FarmNex is currently being developed as a working prototype.

The project is focused on building the core marketplace first and then adding the AI, pricing and logistics components.

---

## 🤝 Team

FarmNex is being developed as a team project for Smart India Hackathon.

---

## 📌 Future Improvements

Some features that are planned for the future are:

Real-time market price integration

Better demand prediction using larger datasets

FPO management

B2B reverse bidding

Digital payments and escrow support

Live delivery tracking

Multi-vehicle route optimization

Farmer analytics dashboard

Crop quality/image analysis

Support for livestock products such as poultry and goats

---

## 📄 License

This project is currently being developed for educational and hackathon purposes.