const express = require("express");
const path = require("path");
const employees = require("./data");

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/dashboard", (req, res) => {
  const today = new Date();
  const employeeData = employees.map((emp) => {
    const expiry = new Date(emp.expiryDate);

    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    let status = "Active";

    if (daysLeft <= 60) {
      status = "Expiring Soon";
    }

    return { ...emp, daysLeft, status };
  });

  const total = employeeData.length;
  const expiring = employeeData.filter(
    (emp) => emp.status === "Expiring Soon",
  ).length;

  res.render("dashboard", {
    employees: employeeData,
    total,
    expiring,
  });
});

app.listen(3000, () => {
  console.log("Server Running");
});
