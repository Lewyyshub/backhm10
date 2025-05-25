const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const DATA_FILE = path.join(__dirname, "../expenses.json");

function readExpenses() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeExpenses(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

async function uploadToCloudinary(buffer) {
  return await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(buffer);
  });
}

exports.createExpense = async (req, res) => {
  try {
    const expenses = readExpenses();

    let imageUrl = null;
    let public_id = null;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploadResult.secure_url;
      public_id = uploadResult.public_id;
    }

    const newExpense = {
      id: Date.now(),
      ...req.body,
      image: imageUrl,
      imageId: public_id,
    };

    expenses.push(newExpense);
    writeExpenses(expenses);
    res.json(newExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpenses = (req, res) => {
  const pageNum = parseInt(req.query.page) || 1;
  const takeNum = parseInt(req.query.take) || 30;
  const expenses = readExpenses();
  const start = (pageNum - 1) * takeNum;
  const paginated = expenses.slice(start, start + takeNum);
  res.json(paginated);
};

exports.updateExpense = async (req, res) => {
  try {
    const expenses = readExpenses();
    const index = expenses.findIndex((e) => e.id == req.params.id);
    if (index === -1)
      return res.status(404).json({ error: "Expense not found" });

 
    if (req.file && expenses[index].imageId) {
      await cloudinary.uploader.destroy(expenses[index].imageId);
    }

    let imageUrl = expenses[index].image;
    let public_id = expenses[index].imageId;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploadResult.secure_url;
      public_id = uploadResult.public_id;
    }

    expenses[index] = {
      ...expenses[index],
      ...req.body,
      image: imageUrl,
      imageId: public_id,
    };

    writeExpenses(expenses);
    res.json(expenses[index]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expenses = readExpenses();
    const index = expenses.findIndex((e) => e.id == req.params.id);
    if (index === -1)
      return res.status(404).json({ error: "Expense not found" });

    const expenseToDelete = expenses[index];

    if (expenseToDelete.imageId) {
      await cloudinary.uploader.destroy(expenseToDelete.imageId);
    }

    const deleted = expenses.splice(index, 1);
    writeExpenses(expenses);
    res.json({ message: "Expense deleted", deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
