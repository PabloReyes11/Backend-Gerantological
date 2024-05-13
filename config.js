const config = {
    application: {
        cors: {
            server: [
                {
                    origin: "127.0.0.1:4000", //servidor que deseas que consuma o (*) en caso que sea acceso libre
                    credentials: true
                }
            ]
        }
}
}