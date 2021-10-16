(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return factory(window)
        });
    }
    else if (typeof module === 'object' && module.exports) {
        let wnd = {
            config: {},
            File: {}
        }
        module.exports = factory(wnd);
    }
    else {
        root.returnExports = factory(window);
    }
}(typeof self !== 'undefined' ? self : this, function(wnd) {
    const CoCreateMessage = {
        socket: null,
        setSocket: function(socket) {
            this.socket = socket;
        },

        /*
        CoCreate.message.send({
           namespace: '',
           room: '',
           broadcast: true/false,
           broadcast_sender: true/false
           
           rooms: [r1, r2],
           emit: {
             message': 'nice game',
             data': 'let's play a game ....'
           }
         })
        */
        send: function(data) {
            let request_data = this.socket.getCommonParams();

            if (!data || !data.emit) {
                return;
            }
            request_data = { ...request_data, ...data }

            /** socket parameters **/
            // if (data['broadcast'] === undefined) {
            //   request_data['broadcast'] = true;
            // }
            // if (data['broadcast_sender'] === undefined) {
            //   request_data['broadcast_sender'] = true;
            // }
            const room = this.socket.generateSocketClient(data.namespace, data.room);

            this.socket.send('sendMessage', request_data, room)
        },


        createSocket: function(host, namespace) {
            if (!this.socket) return;

            if (namespace) {
                this.socket.create({
                    namespace: namespace,
                    room: null,
                    host: host
                });
                this.socket.setGlobalScope(namespace);
            }
            else {
                this.socket.create({
                    namespace: null,
                    room: null,
                    host: host
                });
            }
        },

        listen: function(message, fun) {
            if (!this.socket)
                this.setSocket()   
            this.socket.listen(message, fun);
        },

        listenAsync: function(eventname) {
            return this.socket.listenAsync(eventname);
        },
    }

    return CoCreateMessage;

}));
