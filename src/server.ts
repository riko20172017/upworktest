import { createServer, Model } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
    let server = createServer({
        seeds(server) {
            server.db.loadData({
                users: [
                    { email: "x@example.com", password: "test" },
                    { email: "y@example.com", password: "test" },
                    { email: "z@example.com", password: "test" },
                ],
                posts: [
                    { id: 1, title: "Title lorem ipsum", content: "Content lorem ipsum" },
                    { id: 2, title: "Title lorem ipsum", content: "Content lorem ipsum" },
                    { id: 3, title: "Title lorem ipsum", content: "Content lorem ipsum" }
                ]
            })
        },
        environment,
        routes() {
            this.namespace = "api"

            this.post("/login", (schema, request) => {
                let { email, password } = JSON.parse(request.requestBody)
                let user = schema.db.users.filter((item) => item.email == email && item.password == password)
                return user.length > 0 ? { isOk: true } : { isOk: false }
            })
        },
    });

    return server;
}