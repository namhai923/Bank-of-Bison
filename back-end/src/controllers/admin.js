const asyncHandler = require("express-async-handler");

const User = require("../models/user.model");
const { cache } = require("../cache");

const sendRecords = asyncHandler(async (req, res, next) => {
  var errorMessage = "";
  let { location, records } = req.body;

  if (location == null || records == null) {
    throw new Error("Missing require parameter in request body.");
  }

  //Iterate through the transaction records list and update database
  for (var record of records) {
    let user = await User.findOne({ userName: record.userName });
    if (user !== null) {
      if (!isNaN(record.amount) && !isNaN(parseFloat(record.amount))) {
        if (record.amount > 0) {
          if (record.amount < user.accountBalance) {
            user.accountBalance =
              Math.round(
                parseFloat(user.accountBalance) * 100 - record.amount * 100
              ) / 100;
            user.expenseHistory.push({
              location: location,
              date: record.date ?? Date.now(),
              category: record.category,
              amount: record.amount,
            });

            await user.save();
            if (cache.has(record.userName)) {
              cache.set(record.userName, user);
            }
          } else {
            errorMessage += record.userName + " account balance not enough.\n";
          }
        } else {
          errorMessage += " expense amount must be greater than 0.\n";
        }
      } else {
        errorMessage += " expense amount must be number.\n";
      }
    } else {
      errorMessage += record.userName + " not exists\n";
    }
  }

  if (errorMessage === "") {
    res.status(200).json({ message: "Successfully processed records." });
  } else {
    res.status(400).json({ message: errorMessage });
  }
});

module.exports = { sendRecords };
