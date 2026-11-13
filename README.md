# Taga Repair Management System

A full-stack air-conditioning repair/service management system.

## Features
- Dashboard with customer, unit, repair, technician, payment and revenue summaries
- Customer records (create, view, edit, delete)
- Aircon unit records linked to customers
- Repair jobs linked to customers, units and technicians
- Technician records and availability status
- Payment records linked to repair jobs
- Search, responsive layout, status indicators and automatic repair total calculation

## Requirements
- Node.js 18+
- MySQL 8+
- npm

## 1. Create database
Open MySQL Workbench or phpMyAdmin and run:
```sql
CREATE DATABASE taga_repair;
```

## 2. Start backend
```bash
cd server
npm install
```
Copy `.env.example` to `.env` and set your MySQL username/password. Then:
```bash
npm run dev
```
API runs at http://localhost:3005. Tables are created automatically on first start.

## 3. Start frontend (new terminal)
```bash
cd client
npm install
npm run dev
```
Open http://localhost:5173

If backend runs on another URL, create `client/.env` with:
`VITE_API_URL=http://localhost:3005/api`

## Important
This starter is designed for local development. Before public deployment, add authentication/role permissions, request validation, backups, and production secrets management. `sequelize.sync()` is used for development; use migrations for production.
