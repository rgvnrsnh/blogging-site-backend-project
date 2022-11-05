const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema(
    {
        fname: {
            type: String,
            required: true,
            trim: true,
            minlength:2
        
        },
        lname: {
            type: String,
            required: true,
            trim: true,
            minlength:1
        },
        title: {
            type: String,
            required: true,
            enum: ["Mr", "Mrs", "Miss"]
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength:5
        }
    }
);


const BlogSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        authorId: {
            type: String,
            required: true,
        },
        tags: [{
            type: String,
        }],
        category: [{
            type: String,
            required: true,
        }],
        subcategory: [{
            type: String,
        }],
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        updatedAt: {
            type: Date,
        },
        deletedAt: {
            type: Date,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        publishedAt: {
            type: Date,
        },
        isPublished: {
            type: Boolean,
            default: false,
        }
    }
);

const Author = new mongoose.model("Author", AuthorSchema);
const Blog = new mongoose.model("Blog", BlogSchema);


module.exports = { Author, Blog };