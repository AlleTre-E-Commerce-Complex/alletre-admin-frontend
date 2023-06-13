import { Toaster } from "react-hot-toast";

import { Redirect, Route, Switch } from "react-router-dom";

import AuthLayouts from "./layout/auth-layout";
import AppLayouts from "./layout/app-layout";
import routes from "./routes";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path={routes.auth.default} component={AuthLayouts} />
        <Route path={routes.app.default} component={AppLayouts} />
        {/* <Route
          path={routes.auth.forgetpass.default}
          component={CredentialsuUpdateLayout}
        /> */}
        {/* <Redirect path={routes.app.home} component={Home} /> */}
      </Switch>
      <Toaster
        position="top-right"
        reverseOrder={true}
        gutter={8}
        containerStyle={{}}
        toastOptions={{
          iconTheme: {
            className: "hidden p-0",
          },
          loading: {
            duration: 5000,
            className:
              "w-[430px] h-auto border-l-8 border-[#002189] bg-[#F7F9FF] py-3",
          },
          success: {
            duration: 5000,
            className:
              "w-[430px] h-auto border-l-8 border-[#45BF55] bg-[#F7F9FF] py-3",
          },
          error: {
            duration: 5000,
            className:
              "w-[430px] h-auto border-l-8 border-[#E53737] bg-[#FFFAFA] py-3",
          },
        }}
      />
    </div>
  );
}

export default App;
