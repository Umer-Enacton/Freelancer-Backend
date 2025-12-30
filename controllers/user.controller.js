const { getUsers, saveUser } = require("../utils/oprations");
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res) => {
  try {
    const users = await getUsers();
    return res.status(200).json({
      success: true,
      message: "All Users",
      users,
    });
  } catch (error) {
    console.error("JSON parse error:", error);
    return res.status(500).json({ message: "Invalid users data" });
  }
};
const getUserById = (req, res) => {
  try {
    const id = req.params.id;
    const users = getUsers();
    const user = users.find((u) => u.id == id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "User fetched successfully", user });
  } catch (error) {
    console.error("JSON parse error:", error);
    return res.status(500).json({ message: "Invalid users data" });
  }
};
const AddUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const users = getUsers();
    if (users.find((u) => u.email === email)) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUser(users);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = (req, res) => {
  try {
    const id = req.params.id;
    const users = getUsers();
    const idx = users.findIndex((u) => u.id == id);
    if (idx == -1) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (users.find((u) => u.email === req.body.email)) {
      return res.status(400).json({ message: "Email is  already exists" });
    }
    users[idx] = { ...users[idx], ...req.body };
    saveUser(users);
    return res.status(201).json({
      Success: true,
      message: "User Updated Successfully",
      user: users[idx],
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
const deleteUser = (req, res) => {
  try {
    const id = req.params.id;
    const users = getUsers();
    const idx = users.findIndex((u) => u.id == id);
    if (idx == -1) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const user = users.filter((u) => u.id != id);

    saveUser(user);

    return res.status(200).json(user);

    // console.log(users);
    // res.json(users);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

module.exports = { getAllUsers, getUserById, AddUser, updateUser, deleteUser };
