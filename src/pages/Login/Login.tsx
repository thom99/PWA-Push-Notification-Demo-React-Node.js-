import { useSearchParams } from "react-router";
import LoginUser from "./LoginUser";
import ActivationUser from "./ActivationUser";

function Login(): React.ReactNode {
  const [searchParams, _setSearchParams] = useSearchParams();

  const pathType = searchParams.get("type");

  return pathType === "activation" ? <ActivationUser /> : <LoginUser />;
}

export default Login;
