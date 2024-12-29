import { FC, ReactNode } from "react";
import { Provider } from "react-redux";
import store from '../store/Store'; // Ensure store is imported

interface IProviders {
  children: ReactNode;  // Allow children to be passed as a prop
}

export const Providers: FC<IProviders> = ({ children }) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};
