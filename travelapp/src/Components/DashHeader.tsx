import logo from "@/assets/logo.png";
import { logout } from "@/lib/actions";

interface Props {
  name: string;
}

export default function DashHeader(props: Props) {
  return (
    <header className="flex justify-between items-center fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="flex items-center p-3">
        <img src={logo.src} alt="logo" className="h-20 w-auto rounded-lg" />
      </div>
      <div className="flex items-center space-x-4 p-3">
        <h1>Hello, {props.name}</h1>
        <button
          className="bg-red-500 text-white p-3 rounded-lg cursor-pointer"
          onClick={() => logout()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-box-arrow-in-right"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"
            />
            <path
              fillRule="evenodd"
              d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
