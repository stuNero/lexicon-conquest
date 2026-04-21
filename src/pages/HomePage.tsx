<<<<<<< HEAD
import { useState, FormEvent } from 'react';
import {   Sword,
  Users,
  Grid3x3,
  Trophy, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import fetchJson from '../utils/fetchjson';
import Player from '../interfaces/Player';




export default function HomePage() {
  const navigate = useNavigate();
  const [activeBtn, setActiveBtn] = useState('join');
  const [userName, setUserName] = useState('');
  const [playerAmount, setPlayerAmount] = useState('2');
  const [boardSize, setBoardSize] = useState('10');
  const [url, setUrl] = useState('');



   const switchToCreate = () => {
    setActiveBtn('create');
    // Clear all fields when switching to create
    setUserName('');
    setPlayerAmount('');
    setBoardSize('');
  };



  const switchToJoin = () => {
    setActiveBtn('join');
    // Clear field when switiching to Join
    setUrl('');
 
  };


  
   const CreateLobby = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    

     const response =await  fetchJson<
      {
        url: string,
        players: Player,
=======
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import fetchJson from "../utils/fetchJson";
import type Player from "../interfaces/Player";
export default function HomePage() {
  const navigate = useNavigate();
  const [username, SetUsername] = useState("");
  const [url, SetUrl] = useState("");

  async function CreateLobby() {
    const response = await fetchJson<
      {
        url: string,
        player: Player;
>>>>>>> DEV
      }>("/api/sessions", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
<<<<<<< HEAD
          userName: userName,
        })
       });
     
     console.log("full response", response)
    localStorage.setItem("sessionID", response.url);
    localStorage.setItem("playerID", response.players.id);

    navigate(`lobby/${response.url}`);
    return;
    
  }



  
 const JoinLobby = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 

    const response = await fetchJson < Player >
=======
          UserName: username
        })
      });
    localStorage.setItem("sessionID", response.url);
    localStorage.setItem("playerID", response.player.id);

    navigate(`lobby/${response.url}`);
  }
  async function JoinLobby() {
    const response = await fetchJson<Player>
>>>>>>> DEV
      (`/api/sessions/${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
<<<<<<< HEAD
          userName: userName
=======
          username: username
>>>>>>> DEV
        })
      });
    localStorage.setItem("sessionID", url);
    localStorage.setItem("playerID", response.id);
    navigate(`/lobby/${url}`);
<<<<<<< HEAD
    return;
    
  }

  return <>
    {/* div for centring the whole page */}
    <div className="min-h-screen relative flex items-center justify-center      overflow-hidden py-6 "> 
      
      <div className="absolute inset-0 z-0">
        <img
          src="bg-image.png"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/40" />

      </div>

     
      

        {/* main content */}
      {/* main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        
        <div className='flex flex-col lg:flex-row items-center justify-center gap-14'>
       
          
           {/* Left Side - Hero Section */}
        <div className="flex-1 text-center lg:text-left">
          <div>
              <img src="/images/logo.png"
                className="w-full max-w-sm mx-auto lg:mx-0 h-auto"
              alt="lexicon-quest logo"></img>
          </div>

          <p className="text-gray-300 text-xl mb-8 max-w-md mx-auto lg:mx-0">
            Conquer territories through words. Battle with
            letters. Claim victory!
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
            <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/40 p-4 rounded-lg border border-emerald-700/50 backdrop-blur-sm">
              <Sword className="w-8 h-8 text-emerald-400 mb-2" />
              <h3 className="text-white font-bold text-sm">
                Strategic Combat
              </h3>
              <p className="text-gray-400 text-xs">
                Guess letters to conquer
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-4 rounded-lg border border-blue-700/50 backdrop-blur-sm">
              <Users className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-bold text-sm">
                Multiplayer
              </h3>
              <p className="text-gray-400 text-xs">
                2-4 players battle
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-4 rounded-lg border border-purple-700/50 backdrop-blur-sm">
              <Grid3x3 className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-white font-bold text-sm">
                Custom Boards
              </h3>
              <p className="text-gray-400 text-xs">
                Terrain & tile variety
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 p-4 rounded-lg border border-amber-700/50 backdrop-blur-sm">
              <Trophy className="w-8 h-8 text-amber-400 mb-2" />
              <h3 className="text-white font-bold text-sm">
                Compete
              </h3>
              <p className="text-gray-400 text-xs">
                Dominate the map
              </p>
            </div>
          </div>
        </div>


          

           {/* right side content  */}
        <div>

          {/* buttons that switch between create lobby and join lobby */}
          <div className="flex-1 w-full lg:min-w-md md:min-w-md bg-zinc-950 border border-white/10 rounded-3xl p-4 sm:p-6 md:p-8 mb-2 ">
            <section className=" flex flex-row bg-black rounded-xl justify-between mb-8">
           {/* create lobby button  */}
               <button
                className={`bg-black p-2 rounded-xl flex-1 border-black border-4 cursor-pointer
              ${activeBtn === 'create'
                          ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-900/50"
                      : "bg-transparent hover:bg-gray-700/50 text-gray-400"}`}
                onClick={switchToCreate}
              >
                Create Lobby
            </button>
            
            {/* join lobby button  */}
              <button
                className={`bg-black p-2 rounded-xl flex-1 border-black border-4 cursor-pointer
              ${activeBtn === 'join'
                          ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-900/50"
                      : "bg-transparent hover:bg-gray-700/50 text-gray-400"}`}
                onClick={switchToJoin}
              >
                Join Lobby
              </button>
          </section>

              
          <form onSubmit={activeBtn === 'join' ? JoinLobby : CreateLobby}
                className="space-y-4 ">
                {/* if active button is join */}
                {activeBtn === 'join' && (
                  <>
                   {/* url */}
                  <div>
                    <label className="text-sm text-gray-400 after:content-['*'] after:ml-1 after:text-red-700">Url</label>
                    <div className="mt-1 flex items-center bg-black border border-white/10 rounded-xl px-3 focus-within:outline-1 focus-within:outline-green-800 ">
                      <input
                        type="text"
                        required
                        placeholder="XXXXXXXX"
                        className="flex-1 bg-transparent px-3 py-3 outline-none text-white"
                        value={url}
                        onChange={(e) => setUrl(e.target.value.trim())}
                      />
                    </div>
                 </div>
                  </>
                )}

                {/* if active button is create */}
                {activeBtn === 'create' && (
                  <>
            {/* firstname */}
                  <div>
                    <label className="text-sm text-gray-400 after:content-['*'] after:ml-1 after:text-red-700">Name</label>
                    <div className="mt-1 flex items-center bg-black border border-white/10 rounded-xl px-3 focus-within:outline-1 focus-within:outline-green-800 ">
                      <input
                        type="text"
                        required
                        placeholder="Username"
                        className="flex-1 bg-transparent px-3 py-3 outline-none text-white"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value.trim())}
                      />
                    </div>
                 </div>
            
             {/* number of players */}
                  <div>
                    <label className="text-sm text-gray-400 ">Number of players</label>
                    <div className="mt-1 flex items-center bg-black border border-white/10 rounded-xl px-3 focus-within:outline-1 focus-within:outline-green-800 ">
                      <input
                        type="number"
                        placeholder="2"
                        min="2"
                        max="4"
                        className="flex-1 bg-transparent px-3 py-3 outline-none text-white"
                        value={playerAmount}
                        onChange={(e) => setPlayerAmount(e.target.value)}
                      />
                    </div>
            </div>
            
             {/* board size */}
                  <div>
                    <label className="text-sm text-gray-400 ">Board size</label>
                    <div className="mt-1 flex items-center bg-black border border-white/10 rounded-xl px-3 focus-within:outline-1 focus-within:outline-green-800 ">
                      <input
                        type="number"
                        placeholder="10"
                        min="2"
                        className="flex-1 bg-transparent px-3 py-3 outline-none text-white"
                        value={boardSize}
                        onChange={(e) => setBoardSize(e.target.value)}
                      />
                    </div>
            </div>
                  
                  </>
                )}
            
               <button
                  type="submit"
                  className="
                  w-full
                  bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-emerald-900/50
                  my-8
                  px-4 py-3 rounded-xl 
                  cursor-pointer
                  transition-all 
                  duration-150
                  active:scale-95 active:brightness-75"
                >
                  {activeBtn === 'create' ? 'Create' : 'Join'}
              </button>
           </form>
          </div>
        </div>

        </div>
         </div>
     </div>
    







 
    </>
=======
  }

  return <div
    className="
    flex flex-col items-center
    bg-gray-600 border-2 border-solid rounded-2xl
    mx-5 w-75 p-2">
    <div className="
            flex flex-col
            w-full
            px-2 py-5 mb-5
            items-center
            bg-linear-to-r from-white/60">
      <label
        htmlFor="username_input"
        className="
          px-2
          text-2xl text-amber-200/50
          bg-stone-700
          text-shadow-md text-shadow-stone-800
          rounded-t-2xl
          text-center
          ">
        Användarnamn: </label>
      <input
        id="username_input"
        onChange={(e) => SetUsername(e.target.value)}
        type="text"
        placeholder="xXPenguinKillerXx"
        required
        className="
          text-center
          h-10 w-fit
          bg-stone-400
          border-2 border-solid border-stone-500 rounded
          " />
    </div>
    <section
      id="create"
      className="mt-10 w-full flex flex-col items-center bg-linear-to-b from-white/60">
      <button onClick={CreateLobby}
        className="
        border-4 border-stone-700 rounded
        hover:bg-green-800 button bg-green-700
        px-2 h-10 my-5
        flex flex-col justify-center">
        Create Session
      </button>
    </section>
    <section
      id="join"
      className="mt-10 w-full flex flex-col items-center bg-linear-to-b from-white/60">
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
          Lobby ID: </label>
        <input
          id="username_input"
          onChange={(e) => SetUrl(e.target.value)}
          type="text"
          placeholder="XXXXXXXX"
          className="
          text-center
          h-10 w-fit
          bg-stone-400
          border-2 border-solid border-stone-500 rounded
          " />
      </div>
      <button onClick={JoinLobby}
        className="
        border-4 border-stone-700 rounded
        hover:bg-green-800 button bg-green-700
        px-2 h-10
        flex flex-col justify-center">
        Join Session
      </button>
    </section>
  </div>;
>>>>>>> DEV
}