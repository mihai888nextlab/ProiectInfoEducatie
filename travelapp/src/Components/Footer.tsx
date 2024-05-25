import logo from "@/assets/logo.png";

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
      <div className="border-t border-slate-900/5 py-10">
        <img
          src={logo.src}
          alt="logo"
          className="mx-auto h-20 w-auto text-slate-900"
        />
        <p className="mt-5 text-center text-sm leading-6 text-slate-500">
          © 2024 Webngo. All rights reserved.
        </p>
        <div className="mt-8 flex items-center justify-center space-x-4 text-sm font-semibold leading-6 text-slate-700">
          <a href="/privacy-policy">Privacy policy</a>
          <div className="h-4 w-px bg-slate-500/20"></div>
          <a href="/changelog">Changelog</a>
        </div>
      </div>
    </footer>
  );
}
