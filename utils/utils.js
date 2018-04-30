const mongoose = require('mongoose');
const _ = require('lodash');

const User = mongoose.model('User');

const pickedInfo = ['_id', 'firstName','lastName', 'email', 'phoneNumber', 'city', 'country', 'trips' ];

class Utils {
    static sanitizeUser(user) {
        if (user instanceof User) {
            user = user.toObject();
        }
        user = _.pick(user, pickedInfo);
        return user;
    }
}

module.exports = Utils;