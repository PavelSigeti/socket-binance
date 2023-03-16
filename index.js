import wsx from './wsx.js';
import data from './data.json' assert { type: "json" };
import {Server} from 'socket.io';
import limits from './limits.js';


const io = new Server({
    cors: {
        origin: '*',
    }
  });

const current = {};


const stream = wsx;
stream.init([...data.data]);

io.on("connection", (socket) => {

    stream.ontrades = (d) => {
        if(!current[d.symbol]) current[d.symbol] = 0;
        current[d.symbol]++;
        if(limits[d.symbol] < current[d.symbol]) {
            current[d.symbol] = 0;
            const data = JSON.stringify(d);
            io.emit('data', data);
        } else if(!limits[d.symbol] && current[d.symbol] > 12) {
            current[d.symbol] = 0;
            const data = JSON.stringify(d);
            io.emit('data', data);
        }
    };
});


io.listen(8000);