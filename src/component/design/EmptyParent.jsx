import React from 'react';
import { Outlet } from 'react-router-dom';

const EmptyParent = () => {
    return (
        <div>
            <Outlet/>
        </div>
    );
};

export default EmptyParent;