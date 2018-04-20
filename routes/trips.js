const path = require('path');
const Boom = require('boom');
const mongoose = require('mongoose');
const joi = require('joi');
const _ = require('lodash');

const User = mongoose.model('User');
const TripInfoSchema = require(path.resolve('models/trip_info_schema'));
const TripInfo = mongoose.model('TripInfo', TripInfoSchema);

const endpoints = [

    {
        method: 'GET',
        path: '/trips',
        config: {
            auth: 'jwt'
        },
        handler: async function (request, h) {
            const loggedInUser = request.user;
            return loggedInUser.trips;
        }
    },

    {
        method: 'POST',
        path: '/trips',
        config: {
         auth: 'jwt',
            validate: {
                payload: {
  
                    weight: joi.string().required(),
                    from_location:  joi.string().required(),
                    from_date:  joi.string().required(), 
                    to_location:  joi.string().required(),
                    to_date:  joi.string().required(),
                    observations: joi.string().required(),
                    capacity_volume:  joi.string().required(),
                    transport: joi.string().required()
                }
            }
        },
        handler: async function (request, h) {
            const loggedInUser = request.user;
            const tripInfo = new TripInfo(request.payload);
            loggedInUser.trips.push(tripInfo);
            try {
                const modifiedUser = await loggedInUser.save();
                return modifiedUser.trips;
            } catch (e) {
                return Boom.badRequest(e.message);
            }
        }
    },

    {
        method: 'DELETE',
        path: '/trips/{tripId}',
        config: {
            auth: 'jwt',
            validate: {
                params: {
                    tripId: joi.string().required()
                }
            }
        },
        handler: async function (request, h) {
            const loggedInUser = request.user;
            const tripIndex = _.findIndex(loggedInUser.trips, function (currentTrip) {
                return (currentTrip._id.toString() === request.params.tripId);
            });
            if (tripIndex === -1) {
                return Boom.badRequest('The trip you are trying to delete cannot be found');
            }
            loggedInUser.trips.splice(tripIndex, 1);
            try {
                const modifiedUser = await loggedInUser.save();
                return modifiedUser.trips;
            } catch (e) {
                return Boom.badRequest(e.message);
            }
        }
    }
];

module.exports = endpoints;