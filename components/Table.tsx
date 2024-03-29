"use client";

import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
import { FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { usePlayerContext, Player } from "@/app/context/player";
import "react-toastify/dist/ReactToastify.css";

export default function BasicTable() {
  const [ID, setID] = useState(2);
  const [validNames, setValidNames] = useState(true);
  const router = useRouter();
  const { players, setPlayers } = usePlayerContext();
  const [loading, setLoading] = useState(false);

  // Adds a player to the Players[]
  const addPlayer = (ID: number) => {
    const newPlayer: Player = {
      id: ID,
      name: `Player ${ID + 1}`,
      score: 0,
      history: [],
    };
    setID(ID + 1);
    setPlayers([...players, newPlayer]);
  };

  // Removes a player from the Players[]
  const removePlayer = (id: number) => {
    setPlayers(players.filter((player) => player.id !== id));
  };

  // Changes the name of a player in the Players[]
  const changeNames = (id: number, name: string) => {
    players.map((player) => {
      if (player.id === id) {
        player.name = name;
      }
    });

    // Need to find an alt for this
    checkNames();
  };

  // Checks if all players have a name
  const checkNames = () => {
    const isValid = players.every((player) => player.name.trim() !== "");
    setValidNames(isValid);
  };

  // Verifies if all players have names and there are more than two players,
  // other wise it gives an error message
  const handleSubmit = () => {
    if (validNames && players.length >= 2) {
      setLoading(true);
      console.log(players);
      setPlayers(players);
      router.push("/game");
    } else {
      if (!validNames) {
        setLoading(false);
        console.error("Invalid player names");
        toast.error("Enter all player names", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
      if (players.length < 2) {
        toast.error("Minimum 2 players required", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    }
  };

  // Starts the game with two players already loaded
  useEffect(() => {
    setPlayers([
      { id: 0, name: "Player 1", score: 0, history: [] },
      { id: 1, name: "Player 2", score: 0, history: [] },
    ]);
  }, []);

  return (
    <div className="min-w-full">
      <div>
        <TableContainer
          component={Paper}
          style={{ maxHeight: "400px", overflowY: "auto" }}
          className="shadow-md"
        >
          <Table aria-label="simple table">
            <TableHead
              style={{ position: "sticky", top: 0, background: "white" }}
            >
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right"> {} </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((player) => (
                <TableRow
                  key={player.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" className="h-10">
                    <input
                      type="text"
                      placeholder="Enter name"
                      className="input input-bordered input-sm w-full max-w-md"
                      defaultValue={`Player ${player.id + 1}`}
                      onChange={(e: React.FormEvent<HTMLInputElement>) =>
                        changeNames(player.id, e.currentTarget.value)
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex justify-end">
                      <button
                        className="btn btn-sm btn-outline btn-error"
                        onClick={() => removePlayer(player.id)}
                      >
                        <HiOutlineMinus />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>Add new player</TableCell>
                <TableCell align="right">
                  <div className="flex justify-end">
                    <button
                      className="btn btn-sm btn-outline btn-primary"
                      onClick={() => addPlayer(ID)}
                    >
                      <HiOutlinePlus />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Once you click on start it will verify everything and show a spinner while loading */}
      <div className="flex flex-col items-center mt-5">
        <button
          type="submit"
          className="btn btn-primary transition duration-500 ease-in-out hover:scale-110"
          onClick={() => {
            handleSubmit();
          }}
          disabled={loading} // Disable the button while loading
        >
          {loading ? (
            <div className="flex items-center">
              <span> Loading </span>
              <FaSpinner className="animate-spin ml-3" />
            </div>
          ) : (
            "Start"
          )}
        </button>
      </div>

      {/* This is the container for the error messages */}
      <div>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </div>
  );
}
