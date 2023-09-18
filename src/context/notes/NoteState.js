import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
    const host = "http://localhost:5000";
    const notesInitial = [];

    const [notes, setNotes] = useState(notesInitial);

    //GET ALL NOTE
    const getNotes = async () => {

        //API CALL

        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
            }
        });

        const json = await response.json();
        setNotes(json);
    };
    //ADD A NOTE
    const addNote = async (title, description, tag) => {

        //API CALL
        const data = {
            title: title,
            description: description,
            tag: tag,
        };
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        const note = await response.json();
        setNotes(notes.concat(note));
    };

    //DELETE A NOTE
    const deleteNote = async (id) => {

        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: "DELETE", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token")
            }
        });

        const json = await response.json();
        console.log(json);

        const newNote = notes.filter((note) => { return note._id !== id; });
        setNotes(newNote);

        console.log("deleting note with id" + id);

    };

    //EDIT A NOTE

    const editNote = async (id, title, description, tag) => {

        //API CALL

        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {

            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ title, description, tag }), // body data type must match "Content-Type" header
        });
        const json = await response.json();
        console.log(json);
        //Logic to edit in client
        // for (let index = 0; index < notes.length; index++) {
        //     const element = notes[index];
        //     if (element.id === id) {
        //         element.title = title;
        //         element.description = description;
        //         element.tag = tag;
        //         break;
        //     }

        // }
    };

    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;
