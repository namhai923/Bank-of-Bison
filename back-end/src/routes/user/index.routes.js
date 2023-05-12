const express = require("express");
const { User, Credential } = require("../../models/user.model");
const { cache, setCacheExpire } = require("../../cache");

let router = express.Router();
const CACHE_EXPIRED_IN_SECONDS = 300;

const authenticate = async (userName, password) => {
  let credential = await Credential.findOne({
    userName: userName,
    password: password,
  });
  return credential !== null;
};

const checkParams = (obj, params) => {
  return params.every((param) => Object.keys(obj).includes(param));
};

router.post("/register", async (req, res, next) => {
  // check if the username exist, if not then add user
  try {
    if (
      checkParams(req.body, [
        "userName",
        "password",
        "firstName",
        "lastName",
        "accountBalance",
      ])
    ) {
      let { userName, password, firstName, lastName, accountBalance } =
        req.body;
      let user = await Credential.findOne({ userName: userName });
      if (user !== null) {
        res.status(400).send("Username Already Exists.");
      } else {
        let newUser = new User({
          userName: userName,
          firstName: firstName,
          lastName: lastName,
          accountBalance: accountBalance ?? 0,
        });
        let userCred = new Credential({
          userName: userName,
          password: password,
        });
        user = await newUser.save();
        await userCred.save();
        res.status(201).send(user);
      }
    } else {
      throw new Error("Missing require parameter in request body.");
    }
  } catch (err) {
    res.status(500).json({ ErrorMessage: err.message });
  }
});

router.post("/getInfo", async (req, res, next) => {
  // check if the username exist, then return user data
  try {
    if (checkParams(req.body, ["userName", "password"])) {
      let { userName, password } = req.body;
      if (await authenticate(userName, password)) {
        if (cache.has(userName)) {
          res.status(200).send(cache.get(userName));
        } else {
          // If not found in cache then go to database to search
          let user = await User.findOne({ userName: userName });

          // Set cache and set it to expired in 300 seconds
          cache.set(userName, user);
          setCacheExpire(userName, CACHE_EXPIRED_IN_SECONDS);
          res.status(200).send(user);
        }
      } else {
        res.status(404).send("Wrong Username or Password");
      }
    } else {
      throw new Error("Missing require parameter in request body.");
    }
  } catch (err) {
    res.status(500).json({ ErrorMessage: err.message });
  }
});

router.post("/updateInfo", async (req, res, next) => {
  try {
    if (
      checkParams(req.body, [
        "userName",
        "password",
        "firstName",
        "lastName",
        "dob",
        "phoneNumber",
      ])
    ) {
      let { userName, password, firstName, lastName, dob, phoneNumber } =
        req.body;

      if (await authenticate(userName, password)) {
        let user = await User.findOne({ userName: userName });
        let updateProfile;

        user.firstName = firstName;
        user.lastName = lastName;
        user.dob = dob;
        user.phoneNumber = phoneNumber;

        updateProfile = await user.save();

        if (cache.has(userName)) {
          cache.set(userName, user);
        }

        res.status(200).send(updateProfile);
      } else {
        res.status(404).send("Wrong Username or Password");
      }
    } else {
      throw new Error("Missing require parameter in request body.");
    }
  } catch (err) {
    res.status(500).json({ ErrorMessage: err.message });
  }
});

router.post("/transfer", async (req, res, next) => {
  try {
    if (
      checkParams(req.body, ["userName", "password", "receiverName", "amount"])
    ) {
      let { userName: senderName, password, receiverName, amount } = req.body;
      if (await authenticate(senderName, password)) {
        console.log(senderName, password);
        let errorMessage = "";
        let sender = await User.findOne({ userName: senderName });
        let receiver = await User.findOne({ userName: receiverName });
        let newTransfer;

        if (receiver != null) {
          if (isNaN(amount) && isNaN(parseFloat(amount))) {
            errorMessage = "Transfer amount must be a number.";
          } else {
            if (amount <= 0) {
              errorMessage = "Transfer amount must be greater than 0.";
            } else {
              if (sender.accountBalance >= amount) {
                sender.accountBalance =
                  Math.round(
                    parseFloat(sender.accountBalance * 100) - amount * 100
                  ) / 100;
                receiver.accountBalance =
                  Math.round(
                    parseFloat(receiver.accountBalance * 100) + amount * 100
                  ) / 100;

                newTransfer = {
                  sender: senderName,
                  receiver: receiverName,
                  date: Date.now(),
                  amount: amount,
                };

                sender.transferHistory.push(newTransfer);
                receiver.transferHistory.push(newTransfer);

                await Promise.all([sender.save(), receiver.save()]);

                //Update cache
                cache.set(senderName, sender);
                cache.set(receiverName, receiver);
              } else {
                errorMessage = "Account balance not enough.";
              }
            }
          }
        } else {
          errorMessage = "Receiver does not exists.";
        }

        if (errorMessage === "") {
          res.status(200).send(newTransfer);
        } else {
          res.status(400).send(errorMessage);
        }
      } else {
        res.status(404).send("Wrong Username or Password");
      }
    } else {
      throw new Error("Missing require parameter in request body.");
    }
  } catch (err) {
    res.status(500).json({ ErrorMessage: err.message });
  }
});

router.post("/expense", async (req, res, next) => {
  try {
    if (
      checkParams(req.body, [
        "userName",
        "password",
        "location",
        "category",
        "amount",
      ])
    ) {
      let { userName, password, location, category, amount } = req.body;

      if (await authenticate(userName, password)) {
        let errorMessage = "";

        let user = await User.findOne({ userName });
        let newExpense;

        if (isNaN(amount)) {
          errorMessage = "Expense amount must be a number.";
        } else {
          if (amount <= 0) {
            errorMessage = "Expense amount must be greater than 0.";
          } else {
            if (user.accountBalance >= amount) {
              user.accountBalance =
                Math.round(
                  parseFloat(user.accountBalance * 100) - amount * 100
                ) / 100;

              newExpense = {
                location,
                category,
                amount,
                date: Date.now(),
              };

              user.expenseHistory.push(newExpense);

              await user.save();

              //Update cache`
              if (cache.has(userName)) {
                cache.set(userName, user);
              }
            } else {
              errorMessage = "Account balance not enough.";
            }
          }
        }

        if (errorMessage === "") {
          res.status(200).send(newExpense);
        } else {
          res.status(400).send(errorMessage);
        }
      } else {
        res.status(404).send("Wrong Username or Password");
      }
    } else {
      throw new Error("Missing require parameter in request body.");
    }
  } catch (err) {
    res.status(500).json({ ErrorMessage: err.message });
  }
});

module.exports = router;
