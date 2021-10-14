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
                    { id: 3, title: "Title lorem ipsum", content: "Content lorem ipsum" },
                    { id: 4, title: "Title lorem ipsum", content: "Content lorem ipsum" },
                    { id: 5, title: "Title lorem ipsum", content: "Content lorem ipsum" },
                    { id: 6, title: "Title lorem ipsum", content: "Content lorem ipsum" },
                    { id: 7, title: "Title lorem ipsum", content: "Content lorem ipsum" },
                    { id: 8, title: "Title lorem ipsum", content: "Content lorem ipsum" },
                    { id: 9, title: "Title lorem ipsum", content: "Content lorem ipsum" },
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
            }),
                this.get("/posts", (schema, request) => {
                    return { posts: schema.db.posts }
                }),
                this.delete("/post", (schema, request) => {
                    let { id } = JSON.parse(request.requestBody)
                    schema.db.posts.remove({ id })
                    return { id }
                })
        },
    });

    return server;
}