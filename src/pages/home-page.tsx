import React, {useEffect, useState} from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useLazyGetUserReposQuery, useSearchUsersQuery } from '../store';
import {useActions} from "../hooks/actions";
import {useAppSelector} from "../hooks/redux";

export const HomePage: React.FC = () => {

    const [searchValue, setSearchValue] = useState('')

    const debounced = useDebounce(searchValue);

    const {data: users, isLoading, isError} = useSearchUsersQuery(debounced, {
        skip: debounced.length < 3,
        refetchOnFocus: true,
    });

    const [fetchRepos, {data: repos, isLoading: reposIsLoading}] = useLazyGetUserReposQuery()

    const [isShowPanel, setIsShowPanel] = useState(false);

    const onUserClick = (userName: string) => {
        fetchRepos(userName)
        setIsShowPanel(false)
    }

    const {favorite} = useAppSelector(state => state.github)

    useEffect(() => {
        setIsShowPanel(!!users?.length && debounced.length >= 3)
    }, [users, debounced])

    const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    const {addFavorite, removeFavorite} = useActions()

    const addToFavorite = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        e.preventDefault();
        if (favorite.includes(id)) {
            removeFavorite(id);
        } else {
            addFavorite(id);
        }

    }

    return(
        <div className="px-4 flex flex-col gap-2 justify-center items-center pb-10">

            {isError && <p className="mt-4 block bg-red-600 text-white rounded px-4 py-2">Unknown error.</p>}

            <form className="mt-4 flex flex-col w-full md:w-1/2 xl:w-1/3 relative" onSubmit={(e) => onSubmitForm(e)}>
                <input
                    className="relative flex-grow border rounded px-2 py-1"
                    type="text"
                    placeholder="Github user..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value) }
                />
                {/*
                <button className="rounded bg-gray-600 text-white px-4 py-1 hover:bg-gray-500" type="submit">Search</button>
                */}

                <div>
                    {isShowPanel && <div className="absolute flex flex-col bg-white border rounded overflow-hidden right-0 left-0 mt-1 shadow-md">
                        {isLoading
                            ? <div className="text-center text-sm">Loading...</div>
                            : users?.map((item, index) => <div
                                key={index}
                                onClick={() => onUserClick(item.login)}
                                className="cursor-pointer group hover:bg-gray-100 flex flex-col py-4 px-4 border-b last:border-b-0 transition-all duration-300"
                            >
                                <div className="flex gap-4 items-center">
                                    <div className="text-gray-600">{index + 1}</div>
                                    <div className="w-10 h-10 shrink-0 bg-gray-100 rounded-full text-gray-600 overflow-hidden border-gray-400 border-[2px]">
                                        {item.avatar_url && <img
                                            src={item.avatar_url}
                                            alt={item.login}
                                        />}
                                    </div>
                                    <div className="flex-grow">
                                        {item.login}
                                    </div>
                                    <a href={item.html_url} target="_blank" className="text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            </div>)
                        }
                    </div>
                    }
                </div>
            </form>

            <div className="flex flex-col gap-4 mt-4 w-full md:w-1/2 xl:w-1/3">
                {reposIsLoading
                    ? <div className="text-center">Loading...</div>
                    : repos && repos.length == 0
                        ? <div className="block bg-red-600 text-white rounded px-4 py-2">Repositories not found</div>
                        : repos?.map((item, index) => {
                            const crDate = new Date(item.created_at);
                            const upDate = new Date(item.updated_at);
                            return(
                                <div key={index} className="flex flex-col gap-4">
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-600 w-full">
                                        <div className="col-span-2">
                                            {item.language && <div className="text-[10px] font-medium py-0.5 px-1 bg-gray-500 text-white max-w-max rounded-sm">{item.language}</div>}
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex gap-2 items-center">
                                                <span className="text-lg">{item.name}</span>
                                                <span className="text-[10px] border text-gray-400 px-1.5 rounded-full uppercase">{item.visibility}</span>
                                            </div>
                                            <div className="text-xs text-gray-500">{item.description}</div>
                                        </div>
                                        <div className="flex gap-2">

                                            <div className="flex flex-col gap-2 w-full">
                                                <div className="flex gap-2">
                                                    <a href={item.clone_url} target="_blank" className="flex gap-1 items-center px-2 py-1 border border-green-600 rounded-full text-green-600 uppercase text-xs hover:bg-green-600 hover:text-white transition-all duration-300">
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                             className="icon icon-tabler icon-tabler-cloud-download w-4 h-4"
                                                             width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5"
                                                             stroke="currentColor" fill="none" strokeLinecap="round"
                                                             strokeLinejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                            <path
                                                                d="M19 18a3.5 3.5 0 0 0 0 -7h-1a5 4.5 0 0 0 -11 -2a4.6 4.4 0 0 0 -2.1 8.4"></path>
                                                            <path d="M12 13l0 9"></path>
                                                            <path d="M9 19l3 3l3 -3"></path>
                                                        </svg>
                                                        <span>clone</span>
                                                    </a>
                                                    <a href={item.downloads_url} target="_blank" className="flex gap-1 items-center px-2 py-1 border border-green-600 rounded-full text-green-600 uppercase text-xs hover:bg-green-600 hover:text-white transition-all duration-300">
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                             className="icon icon-tabler icon-tabler-download w-4 h-4"
                                                             width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5"
                                                             stroke="currentColor" fill="none" strokeLinecap="round"
                                                             strokeLinejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
                                                            <path d="M7 11l5 5l5 -5"></path>
                                                            <path d="M12 4l0 12"></path>
                                                        </svg>
                                                        <span>download</span>
                                                    </a>
                                                </div>
                                                <div className="grid grid-cols-2 items-center text-xs text-gray-400">
                                                    <div className="flex gap-1 w-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                             className="icon icon-tabler icon-tabler-circle-plus h-4 w-4"
                                                             width="24" height="24" viewBox="0 0 24 24" strokeWidth="2"
                                                             stroke="currentColor" fill="none" strokeLinecap="round"
                                                             strokeLinejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                                                            <path d="M9 12l6 0"></path>
                                                            <path d="M12 9l0 6"></path>
                                                        </svg>
                                                        <span>{crDate.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric',})}</span>
                                                    </div>
                                                    <div className="flex gap-1 w-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                             className="icon icon-tabler icon-tabler-edit-circle h-4 w-4"
                                                             width="24" height="24" viewBox="0 0 24 24" strokeWidth="2"
                                                             stroke="currentColor" fill="none" strokeLinecap="round"
                                                             strokeLinejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                            <path
                                                                d="M12 15l8.385 -8.415a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3z"></path>
                                                            <path d="M16 5l3 3"></path>
                                                            <path
                                                                d="M9 7.07a7 7 0 0 0 1 13.93a7 7 0 0 0 6.929 -6"></path>
                                                        </svg>
                                                        <span>{upDate.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric',})}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         className={`icon icon-tabler icon-tabler-message w-4 h-4${item.has_discussions ? '' : ' text-gray-400'}`}
                                                         height="24" viewBox="0 0 24 24" strokeWidth="2"
                                                         stroke="currentColor" fill="none" strokeLinecap="round"
                                                         strokeLinejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                        <path d="M8 9h8"></path>
                                                        <path d="M8 13h6"></path>
                                                        <path
                                                            d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"></path>
                                                    </svg>

                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         className={`icon icon-tabler icon-tabler-edit-circle h-4 w-4${item.has_downloads ? '' : ' text-gray-400'}`}
                                                         width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5"
                                                         stroke="currentColor" fill="none" strokeLinecap="round"
                                                         strokeLinejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
                                                        <path d="M7 11l5 5l5 -5"></path>
                                                        <path d="M12 4l0 12"></path>
                                                    </svg>

                                                    <a href={item.issues_url} target="_blank">
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                             className={`icon icon-tabler icon-tabler-edit-circle h-4 w-4${item.has_issues ? '' : ' text-gray-400'}`}
                                                             height="24" viewBox="0 0 24 24" strokeWidth="2"
                                                             stroke="currentColor" fill="none" strokeLinecap="round"
                                                             strokeLinejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                            <path d="M9 9v-1a3 3 0 0 1 6 0v1"></path>
                                                            <path
                                                                d="M8 9h8a6 6 0 0 1 1 3v3a5 5 0 0 1 -10 0v-3a6 6 0 0 1 1 -3"></path>
                                                            <path d="M3 13l4 0"></path>
                                                            <path d="M17 13l4 0"></path>
                                                            <path d="M12 20l0 -6"></path>
                                                            <path d="M4 19l3.35 -2"></path>
                                                            <path d="M20 19l-3.35 -2"></path>
                                                            <path d="M4 7l3.75 2.4"></path>
                                                            <path d="M20 7l-3.75 2.4"></path>
                                                        </svg>
                                                    </a>

                                                    <div className="flex items-center gap-1 ml-4">
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                             className="icon icon-tabler icon-tabler-eyeglass-2 h-4 w-4"
                                                             viewBox="0 0 24 24" strokeWidth="2"
                                                             stroke="currentColor" fill="none" strokeLinecap="round"
                                                             strokeLinejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                            <path d="M8 4h-2l-3 10v2.5"></path>
                                                            <path d="M16 4h2l3 10v2.5"></path>
                                                            <path d="M10 16l4 0"></path>
                                                            <path
                                                                d="M17.5 16.5m-3.5 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0"></path>
                                                            <path
                                                                d="M6.5 16.5m-3.5 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0"></path>
                                                        </svg>
                                                        <span>{item.watchers}</span>
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                             className="icon icon-tabler icon-tabler-git-fork h-4 w-4"
                                                             width="24" height="24" viewBox="0 0 24 24" strokeWidth="2"
                                                             stroke="currentColor" fill="none" strokeLinecap="round"
                                                             strokeLinejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                            <path d="M12 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                                            <path d="M7 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                                            <path d="M17 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                                            <path d="M7 8v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2 -2v-2"></path>
                                                            <path d="M12 12l0 4"></path>
                                                        </svg>
                                                        <span>{item.forks}</span>
                                                    </div>

                                                    <button className={`ml-4${favorite.includes(item.html_url) ? ' text-yellow-600' : ''}`} onClick={(e) => addToFavorite(e, item.html_url)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                             className="icon icon-tabler icon-tabler-git-fork h-4 w-4"
                                                             height="24" viewBox="0 0 24 24" strokeWidth="2"
                                                             stroke="currentColor" fill="none" strokeLinecap="round"
                                                             strokeLinejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                            <path
                                                                d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            )
                        })
                }
            </div>

        </div>
    )
}
