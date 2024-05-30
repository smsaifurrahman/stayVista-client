import React from 'react';
import useRole from '../../../hooks/useRole';
import AdminStatistics from '../Admin/AdminStatistics';

const Statistics = () => {
    const [role, isLoading] = useRole()
    return (
        <div>
            <h1>We to Dashboard: Statistics Page: {role} </h1>
            { role==='admin' && <AdminStatistics></AdminStatistics> }
            
           
        </div>
    );
};

export default Statistics;