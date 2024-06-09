const asyncMiddleware = require("../middleware/async");
const Package = require("../models/Package");
const Admin = require("../models/Admin");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary");

exports.detail = asyncMiddleware(async (req, res) => {
  // const { id } = req.params;
  const package = await Package.find();
  res.status(200).json(package);
});

exports.create = asyncMiddleware(async (req, res) => {
  const { name, description, price, location, activities, admin, itinerary } =
    req.body;

  const Admins = await Admin.findById(admin);
  if (!Admins) {
    return res.status(404).json({ error: "Admin not found" });
  }

  let image;

  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    image = newPath;
  }

  const result = await cloudinary.uploader.upload(image, {
    folder: "packageImage",
  });

  const package = new Package({
    name,
    description,
    price,
    location,
    activities,
    image: { public_id: result.public_id, url: result.secure_url },
    admin,
    itinerary,
  });
  await package.save();
  res.status(201).json(package);
});

// Get a specific package by ID
exports.getPackageById = asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const package = await Package.findById(id);
  if (!package) {
    return res.status(404).json({ error: "Package not found" });
  }
  res.status(200).json(package);
});

// Update a package
exports.updatePackage = asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, location, activities, admin, itinerary } =
    req.body;

  const Admins = await Admin.findById(admin);
  if (!Admins) {
    return res.status(404).json({ error: "Admin not found" });
  }

  let image;

  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    image = newPath;
    const result = await cloudinary.uploader.upload(image, {
      folder: "packageImage",
    });

    image = { public_id: result.public_id, url: result.secure_url };
  }

  const updateData = {
    name,
    description,
    price,
    location,
    activities,
    admin,
    itinerary,
  };

  if (image) {
    updateData.image = image;
  }

  const updatedPackage = await Package.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!updatedPackage) {
    return res.status(404).json({ error: "Package not found" });
  }

  // const updatedPackage = await Package.findByIdAndUpdate(
  //   id,
  //   {
  //     name,
  //     description,
  //     price,
  //     location,
  //     activities,
  //     // image: { public_id: result.public_id, url: result.secure_url },
  //     admin,
  //   },
  //   { new: true }
  // );

  // if (!updatedPackage) {
  //   return res.status(404).json({ error: "Package not found" });
  // }

  res.status(200).json(updatedPackage);
});

// Delete a package
exports.deletePackage = asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const deletedPackage = await Package.findByIdAndDelete(id);
  if (!deletedPackage) {
    return res.status(404).json({ error: "Package not found" });
  }
  res.status(204).end();
});

exports.TopRatedPackages = asyncMiddleware(async (req, res) => {
  const packages = await Package.find({ "ratings.0": { $exists: true } }); // Only find packages with at least one rating
  const ratedPackages = packages.filter(
    (package) => package.ratings.length > 0
  ); // Filter out packages with no ratings
  const topRatedPackages = ratedPackages
    .sort((a, b) => b.averageRating - a.averageRating) // Sort by average rating
    .slice(0, 3); // Get top 3 rated packages
  res.send(topRatedPackages);
});

// exports.TopRatedPackages = asyncMiddleware(async (req, res) => {
//   // const sum =0
//   // for (p in packages.length){
//   //   sum += p.rating
//   // }

//   // const average = sum /packages.length
//   // const packages = await Package.find({lte:{average}});

//   // const packages = await Package.find({});

//   // res.send(packages);

//   const packages = await Package.find({});
//   let sum = 0;
//   for (const p of packages) {
//     sum += p.rating;
//   }
//   const average = Math.floor(sum / packages.length);

//   console.log("average:", average);

//   // Fetch packages with ratings above the average
//   const topRatedPackages = await Package.find({ rating: { $gte: average } });

//   res.send(topRatedPackages);
// });
