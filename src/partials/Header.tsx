import { Link } from "react-router-dom";
export default function Header() {
  return <header
    className="
    w-full
    h-20
    bg-stone-700
    backdrop-blur-lg
    fixed z-500
    flex flex-col
    justify-around
    top-0
    ">
    <Link to="/">
      <img src="lexiconquest-logo.png" className="px-5 pb-5 py-2 h-30 w-auto"></img>
    </Link>
  </header>;
};