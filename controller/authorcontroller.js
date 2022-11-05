const express = require("express");
const validator = require("validator");
const { Author, Blog } = require("../models/schema");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const isValidObjectId = function (id) {
    return mongoose.isValidObjectId(id);
}

const isValidRequest = function (obj) {
    return Object.keys(obj).length > 0;
}


// function for creating author
const createAuthor = async function (req, res) {
    try {
        const data = req.body;
        console.log(data);
        const { fname, lname, title, email, password } = data;

        const Authoravail = await Author.find({ email: data.email });

        if (Authoravail.length != 0) {
            return res.status(400).send({
                message: "user already exists , please login"
            });
        }

        if (fname.length < 2) {
            return res.status(400).send({
                message: "invalid name length must be bigger than 2"
            });
        }

        if (lname.length < 2) {
            return res.status(400).send({
                message: "invalid name length must be bigger than 2"
            });
        }

        if (!["Mr", "Mrs", "miss"].includes(title)) {
            return res.status(400).send({
                message: "invalid title .. must be Mr , Mrs , or Miss"
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).send({
                message: "invalid email given"
            });
        }
        if (!password.length > 5) {
            return res.status(400).send({
                message: "password length must be greater than 5"
            });
        }

        const hashed = await bcrypt.hash(data.password, 10);
        data.password = hashed;

        const userdata = await Author.create(data);
        return res.status(201).send({
            message: "author created successfully",
            data: userdata
        });

    }
    catch (error) {
        return res.status(500).send(error);
    }
};


//for authentication :-

const authenticateuser = async function (req, res) {
    try {

        if (!isValidRequest(req.body)) {
            return res.status(400).send({
                status: false,
                message: "provide valid credentials"
            })
        };

        const data = req.body;
        let { email, password } = data;

        const userdata = await Author.findOne({ email });

        if (!userdata) {
            return res.status(400).send({
                message: "invalid credentials"
            });
        };


        if (! await bcrypt.compare(password, userdata.password)) {
            return res.status(203).send({
                message: "invalid email or password entered"
            });
        };

        const token = jwt.sign({ email }, process.env.SECRET_KEY);

        res.setHeader("x-api-token", token);

        return res.status(201).send({
            message: "user authentication successful",
            data: token
        });

    }
    catch (error) {
        res.status(500).send(error);
    }
}


const getAuthorData = async function (req, res) {
    try {
        const authors = await Author.find();

        return res.status(201).send({
            message: "data fetched successfully",
            data: authors
        });

    } catch (error) {
        res.send(error);
    }


}

module.exports.createAuthor = createAuthor;
module.exports.authenticateuser = authenticateuser;
module.exports.getAuthorData = getAuthorData;
