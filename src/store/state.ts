// /store/state.ts
export type Post = {
    id: number;
    title: string;
    content: string;
};
export type User = {
    email: string;
};
export type State = {
    user: User | null;
    posts: Post[];
};
export const state: State = {
    user: null,
    posts: []
};