import commentModels from "../models/comment.models.js";

// Create Comments
export const createCommentController = async (req, res) => {
  try {
    const { title, userId, productId, slug } = req.body;

    const comments = new commentModels({
      title: title,
      slug: slug,
      userId: userId,
      productId: productId
    });
    await comments.save()
    return res.status(201).send({
      success: true,
      message: "Comment Created Successfully",
      comments,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing comment",
    });
  }
}

// Get comments
export const getCommentsController = async (req, res) => {
  try {
    const {slug} = req.query
    const comments = await commentModels.find({slug: slug}).populate("userId").sort({_id: -1})
    return res.json(comments)
  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      message: "Fail load comments",
    })
  }
}