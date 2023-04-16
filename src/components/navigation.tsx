import React from 'react';
import { NavLink } from 'react-router-dom';
import { PATHS } from '../constants/paths';

export const Navigation: React.FC = () => {
    return(
        <nav id="main-menu" className="bg-gray-800 text-white px-4 mb-2 shadow">
            <ul className="flex gap-1 items-center">
                <li>
                    <NavLink to={PATHS.HOME}>Home</NavLink>
                </li>
                <li>
                    <NavLink to={PATHS.FAVORITES}>Favorites</NavLink>
                </li>
            </ul>
        </nav>
    )
}
