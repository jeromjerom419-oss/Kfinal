const express = require("express");
const router = express.Router();
const { Customer, Technician, AirconUnit, Repair, Payment } = require("../models");
const models = { customers: Customer, technicians: Technician, units: AirconUnit, repairs: Repair, payments: Payment };
const includes = {
  units: [{ model: Customer }],
  repairs: [{ model: Customer }, { model: AirconUnit }, { model: Technician }, { model: Payment }],
  payments: [{ model: Repair, include: [Customer] }]
};
router.get("/dashboard", async (_req, res) => {
  try {
    const [customers, units, repairs, technicians, payments, pending, inProgress, completed, revenue] = await Promise.all([
      Customer.count(), AirconUnit.count(), Repair.count(), Technician.count(),
      Payment.count(), Repair.count({ where: { status: "Pending" } }),
      Repair.count({ where: { status: "In Progress" } }),
      Repair.count({ where: { status: "Completed" } }),
      Payment.sum("amount", { where: { status: "Paid" } })
    ]);
    res.json({ customers, units, repairs, technicians, payments, pending, inProgress, completed, revenue: Number(revenue || 0) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});
for (const [path, Model] of Object.entries(models)) {
  router.get(`/${path}`, async (req, res) => {
    try {
      const rows = await Model.findAll({ include: includes[path] || [], order: [["createdAt", "DESC"]] });
      res.json(rows);
    } catch (e) { res.status(500).json({ message: e.message }); }
  });
  router.get(`/${path}/:id`, async (req, res) => {
    try {
      const row = await Model.findByPk(req.params.id, { include: includes[path] || [] });
      if (!row) return res.status(404).json({ message: "Record not found" });
      res.json(row);
    } catch (e) { res.status(500).json({ message: e.message }); }
  });
  router.post(`/${path}`, async (req, res) => {
    try {
      const row = await Model.create(req.body);
      res.status(201).json(row);
    } catch (e) { res.status(400).json({ message: e.message }); }
  });
  router.put(`/${path}/:id`, async (req, res) => {
    try {
      const row = await Model.findByPk(req.params.id);
      if (!row) return res.status(404).json({ message: "Record not found" });
      await row.update(req.body);
      res.json(row);
    } catch (e) { res.status(400).json({ message: e.message }); }
  });
  router.delete(`/${path}/:id`, async (req, res) => {
    try {
      const row = await Model.findByPk(req.params.id);
      if (!row) return res.status(404).json({ message: "Record not found" });
      await row.destroy();
      res.json({ message: "Record deleted successfully" });
    } catch (e) { res.status(500).json({ message: e.message }); }
  });
}
module.exports = router;
