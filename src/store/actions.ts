import axios from 'axios'
import { ActionContext, ActionTree } from 'vuex'
import { Mutations, MutationType } from './mutations'
import { Post, State, User } from './state'

export enum ActionTypes {
    LogIn = 'LOG_IN',
    LogOut = 'LOG_OUT',
    Register = 'REGISTER',
    GetPosts = 'GET_POSTS',
    CreatePost = 'CREATE_POST',
    DeletePost = 'DELETE_POST',
}

type ActionAugments = Omit<ActionContext<State, State>, 'commit'> & {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1]
    ): ReturnType<Mutations[K]>;
}


export type Actions = {
    [ActionTypes.LogIn](context: ActionAugments, data: { [key: string]: string }): void;
    [ActionTypes.Register](context: ActionAugments, data: { [key: string]: string }): void;
    [ActionTypes.CreatePost](context: ActionAugments, data: Post): void;
    [ActionTypes.DeletePost](context: ActionAugments, data: number): void;
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
    async [ActionTypes.DeletePost]({ dispatch }, id: number) {
        // 
        try {
            const { data } = await axios.delete<string, { data: Post }>('/api/post', { data: JSON.stringify({ id }) })
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