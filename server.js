const express = require("express");
const path = require("path");
const employees = require("./data");

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

function getEmployeeData() {
  return employees.map((emp) => {
    const today = new Date();
    const expiry = new Date(emp.expiryDate);

    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    let status = "Active";

    if (daysLeft <= 60) {
      status = "Expiring Soon";
    }

    return {
      ...emp,
      daysLeft,
      status,
    };
  });
}

// ROUTES
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact", { success: false });
});

app.post("/contact", (req, res) => {
  // Here you can add email sending logic (Nodemailer) later
  console.log("Contact form submission:", req.body);
  res.render("contact", { success: true });
});

app.get("/dashboard", (req, res) => {
  const employeeData = getEmployeeData();

  const total = employeeData.length;

  const expiring = employeeData.filter(
    (emp) => emp.status === "Expiring Soon",
  ).length;

  const active = employeeData.filter((emp) => emp.status === "Active").length;

  res.render("dashboard", {
    employees: employeeData,
    total,
    expiring,
    active,
  });
});

app.listen(3000, () => {
  console.log("Server Running on http://localhost:3000");
});
