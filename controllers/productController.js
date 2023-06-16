import catalogModels from "../models/catalogModels.js"
import categoryModels from "../models/categoryModels.js"
import userModel from "../models/userModel.js";
import fs from "fs";
import slugify from "slugify";

// Create Product
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, address, category, countRooms, totalSpace, kitchenArea, livingArea, floor, countFloor, user } = req.fields;
    const { photo } = req.files;
    // Validation
    switch(true) {
      case !name:
        return res.status(500).send({
          error: 'Name is Required'
        })
      case !description:
        return res.status(500).send({
          error: "Description is Required"
        });
      case !price:
        return res.status(500).send({
          error: "Price is Required"
        });
      case !category:
        return res.status(500).send({
          error: "Category is Required"
        });
      case !address:
        return res.status(500).send({
          error: "Address is Required"
        });
      case photo && photo.size > 1000000:
        return res.status(500).send({
          error: "photo is Required and should be less then 1mb"
        });
      case !countRooms:
        return res.status(500).send({
          error: "countRooms is Required"
        });
      case !totalSpace:
        return res.status(500).send({
          error: "totalSpace is Required"
        });
      case !kitchenArea:
        return res.status(500).send({
          error: "kitchenArea is Required"
        });
      case !livingArea:
        return res.status(500).send({
          error: "livingArea is Required"
        });
      case !floor:
        return res.status(500).send({
          error: "floor is Required"
        });
      case !countFloor:
        return res.status(500).send({
          error: "countFloor is Required"
        });          
    }

    const products = new catalogModels({
      ...req.fields,
      slug: slugify(name),
      user: req.user
    });
    if(photo) {
      products.photo.data = fs.readFileSync(photo.path)
      products.photo.contentType = photo.type;
    }
    await products.save()
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing product",
    });
  }
} 

// All User Products
export const allUserProductController = async (req, res) => {
  try {
    const products = await catalogModels
      .find({ user: req.user._id })
      .populate("user")
      .populate("category")
      .select("-photo")
      .sort({_id: -1});
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting user products",
      error: error.message,
    });
  }
} 

// All Products
export const allProductController = async (req, res) => {
  try {
    const products = await catalogModels
      .find({})
      .populate("user")
      .populate("category")
      .select("-photo")
      .sort({_id: -1})
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "AllProducts ",
      products
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
} 

// Single Product
export const singleProductController = async (req, res) => {
  try {
    const product = await catalogModels
      .findOneAndUpdate(
        { 
          slug: req.params.slug 
        },
        {
          $inc: { viewsCount: 1 },
        }
      )
      .select("-photo")
      .populate("user")
      .populate("category")
      .exec()
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
}

// Get Photo
export const photoProductController = async (req, res) => {
  try {
    const product = await catalogModels.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
}

//Delete Product
export const deleteProductController = async (req, res) => {
  try {
    await catalogModels.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

// Update Product
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, address, category, countRooms, totalSpace, kitchenArea, livingArea, floor, countFloor } = req.fields;
    const { photo } = req.files;
    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !address:
        return res.status(500).send({ error: "address is Required" });
      case !countRooms:
        return res.status(500).send({ error: "countRooms is Required" });
      case !totalSpace:
        return res.status(500).send({ error: "totalSpace is Required" });
      case !kitchenArea:
        return res.status(500).send({ error: "kitchenArea is Required" });
      case !livingArea:
        return res.status(500).send({ error: "livingArea is Required" });
      case !floor:
        return res.status(500).send({ error: "floor is Required" });       
      case !countFloor:
        return res.status(500).send({ error: "countFloor is Required" });          
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await catalogModels.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Update product",
    });
  }
};

// Filter product
export const productFiltersController = async (req, res) => {
  try {
    const {checked, radio} = req.body
    let args ={}
    if (checked.length > 0) args.category = checked
    const products = await catalogModels.find(args).populate("user")
    res.status(200).send({
      success: true,
      products
    });
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      error,
      message: "Error while filtering Products",
    });
  }
}

export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({ category: cid, _id: { $ne: pid }, })
      .select("-photo").limit(3)
      .populate("category")
      .populate("user");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
    });
  }
}

// Search Product
export const searchProductController = async (req, res) => {
  try {
    const {keyword} = req.params
    const results = await categoryModels.find({
      $or: [
        { name: { $regex: keyword, $options: "i"} },
        { description: { $regex: keyword, $options: "i"} }
      ]
    }).select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      error,
      message: "Error in Search Product",
    });
  }
}