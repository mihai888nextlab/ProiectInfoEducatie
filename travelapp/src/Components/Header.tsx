import Link from "next/link";

export default function Header() {
  return (
    <header>
      <nav>
        <div className="logo">
          <img src="" alt="" />
        </div>
        <div className="try">
          <button>
            <Link href={"/login"}>Try it now!</Link>
          </button>
        </div>
      </nav>
    </header>
  );
}
