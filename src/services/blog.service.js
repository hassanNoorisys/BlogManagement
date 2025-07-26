import constants from "../config/constants.js"
import blogModel from "../models/blog.model.js"
import userModel from "../models/user.model.js"
import AppError from "../utils/appError.js"

// create blog service
const createBlogService = async (data) => {

    const { title, content, images, userId, role, slug } = data

    const existingUser = await userModel.findOne({ _id: userId }).select(['_id'])
    if (!existingUser) throw new AppError(constants.SERVER_ERROR, 'Something went wrong')

    const user = role === 'admin' ? { admin: userId } : { author: userId }

    const newBlog = new blogModel({ title, content, images, slug, ...user })
    await newBlog.save()

    return title
}

export { createBlogService }