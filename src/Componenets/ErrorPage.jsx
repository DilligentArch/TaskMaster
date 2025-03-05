import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-center">
      <div className="bg-white shadow-md border border-gray-300 rounded-xl p-8 max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Oops!</h1>
        <p className="text-gray-600 mb-4">We can't find the page you're looking for.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
