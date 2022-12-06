import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store, { persistor } from "./redux-toolkit/configureStore";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { PersistGate } from "redux-persist/integration/react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0062E0",
      light: "#007CFF",
      contrastText: "#fbf7d1"
    },
    secondary: {
      main: "#0FC19B",
      contrastText: "#fbf7d1"
    }
  }
});
const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GG_APP_ID}>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools></ReactQueryDevtools>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
          </QueryClientProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
