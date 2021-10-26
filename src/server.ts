import { createServer, Model, Response } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
    let server = createServer({
        seeds(server) {
            server.db.loadData({
                users: [
                    { email: "x@example.com", password: "test", firstName: "", lastName: "" },
                    { email: "y@example.com", password: "test", firstName: "", lastName: "" },
                    { email: "z@example.com", password: "test", firstName: "", lastName: "" },
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
                return user.length > 0
                    ? new Response(200, {}, { ...user.pop() })
                    : new Response(422, {}, {
                        errors: [
                            { name: "email", message: "Login or password is incorrect" },
                            { name: "password", message: "Login or password is incorrect" }
                        ]
                    })
            })
            this.post("/signup", (schema, request) => {
                let { email, password, lastName, firstName } = JSON.parse(request.requestBody)
                let user = schema.db.users.insert({ email, password, firstName, lastName })
                return user.id > 0
                    ? { isOk: true }
                    : {
                        isOk: false, messages: []
                    }
            })
            this.get("/posts", (schema, request) => {
                return schema.db.posts
            })
            this.delete("/post", (schema, request) => {
                let { id } = JSON.parse(request.requestBody)
                schema.db.posts.remove({ id })
                return { id }
            })
            this.put("/post", (schema, request) => {
                let { title, content } = JSON.parse(request.requestBody)
                let post = schema.db.posts.insert({ title, content })
                return post.id
                    ? { isOk: true, post }
                    : {
                        isOk: false, messages: []
                    }
            })
        },
    });

    return server;
}