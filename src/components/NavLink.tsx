import React from 'react';
import { Link, useLocation } from 'react-router-dom';

type NavLinkProps = {
    to: string;
    children: React.ReactNode;
    mobile?: boolean;
};


// Navigation Link Component for consistency
function NavLink({ to, children, mobile }: NavLinkProps) {
    // Use useLocation to determine the current path
    // This allows us to apply active styles based on the current route
    const location = useLocation();

    return (
        <Link
            to={to}
            className={`block px-3 py-2 text-sm font-medium ${location.pathname === to
                    ? 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-700 hover:text-gray-900'
                } ${mobile ? 'w-full block' : ''}`}
        >
            {children}
        </Link>
    );

}

export default NavLink;