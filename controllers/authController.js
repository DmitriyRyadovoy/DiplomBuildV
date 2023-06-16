import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import fs from "fs";

export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validations
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }

    // Check user
    const exisitingUser = await userModel.findOne({ email });
    // Exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    // Register user
    const hashedPassword = await hashPassword(password);

    // Save
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in Registeration",
      error,
    });
  }
};

// POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel
      .findOne({ email })
      .exec()
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // Token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        surname: user.surname,
        patronymic: user.patronymic,
        age: user.age,
        phone: user.phone,
        catalog: user.catalog
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// Forgot Password
 /* export const forgotPasswordController = async (req, res) => {
  try{
    const {email, answer, newPassword} = req.body
    if(!email) {
      res.status(400).send({
        message: 'Email is required'
      })
    }
    if(!answer) {
      res.status(400).send({
        message: 'Answer is required'
      })
    }
    if(!newPassword) {
      res.status(400).send({
        message: 'New Password is required'
      })
    }

    // Check
    const user = await userModel.findOne({
      email,
      answer
    })

    // Vallidation
    if(!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      })
    }
    const hashed =  await hashPassword(newPassword)
    await userModel.findByIdAndUpdate(user._id, {password: hashed})
    res.status(200).send({
      success: false,
      message: 'Password Reset Successfully'
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Something wend wrong",
      error,
    })
  }
};
 */
// Test routes
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

// Get Photo
export const photoUserController = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.pid).select("photo");
    if (user.photo.data) {
      res.set("Content-type", user.photo.contentType);
      return res.status(200).send(user.photo.data);
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

// Update photo profile
export const updatePhotoProfileController = async (req, res) => {
  try {
    const { photo } = req.files;
    const userPhoto = await userModel.findByIdAndUpdate(
      req.user._id,
      { new: true }
    );
    if (photo) {
      userPhoto.photo.data = fs.readFileSync(photo.path);
      userPhoto.photo.contentType = photo.type;
    }
    await userPhoto.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      userPhoto,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Update Profile",
    });
  }
}

// Update prfole
export const updateProfileController = async (req, res) => {
  try {
    const { patronymic, surname, age, name, email, phone, password} = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        surname: surname || user.surname,
        age: age || user.age,
        email: email || user.email,
        patronymic: patronymic || user.patronymic,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

// Get all users
export const allUserController  = async (req, res) => {
  try {
    const users = await userModel.find({}).sort({_id: -1})
    res.status(200).send({
      success: true,
      message: "AllUsers ",
      users
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting users",
      error: error.message,
    })
  }
}

// Single User
export const singleUserController = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.pid);
    res.status(200).send({
      success: true,
      message: "Single User Fetched",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single User",
      error,
    });
  }
}

// Delete User
export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    await userModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "User Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting user",
      error,
    });
  }
};