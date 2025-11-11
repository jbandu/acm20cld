import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-6 sm:px-8 lg:px-12">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">Sign In</h1>

        {/* Test Credentials */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">🧪 Test Accounts</h3>
          <div className="space-y-2 text-xs">
            <div className="bg-white p-2 rounded border border-blue-100">
              <p className="font-medium text-blue-800">Researcher</p>
              <p className="text-gray-600">Email: <span className="font-mono">researcher@acm.com</span></p>
              <p className="text-gray-600">Password: <span className="font-mono">password123</span></p>
            </div>
            <div className="bg-white p-2 rounded border border-blue-100">
              <p className="font-medium text-blue-800">Manager</p>
              <p className="text-gray-600">Email: <span className="font-mono">manager@acm.com</span></p>
              <p className="text-gray-600">Password: <span className="font-mono">password123</span></p>
            </div>
            <div className="bg-white p-2 rounded border border-blue-100">
              <p className="font-medium text-blue-800">Admin</p>
              <p className="text-gray-600">Email: <span className="font-mono">admin@acm.com</span></p>
              <p className="text-gray-600">Password: <span className="font-mono">password123</span></p>
            </div>
            <div className="bg-white p-2 rounded border border-purple-100">
              <p className="font-medium text-purple-800">CEO</p>
              <p className="text-gray-600">Email: <span className="font-mono">ceo@acm.com</span></p>
              <p className="text-gray-600">Password: <span className="font-mono">ceo123</span></p>
            </div>
          </div>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
