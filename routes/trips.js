const path = require('path');
const Boom = require('boom');
const mongoose = require('mongoose');
const joi = require('joi');
const _ = require('lodash');
var assert = require('assert');
const User = mongoose.model('User');

const TripInfoSchema = require(path.resolve('models/trip_info_schema'));
const TripInfo = mongoose.model('TripInfo', TripInfoSchema);

var datetime = require('node-datetime');

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
        method: 'GET',
        path: '/trips/search',
        config: {
        
           // auth: 'jwt',

            validate: {
                query: {
                    weight: joi.number().required(),
                    fromLocation: joi.string().required(),
                    fromDate: joi.number().integer().required(),
                    toLocation: joi.string().required(),
                    toDate: joi.number().integer().required()
                }
            }
        },
        
        handler: async function (request, h) {
       
            allTrips = [];

            const tripsme = await User.find({}, {trips:1} ).exec();

            //var currentTime = datetime.now();
            
            for (let trip of tripsme) {

                allTrips.push(trip.trips);

            }

            tripMe = []

            for (let trip of allTrips) {

                for (let myTrip of trip) {

                    if(myTrip.weight >= request.query.weight && myTrip.from_location == request.query.fromLocation
                        && myTrip.to_location == request.query.toLocation && myTrip.to_date <= request.query.toDate){
              
                        tripMe.push(myTrip);

                    }

                }

            }

            return tripMe;
            
        }
    },


    {
        method: 'POST',
        path: '/trips',
        config: {

            auth: 'jwt',
            
            validate: {
                payload: {
  
                    weight: joi.number().required(),
                    from_location:  joi.string().required(),
                    from_date:  joi.number().integer().required(), 
                    to_location:  joi.string().required(),
                    to_date:  joi.number().integer().required(),
                    observations: joi.string().required(),
                    capacity_volume:  joi.string().required(),
                    transport: joi.string().required()
                }
            }
        },
        handler: async function (request, h) {
            const loggedInUser = request.user;


            const tripInfo = new TripInfo(request.payload);
            tripInfo.email = loggedInUser.email;
            loggedInUser.trips.push(tripInfo);

            try {
                const modifiedUser = await loggedInUser.save();
                return modifiedUser;
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



