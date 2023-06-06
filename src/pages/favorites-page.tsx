import React from 'react';
import {useAppSelector} from "../hooks/redux";

export const FavoritesPage: React.FC = () => {

    const {favorite} = useAppSelector(state => state.github)

    return(
        <div className="px-4 flex flex-col justify-center items-center pt-8 text-gray-600 pb-10">
            {favorite.length
                ? <div className="flex flex-col gap-8">
                    <h1 className="text-center text-2xl text-gray-800 font-medium">Favorite list</h1>
                    <div className="flex flex-col">
                        {favorite.map((item, index) => <a key={index} href={item} target="_blank" className="flex items-center gap-4 hover:bg-gray-100 transition-all duration-300 py-2 px-4 rounded">
                            <div>{index + 1}.</div>
                            <div>{item}</div>
                        </a>)}
                    </div>
                </div>
                : <p className="mt-4 block bg-blue-600 text-white rounded px-4 py-2">Favorite list is empty.</p>
            }
        </div>
    )
}
