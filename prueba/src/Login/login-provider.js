import React, { useState, useEffect } from "react";
import LoginContext from "./login-context";

const LoginProvider = ({ children, tokenStorage }) => {
  const token = tokenStorage === "localStorage" ? window.localStorage.getItem("token") : null

  const [isAuth, setIsAuth] = useState(!!token);

  useEffect(() => {
  const eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	const eventer = window[eventMethod];
	const messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

	eventer(messageEvent, (e) => {
		const data = e.data || e.message

    if(data && data.ping){
      // el mismo componente actualiza el token
      window.localStorage.setItem("token", data.token)

      // el usuario ahora esta logeado
      setIsAuth(true)
    }
	});

  }, [])

  const authenticate = () => {
    setIsAuth(true);
  };

  console.log(isAuth);

  return (
    <LoginContext.Provider
      value={{
        isAuth,
        authenticate,
      }}
    >
      {children}

      {!isAuth ? <iframe title="auth" src="http://localhost:4000" /> : null}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
