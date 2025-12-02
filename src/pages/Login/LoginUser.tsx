import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    password: yup.string().required(),
  })
  .required();

interface ILoginUserForm {
  password: string;
}

function LoginUser(): React.ReactNode {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ILoginUserForm>({
    resolver: yupResolver(schema),
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const onSubmit: SubmitHandler<ILoginUserForm> = (data) => {
    try {
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmit(true);
    }
  };

  useEffect(() => {
    reset({
      password: "",
    });
  }, [isSubmit]);

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    {...register("password")}
                    id="password"
                    type="password"
                  />
                  {errors.password?.type === "required" && (
                    <p className="text-red-500">{errors.password?.message}</p>
                  )}

                  <div className="flex items-center">
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default LoginUser;
