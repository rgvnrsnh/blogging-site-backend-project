require('dotenv').config();
const express = require("express");
const { Author, Blog } = require("../models/schema");
const authorController = require("../controller/authorcontroller");
const blogController = require("../controller/blogcontroller");
const midware = require("../middleware/authentication");

const router = new express.Router();

router.get("/", (req, res) => {
    res.send("hello there server started");
});



// creating new author
router.post("/authors", authorController.createAuthor);

// author login
router.post("/login", authorController.authenticateuser);

// get all author data 
router.get("/authors", authorController.getAuthorData);

// create blog
router.post("/blogs", midware.authentication, midware.creationauthorisation, blogController.createBlog);

// delete blogbyid
router.delete("/blogs/:blogid", midware.authentication, midware.deletionAndUpdateAuthorisation, blogController.deleteBlogById);

// update blogbyid
router.patch("/blogs/:blogid", midware.authentication, midware.deletionAndUpdateAuthorisation, blogController.updateBlogById);

// get blog by queries
router.get("/blogs", midware.authentication, blogController.getBlogByQueries);

//delete blog by queries
router.delete("/blogs", midware.authentication, midware.deletionauthorisation, blogController.deleteBlogByQueries);

//delete blog by id
router.delete("/blogsdelete/:blogid", midware.authentication, midware.deletionAndUpdateAuthorisation, blogController.permanentlydeletedBlogById);

module.exports = router;