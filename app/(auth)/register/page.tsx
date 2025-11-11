import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-6 sm:px-8 lg:px-12">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
