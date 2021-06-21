import React, {createContext, useState} from 'react';

export const UserLoggedContext = createContext({});

export const UserLoggedProvider: React.FC = ({ children }) => {

    const [userLogged, setUserLogged] = useState({});

    return (
        <UserLoggedContext.Provider value={[userLogged, setUserLogged]}>
            {children}
        </UserLoggedContext.Provider>
    );
};