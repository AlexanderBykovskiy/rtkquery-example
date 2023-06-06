import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { IRepoList, typeResponseServer, typeUser } from '../../models/models';

export const githubApi = createApi({
    reducerPath: 'github/api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.github.com/'
    }),
    refetchOnFocus: true,
    endpoints: build => ({
        searchUsers: build.query<typeUser[], string>({
            query: (search: string) => ({
                url: `search/users`,
                params: {
                    q: search,
                    per_page: 5
                },
            }),
            transformResponse: (response: typeResponseServer<typeUser>) => response.items
        }),
        getUserRepos: build.query<IRepoList, string>({
            query: ( userName: string ) => ({
                url: `users/${userName}/repos`,
            })
        })
    }),
});
