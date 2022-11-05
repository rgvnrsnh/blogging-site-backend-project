const validator = require("validator");
const { Author, Blog } = require("../models/schema");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const createBlog = async function (req, res) {
    try {
        const data = req.body;
        const { title, body, authorId, category, subcategory } = data;


        if (!mongoose.isValidObjectId(authorId)) {
            return res.status(400).send({
                message: "invalid authorid"
            });
        };


        const author = await Author.findById(authorId);

        if (!author) {
            return res.status(401).send({
                message: "invalid user"
            })
        };

        if (title.length < 1) {
            return res.status(401).send({ status: false, message: "invalid title" });
        };

        if (body.length < 3) {
            return res.status(401).send({ status: false, message: "write atleast 3 words" });
        };

        if (data.ispublished) {
            data.publishedAt = Date.now();
        }

        if (await Blog.exists(data)) {
            return res.status(400).send({
                message: "blog already exists"
            });
        };

        const createdblog = await Blog.create(data);
        return res.status(201).send({
            message: "blog created sucessfully",
            data: createdblog
        });
    }
    catch (error) {
        res.status(500).send(error);
    }

};

const deleteBlogById = async function (req, res) {

    try {

        const Blogid = req.params.blogid;

        if (!mongoose.isValidObjectId(Blogid)) {
            return res.status(403).send({
                message: "invalid blogid provided"
            })
        }

        const blogdata = await Blog.findById(Blogid);

        if (!blogdata) {
            return res.status(400).send({
                message: "no such blog found"
            });
        };

        blogdata.isDeleted = true;
        blogdata.deletedAt = Date.now();

        const updateddata = await blogdata.save();

        return res.status(201).send({
            message: "blog deleted successfully",
            data: blogdata
        });

    }
    catch (error) {
        res.status(500).send(error);
    }
}


const updateBlogById = async function (req, res) {

    try {

        const Blogid = req.params.blogid;

        const datatoupdate = req.body;

        if (!mongoose.isValidObjectId(Blogid)) {
            return res.status(403).send({
                message: "invalid blogid provided"
            });
        };

        const blogdata = await Blog.findById(Blogid);

        if (!blogdata) {
            return res.status(400).send({
                message: "no such blog found"
            });
        };

        if (blogdata.isDeleted === true) {
            return res.status(403).send({
                message: "this blog is already deleted"
            });
        };

        if (datatoupdate.title) { blogdata.title = datatoupdate.title };
        if (datatoupdate.body) { blogdata.body = datatoupdate.body };
        if (datatoupdate.category) { blogdata.category = [...blogdata.category, ...datatoupdate.category] };
        if (datatoupdate.subcategory) { blogdata.subcategory = [...blogdata.subcategory, ...datatoupdate.subcategory] };
        if (!blogdata.isPublished) {
            blogdata.isPublished = true;
            blogdata.publishedAt = Date.now();
        }

        const updateddata = await blogdata.save();

        return res.status(201).send({
            message: "blog updated successfully",
            data: blogdata
        });

    }
    catch (error) {
        res.status(500).send(error);
    }
}



const getBlogByQueries = async function (req, res) {
    try {
        const filter = {
            isPublished: true,
            isDeleted: false
        };

        const { authorId, category, tags, subcategory } = req.query;

        if (authorId) {
            filter["authorId"] = authorId;
        }

        if (category) {
            filter["category"] = category;
        }

        if (tags) {
            filter["tags"] = tags;
        }

        if (subcategory) {
            filter["subcategory"] = subcategory;
        }

        const blogsfound = await Blog.find(filter);

        if (blogsfound.length > 0) {
            return res.status(201).send({
                message: "blogs with these queries are given below",
                blogs: blogsfound
            });
        }
        else {
            return res.status(203).send({
                message: "no such blog found"
            });
        };

    }
    catch (error) {
        res.status(500).send(error);
    }
}


const permanentlydeletedBlogById = async function (req, res) {
    try {
        const blogid = req.params.blogid;

        if (!mongoose.isValidObjectId(blogid)) {
            return res.status(403).send({
                message: "wrong blogid provided"
            });
        };

        const blogdata = await Blog.findByIdAndDelete(blogid);

        if (!blogdata) {
            return res.status(403).send({
                message: "no such blog found"
            });
        }

        return res.status(203).send({
            message: "blog found and deleted successfully",
            data: blogdata
        });
    }
    catch (error) {
        return res.send(error);
    }
}


const deleteBlogByQueries = async function (req, res) {
    try {
        const filter = {
            isPublished: false,
            isDeleted: true
        };

        const { authorId, category, tags, subcategory } = req.query;

        if (authorId) {
            filter["authorId"] = authorId;
        }

        if (category) {
            filter["category"] = category;
        }

        if (tags) {
            filter["tags"] = tags;
        }

        if (subcategory) {
            filter["subcategory"] = subcategory;
        }

        console.log(filter);
        const blogdata = await Blog.find(filter);

        if (blogdata.length === 0) {
            return res.status(203).send({
                message: "no such blog found"
            });
        };

        const deletedblog = await Blog.updateMany({ _id: { $in: blogdata } }, { $set: { isDeleted: true, deletedAt: Date.now(), isPublished: true } }, { new: true })

        return res.status(203).send({
            message: "blogs deleted successfully",
            deleteddata: [deletedblog]
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
}


module.exports.createBlog = createBlog;
module.exports.deleteBlogById = deleteBlogById;
module.exports.updateBlogById = updateBlogById;
module.exports.getBlogByQueries = getBlogByQueries;
module.exports.deleteBlogByQueries = deleteBlogByQueries;
module.exports.permanentlydeletedBlogById = permanentlydeletedBlogById;