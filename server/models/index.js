const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Customer = sequelize.define("Customer", {
  name: { type: DataTypes.STRING(120), allowNull: false },
  phone: { type: DataTypes.STRING(30), allowNull: false },
  email: { type: DataTypes.STRING(120), validate: { isEmail: true } },
  address: { type: DataTypes.TEXT, allowNull: false }
});
const Technician = sequelize.define("Technician", {
  name: { type: DataTypes.STRING(120), allowNull: false },
  phone: { type: DataTypes.STRING(30), allowNull: false },
  specialization: { type: DataTypes.STRING(120), defaultValue: "Air-conditioning" },
  status: { type: DataTypes.ENUM("Available","Busy","Inactive"), defaultValue: "Available" }
});
const AirconUnit = sequelize.define("AirconUnit", {
  brand: { type: DataTypes.STRING(80), allowNull: false },
  model: { type: DataTypes.STRING(100) },
  unit_type: { type: DataTypes.STRING(80), allowNull: false },
  horsepower: { type: DataTypes.STRING(30) },
  serial_number: { type: DataTypes.STRING(100), unique: true }
});
const Repair = sequelize.define("Repair", {
  service_type: { type: DataTypes.STRING(120), allowNull: false },
  description: { type: DataTypes.TEXT },
  problem: { type: DataTypes.TEXT, allowNull: false },
  repair_date: { type: DataTypes.DATEONLY, allowNull: false },
  schedule_date: { type: DataTypes.DATEONLY },
  status: { type: DataTypes.ENUM("Pending","In Progress","Completed","Cancelled"), defaultValue: "Pending" },
  labor_cost: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  parts_cost: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  total_cost: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  notes: { type: DataTypes.TEXT }
});
const Payment = sequelize.define("Payment", {
  amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  payment_date: { type: DataTypes.DATEONLY, allowNull: false },
  method: { type: DataTypes.ENUM("Cash","GCash","Bank Transfer","Other"), defaultValue: "Cash" },
  status: { type: DataTypes.ENUM("Paid","Partial","Unpaid"), defaultValue: "Paid" },
  reference: { type: DataTypes.STRING(120) },
  notes: { type: DataTypes.TEXT }
});
// Use the same camelCase foreign-key names sent by the React forms.
// Explicit names prevent Sequelize from generating CustomerId/AirconUnitId
// attributes that do not match customerId/airconUnitId in the API payload.
Customer.hasMany(AirconUnit, {
  foreignKey: { name: "customerId", allowNull: false },
  onDelete: "CASCADE"
});
AirconUnit.belongsTo(Customer, {
  foreignKey: { name: "customerId", allowNull: false }
});

Customer.hasMany(Repair, {
  foreignKey: { name: "customerId", allowNull: false },
  onDelete: "CASCADE"
});
Repair.belongsTo(Customer, {
  foreignKey: { name: "customerId", allowNull: false }
});

AirconUnit.hasMany(Repair, {
  foreignKey: { name: "airconUnitId", allowNull: false },
  onDelete: "CASCADE"
});
Repair.belongsTo(AirconUnit, {
  foreignKey: { name: "airconUnitId", allowNull: false }
});

Technician.hasMany(Repair, { foreignKey: "technicianId" });
Repair.belongsTo(Technician, { foreignKey: "technicianId" });

Repair.hasMany(Payment, {
  foreignKey: { name: "repairId", allowNull: false },
  onDelete: "CASCADE"
});
Payment.belongsTo(Repair, {
  foreignKey: { name: "repairId", allowNull: false }
});
module.exports = { sequelize, Customer, Technician, AirconUnit, Repair, Payment };
