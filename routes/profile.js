const path = require('path');
const Utils = require(path.resolve('./utils/utils'));
const joi = require('joi');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const endpoints = [

    {
        method: 'GET',
        path: '/profile',
        config: {
            auth: 'jwt'
        },
        handler: async function (req, h) {
            return Utils.sanitizeUser(req.user);
        }
    },

    {
        method: 'GET',
        path: '/profile/search',
        config: {
            auth: 'jwt',
        
            validate: {

             query: {
                    email: joi.string().required()
                }
            }
        },
        handler: async function (req, h) {
            
            const user = await User.findOne({
                email: req.query.email
            }).exec();
            if (!user) {
                return Boom.badRequest('bad email');
            }

            return Utils.sanitizeUser(req.user);

        }
    }

];

module.exports = endpoints;