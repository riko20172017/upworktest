import axios from 'axios'
import { ActionContext, ActionTree } from 'vuex'
import { Mutations, MutationType } from './mutations'
import { Post, State, User } from './state'

export type FormData = {
    email: string,
    password: string
}

export type RegisterData = {
    firstName: string,
    lastName: string
}

export enum ActionTypes {
    LogIn = 'LOG_IN',
    Register = 'REGISTER',
    CreatePost = 'CREAT_POST',
    GetPosts = 'GET_POSTS',
    LogOut = 'LOG_OUT'
}

type ActionAugments = Omit<ActionContext<State, State>, 'commit'> & {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1]
    ): ReturnType<Mutations[K]>;
}


export type Actions = {
    [ActionTypes.LogIn](context: ActionAugments, data: FormData): void;
    [ActionTypes.Register](context: ActionAugments, data: FormData & RegisterData): void;
    [ActionTypes.CreatePost](context: ActionAugments, data: Post): void;
    [ActionTypes.GetPosts](context: ActionAugments): void;
    [ActionTypes.LogOut](context: ActionAugments): void;

}

export const actions: ActionTree<State, State> & Actions = {
    async [ActionTypes.GetPosts]({ commit }) {
        // 
        try {
            const { data } = await axios.get<string, { data: Post[] }>('/api/posts')
            commit(MutationType.SetPosts, { ...data })
        } catch (e: any) {
            if (e.response.status === 422) {
                throw e.response.data.errors
            } else {
                console.log(e);
            }
        }
    },
    async [ActionTypes.LogIn]({ commit }, loginData) {
        // 
        try {
            const { data } = await axios.post<string, { data: User }>('/api/login', JSON.stringify(loginData))
            commit(MutationType.SetUser, { ...data })
        } catch (e: any) {
            if (e.response.status === 422) {
                throw e.response.data.errors
            } else {
                console.log(e);
            }
        }
    },
    async [ActionTypes.Register]({ dispatch }, signUpData) {
        // 
        try {
            const { data } = await axios.post<string, { data: User }>('/api/signup', JSON.stringify(signUpData))
            await dispatch(ActionTypes.LogIn, signUpData)
        } catch (e: any) {
            if (e.response.status === 422) {
                throw e.response.data.errors
            } else {
                console.log(e);
            }
        }
    },
    async [ActionTypes.CreatePost]({ dispatch }, postData) {
        // 
        try {
            const { data } = await axios.put<string, { data: Post }>('/api/post', JSON.stringify(postData))
            await dispatch(ActionTypes.GetPosts)
        } catch (e: any) {
            if (e.response.status === 422) {
                throw e.response.data.errors
            } else {
                console.log(e);
            }
        }
    },
    async [ActionTypes.LogOut]({ commit }) {
        commit(MutationType.LogOut, undefined)
    }
}