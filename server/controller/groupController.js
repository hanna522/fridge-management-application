const Group = require("../model/group");
const User = require("../model/user");

exports.createGroup = async (req, res) => {
  const { name } = req.body;
  try {
    const group = new Group({ name });
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addUserToGroup = async (req, res) => {
  const { userId, groupId } = req.body;
  try {
    const user = await User.findById(userId);
    const group = await Group.findById(groupId);

    if (!user || !group) {
      return res.status(404).json({ message: "User or Group not found" });
    }

    user.group = groupId;
    await user.save();

    group.members.push(userId);
    await group.save();

    res.json({ message: "User added to group" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
