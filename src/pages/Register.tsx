import { Button, Input, Stack, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiURL } from "@/utils/baseurl";

const registerSchema = z.object({
  email: z.string().email("ivalid email"),
  username: z.string().min(1, "Invalid username"),
  password: z.string().min(6, "Password must be at least 6 characters long"), 
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormInputs) => {
    console.log(data);
    try {
      const response = await axios.post(`${apiURL}api/auth/register`, data);
      console.log(response.data);

      Swal.fire({
        title: "Registration Successful!",
        text: "Your account has been created. You can now log in.",
        icon: "success",
        confirmButtonText: "Go to Login",
      }).then(() => {
        navigate("/login"); 
      });
    } catch (error: any) {
      console.error("Registration failed", error);

      Swal.fire({
        title: "Registration Failed",
        text: error.response?.data?.message || "An error occurred. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  return (
    <div className="card flex flex-col justify-center items-center h-screen">
      <div className="descLogin flex flex-col justify-start">
        <h1 className="text-[#04A51E] font-bold text-3xl mb-2">Circle</h1>
        <h3 className="text-xl text-white mb-2">Create Account Circle</h3>
      </div>
      <div className="formLogin">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="4" align="flex-center" width="500px">
            <Input
              {...register("email")}
              width="100%"
              padding="4"
              rounded="md"
              borderWidth="1px"
              borderColor="whiteAlpha.950"
              placeholder="Email*"
              color="white"
            />
            {errors.email && (
              <Text color="red" fontSize="xs">
                {errors.email.message}
              </Text>
            )}

            <Input
              {...register("username")}
              width="100%"
              padding="4"
              rounded="md"
              borderWidth="1px"
              borderColor="whiteAlpha.950"
              placeholder="Username*"
              color="white"
            />
            {errors.username && (
              <Text color="red" fontSize="xs">
                {errors.username.message}
              </Text>
            )}

            <Input
              {...register("password")}
              type="password"
              width="100%"
              padding="4"
              rounded="md"
              borderWidth="1px"
              borderColor="whiteAlpha.950"
              placeholder="Password*"
              color="white"
            />
            {errors.password && (
              <Text color="red" fontSize="xs">
                {errors.password.message}
              </Text>
            )}

            <Button
              type="submit"
              width="100%"
              rounded="50px"
              bgColor="#04A51E"
              color="white"
            >
              Create Account
            </Button>
          </Stack>
          <p className="text-white">
            Already have an account?{" "}
            <a href="/login" className="text-[#04A51E]">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
