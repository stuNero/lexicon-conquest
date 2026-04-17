import { useState } from 'react';
import { Link } from "react-router-dom";
import { Mail, Lock, User } from 'lucide-react';


export default function HomePage() {
  const [activeBtn, setActiveBtn] = useState('login');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');



   const switchToLogin = () => {
    setActiveBtn('login');
    // Clear all fields when switching to login
    // setEmail('');
    // setPass('');
    // setConfirmPass('');
    // setFirstName('');
    // setLastName('');
    // setDuplicateEmailError('');
    // setConfirmPasswordError('');
    // setLoginError('');
  };



  const switchToRegister = () => {
    setActiveBtn('medlem');
    // Clear all fields when switiching to register
    // setEmail('');
    // setPass('');
    // setConfirmPass('');
    // setFirstName('');
    // setLastName('');
    // setDuplicateEmailError('');
    // setConfirmPasswordError('');
    // setLoginError('');
  };

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    // this line is to prevent the page to refresh, we only want render the component not the whole page
    e.preventDefault();
    
  }

  return <>
    {/* div for centring the whole page */}
      <div className="min-h-screen  flex justify-center items-center px-4 pt-16">
        {/* div for stopping content stretch to edges */}
        <div className="w-full max-w-md">
          {/* welcome text and logo */}
          <div className="flex flex-col items-center my-8 space-y-2">
            <img
              src="/logo-cinesharp.webp"
              width="60px"
              height="auto"
              alt="cinesharp logo"
            />
            <h1 className="text-4xl">
              {activeBtn === 'login' ? 'Välkommen tillbaka' : 'Välkommen'}
            </h1>
            <h2 className="text-md text-gray-400">
              {activeBtn === 'login'
                ? 'Logga in för att hantera dina bokningar'
                : 'Bli medlem för att hantera dina bokningar'}
            </h2>
          </div>

          {/* buttons that switch between login and registeration */}
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8 mb-12 ">
            <section className=" flex flex-row bg-black rounded-xl justify-between mb-8">
           {/* create lobby button  */}
               <button
                className={`bg-black p-2 rounded-xl flex-1 border-black border-4 cursor-pointer
              ${activeBtn === 'login'
                          ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-900/50"
                      : "bg-transparent hover:bg-gray-700/50 text-gray-400"}`}
                onClick={switchToLogin}
              >
                Create Lobby
            </button>
            
            {/* join lobby button  */}
              <button
                className={`bg-black p-2 rounded-xl flex-1 border-black border-4 cursor-pointer
              ${activeBtn === 'medlem'
                          ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-900/50"
                      : "bg-transparent hover:bg-gray-700/50 text-gray-400"}`}
                onClick={switchToRegister}
              >
                Join Lobby
              </button>
            </section>

          <form action="">
            {/* firstname */}
                  <div>
                    <label className="text-sm text-gray-400 ">Username</label>
                    <div className="mt-1 flex items-center bg-black border border-white/10 rounded-xl px-3 focus-within:outline-1 focus-within:outline-red-900 ">
                      <User className="w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Username"
                        className="flex-1 bg-transparent px-3 py-3 outline-none"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value.trim())}
                      />
                    </div>
                  </div>
           </form>
          </div>
        </div>
     </div>
    







  <div
    className="
    flex flex-col items-center
    bg-gray-600 border-2 border-solid rounded-2xl
    mx-5 p-10">
    <div className="
          flex flex-col
          w-fit
          p-2">
      <label
        htmlFor="username_input"
        className="
        py-0.5
        text-2xl text-amber-200/50
        bg-stone-700
        text-shadow-md text-shadow-stone-800
        rounded-t-2xl
        text-center 
        ">
        Användarnamn: </label>
      <input
        id="username_input"
        type="text"
        placeholder=""
        className="
        text-center
        h-10 w-fit
        bg-stone-400
        border-2 border-solid border-stone-500 rounded
        " />
    </div>
    <div className="
          flex flex-col
          w-fit
          p-2">
      <label
        htmlFor="player-count-input"
        className="
        py-0.5
        text-2xl text-amber-200/50
        bg-stone-700
        text-shadow-md text-shadow-stone-800
        rounded-t-2xl
        text-center 
        ">
        Antal spelare: </label>
      <input
        id="player-count-input"
        type="text"
        placeholder="2"
        className="
        text-center
        h-10 w-fit
        bg-stone-400
        border-2 border-solid border-stone-500 rounded
        " />
    </div>
    <div className="
          flex flex-col
          w-fit
          p-2">
      <label
        htmlFor="board-size-input"
        className="
        py-0.5
        text-2xl text-amber-200/50
        text-shadow-md text-shadow-stone-800
        bg-stone-700
        rounded-t-2xl
        text-center ">
        Brädets storlek: </label>
      <input
        id="board-size-input"
        type="text"
        placeholder="10x10"
        className="
        text-center
        h-10 w-fit
        bg-stone-400
        border-2 border-solid border-stone-500 rounded
        " />
    </div>
    <Link className="border-4 hover:bg-green-800 button border-stone-700 px-2 flex flex-col justify-center bg-green-700 h-10 rounded" to="/lobby">
      Skapa Session
    </Link>
    </div>;
    </>
}