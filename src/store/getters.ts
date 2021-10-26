// store/getters.ts
import { GetterTree } from 'vuex'
import { State, Post, User } from './state'

export type Getters = {
    isAuthenticated(state: State): boolean
}

export const getters: GetterTree<State, State> & Getters = {
    isAuthenticated(state) {
        return !!state.user
    },
}