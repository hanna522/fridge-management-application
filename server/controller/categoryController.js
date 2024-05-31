exports.getCategory = async (req, res) => {
  try {
    const allCategory = await Category.find().exec({ name: 1});
    return res.status(200).json({
      category_list: allCategory
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send();
  }
};