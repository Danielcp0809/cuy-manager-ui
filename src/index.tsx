import { ChakraProvider } from "@chakra-ui/react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import Navigation from "./core/routes/Navigation";
import theme from "./core/theme/theme";
import {
  applyMiddleware,
  compose,
  legacy_createStore as createStore,
} from "redux";
import storage from "redux-persist/es/storage";
import { persistReducer, persistStore } from "redux-persist";
import rootReducer from "./core/store/reducers/rootReducer";
import { logger } from "./core/middlewares/logger";
import { Provider } from "react-redux";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const altCompose =
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose) || compose;

const persistConfig = {
  key: "root",
  storage,
};

const composedEnhancers = altCompose(applyMiddleware(logger));
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, composedEnhancers);
export const persistor = persistStore(store);

root.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <Provider store={store}>
        <Navigation />
      </Provider>
    </React.StrictMode>
  </ChakraProvider>
);
