const Dev = require('../models/dev');

module.exports = {
    async store(req, res) {
        console.log(req.io, req.connectedUsers);

        const { user } = req.headers;
        const { devID } = req.params;

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devID);

        if (!targetDev) {
            return res.status(400).json({ error: 'Dev not exists' });
        }

        if (targetDev.likes.includes(loggedDev._id)) {
            const loggedSocket = req.connectedUsers[user];
            const targetSocket = req.connectedUsers[devID];

            if (loggedSocket) {
                req.io.to(loggedSocket).emit('match', targetDev);
            }

            if (targetSocket) {
                req.io.to(targetSocket).emit('match', loggedDev);
            }
        }

        loggedDev.likes.push(targetDev._id);

        await loggedDev.save();

        return res.json({ loggedDev });

    }
}