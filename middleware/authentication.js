const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Author, Blog } = require("../models/schema");

const authentication = async function (req, res, next) {
    try {
        const token = req.header("x-api-token");

        if (!token) {
            return res.status(400).send({
                message: "token not found"
            })
        };

        const untokeniseddata = jwt.verify(token, process.env.SECRET_KEY);


        if (!untokeniseddata) {
            return res.status(400).send({
                message: "token invalid"
            })
        };

        const userdata = await Author.find({ email: untokeniseddata.email });

        if (userdata) {
            next();
        } else {
            return res.status(400).send({
                message: "authorisation failed"
            })
        }
    }
    catch (error) {
        res.status(500).send(error);
    }
}


const creationauthorisation = async function (req, res, next) {

    try {
        const data = req.body;

        const authorid = data.authorId;

        const userdata = await Author.findById(authorid);

        if (!userdata) {
            return res.status(403).send({
                message: "author not found or invalid authorid"
            });
        };

        const creationuser = userdata.email;


        const token = req.header("x-api-token");

        if (!token) {
            return res.status(400).send({
                message: "authorisation failed as invalid token"
            })
        };

        const usersignedin = jwt.verify(token, process.env.SECRET_KEY);


        if (usersignedin.email === creationuser) {
            next();
        } else {
            return res.status(403).send({ status: false, msg: "author logged in is not allowed to modify or access the author data" });
        };
    }
    catch (error) {
        res.status(500).send(error);
    }
}


const deletionAndUpdateAuthorisation = async function (req, res, next) {

    try {
        const blogid = req.params.blogid;

        const data = await Blog.findById(blogid);

        if (!data) {
            return res.status(403).send({
                message: "no such blog found"
            })
        }


        const authorid = data.authorId;

        const userdata = await Author.findById(authorid);

        if (!userdata) {
            return res.status(403).send({
                message: "author not found or invalid authorid"
            });
        };

        const creationuser = userdata.email;

        const token = req.header("x-api-token");

        if (!token) {
            return res.status(400).send({
                message: "authorisation failed as invalid token"
            })
        };

        const usersignedin = jwt.verify(token, process.env.SECRET_KEY);


        if (usersignedin.email === creationuser) {
            next();
        } else {
            return res.status(403).send({ status: false, msg: "author logged in is not allowed to modify or access the author data" });
        };
    }
    catch (error) {
        res.status(500).send(error);
    }
}


const deletionauthorisation = async function (req, res, next) {
    try {
        const filter = {};

        const { authorId, category, tags, subcategory } = req.query;
        const token = req.header("x-api-token");

        if (authorId) {
            filter["authorId"] = authorId;

            const userwanttodelete = await Author.find({ authorId });

            const useremail = userwanttodelete.email;


            const untokeniseddata = jwt.verify(token, process.env.SECRET_KEY);

            const loggedinuser = untokeniseddata.email;

            if (loggedinuser === useremail) {
                next();
            }
            else {
                return res.status(403).send({ status: false, msg: "author logged in is not allowed to modify or access the author data" });
            }
        }
        else {
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

            if (blogsfound) {
                const authorid = blogsfound[0].authorId;
                const userwanttodelete = await Author.findById(authorid);

                const useremail = userwanttodelete.email;

                const untokeniseddata = jwt.verify(token, process.env.SECRET_KEY);

                const loggedinuser = untokeniseddata.email;

                if (loggedinuser === useremail) {
                    next();
                }
                else {
                    return res.status(403).send({ status: false, msg: "author logged in is not allowed to modify or access the author data" });
                }

            }
        }
    }
    catch (error) {
        res.status(500).send(error);
    }
}

module.exports.authentication = authentication;
module.exports.creationauthorisation = creationauthorisation;
module.exports.deletionauthorisation = deletionauthorisation;
module.exports.deletionAndUpdateAuthorisation = deletionAndUpdateAuthorisation;