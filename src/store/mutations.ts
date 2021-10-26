import { MutationTree } from 'vuex'
import { State, User, Post } from './state'

export enum MutationType {
    SetUser = 'SET_USER',
    SetPosts = 'SET_POSTS',
    LogOut = 'LOG_OUT'
}

export type Mutations = {
    [MutationType.SetUser](state: State, user: User): void
    [MutationType.SetPosts](state: State, posts: Post[]): void
    [MutationType.LogOut](state: State): void
}

export const mutations: MutationTree<State> & Mutations = {
    [MutationType.SetUser](state, user) {
        state.user = user
    },
    [MutationType.SetPosts](state, posts) {
        state.posts = posts
    },
    [MutationType.LogOut](state) {
        state.user = null
    }
}