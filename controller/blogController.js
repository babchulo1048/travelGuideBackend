const asyncMiddleware = require("../middleware/async");
const Blog = require("../models/Blog");
const User = require("../models/User");
const Package = require("../models/Package");

exports.blogCreate = asyncMiddleware(async (req, res) => {
  const { userId, packageId, rating, comment } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const package = await Package.findById(packageId);
  if (!package) {
    return res.status(404).json({ error: "Package not found" });
  }

  const newBlog = new Blog({
    user: userId,
    package: packageId,

    rating,
    comment,
  });
  await newBlog.save();

  // Add the rating to the package
  package.ratings.push({ userId, rating });

  // Calculate the new average rating for the package
  const totalRating = package.ratings.reduce(
    (acc, curr) => acc + curr.rating,
    0
  );
  package.averageRating = totalRating / package.ratings.length;

  // Save the package
  await package.save();

  // Populate the user field with only the name
  const populatedBlog = await newBlog.populate("user", "name");

  res.status(200).json(populatedBlog);
});

exports.blogDetail = asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.find({ package: id }).populate({
    path: "user",
    select: "name", // Specify the field(s) you want to populate
  });
  if (!blog) {
    return res.status(404).json({ error: "Blog not found" });
  }
  res.status(200).json(blog);
});
