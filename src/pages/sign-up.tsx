import { NormalButton, SoftButton } from "@/components/button";
import { HeaderWithBackButton } from "@/components/header";
import { Input } from "@/components/input";
import { userApi } from "@/services/axios/user-api";
import {
  schema,
  SignUpData,
} from "@/services/react-hook-form/sign-up-validation";
import { saveUser } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/router";
import nookies from "nookies";
import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";

export default function SignUp() {
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: SignUpData) => {
    setIsLoading(true);
    const res = await userApi.signUp({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    switch (res.status) {
      case 201:
        saveUser(res.data.user);
        nookies.set(undefined, "purplenotes.token", res.data.token);
        navigate.push("/");
        break;

      case 401:
        break;

      case 500:
        break;
    }

    setIsLoading(false);
  };

  return (
    <>
      <HeaderWithBackButton />

      <main className="safe-area flex justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center gap-4 min-h-screen max-w-[330px] w-full"
        >
          <h2 className="text-xl text-center font-medium rounded-md w-fit mb-8">
            The best place to store your notes{" "}
            <span className="text-primary">safely</span> and access them{" "}
            <span className="text-primary">wherever you want</span>.
          </h2>

          <FormGroup>
            <label htmlFor="name">Name:</label>
            <Input
              type="text"
              placeholder="Type your name"
              id="name"
              className="w-full"
              register={register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </FormGroup>

          <FormGroup>
            <label htmlFor="email">E-mail:</label>
            <Input
              type="email"
              placeholder="Type your email address"
              id="email"
              className="w-full"
              register={register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </FormGroup>

          <FormGroup>
            <label htmlFor="password">Password:</label>
            <Input
              type="password"
              placeholder="Type your password"
              id="password"
              className="w-full"
              register={register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </FormGroup>

          <FormGroup>
            <label htmlFor="passwordConfirmation">Password confirmation:</label>
            <Input
              type="password"
              placeholder="Type your password confirmation"
              id="passwordConfirmation"
              className="w-full"
              register={register("passwordConfirmation")}
            />
            {errors.passwordConfirmation && (
              <p className="text-sm text-red-500">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </FormGroup>

          <FormGroup className="mt-5 gap-5">
            <NormalButton disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-5 h-5 mr-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Loading...
                </>
              ) : (
                "Create User"
              )}
            </NormalButton>
            <Link href="/sign-in" className="text-center w-full">
              <SoftButton className="w-full">
                I already have an account
              </SoftButton>
            </Link>
          </FormGroup>
        </form>
      </main>
    </>
  );
}

function FormGroup({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={`flex flex-col gap-1 w-full ${className}`}>
      {children}
    </div>
  );
}
