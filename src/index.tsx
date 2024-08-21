import React from "react";
import ReactDOM from "react-dom/client";
import {ApolloProvider, ApolloClient, InMemoryCache} from "@apollo/client";
import {BrowserRouter} from "react-router-dom";
import "./index.css";
import App from "./App";
import "normalize.css";
import "reset-css";
import {RecoilRoot} from "recoil";

const client = new ApolloClient({
    uri: `http://localhost:${process.env.REACT_APP_PORT}/graphql/`,
    cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <BrowserRouter>
                <RecoilRoot>
                    <App />
                </RecoilRoot>
            </BrowserRouter>
        </ApolloProvider>
    </React.StrictMode>
);