exports.getHome = async (req, res) => {
  const homeData = { message: "Hello, User Name" };
  try {
    res.json(homeData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
