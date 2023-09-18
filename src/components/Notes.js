import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import noteContext from '../context/notes/noteContext';
import Notesitem from './Notesitem';
import AddNote from './AddNote';
import NoteState from '../context/notes/NoteState';
import { useNavigate } from 'react-router-dom';
const { addNote } = NoteState;

const Notes = (props) => {
    let navigate = useNavigate();
    const context = useContext(noteContext);
    const { notes, getNotes, editNote } = context;
    useEffect(() => {
        if (localStorage.getItem("token")) {
            getNotes();
        }
        else {
            navigate("/login");
        }
    }, [notes]);

    const ref = useRef(null);
    const refClose = useRef(null);

    const updateNote = useCallback((currentnote) => {
        ref.current.click();
        setNote({ id: currentnote._id, etitle: currentnote.title, edescription: currentnote.description, etag: currentnote.tag });
    }, [notes]);
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" });
    const handleClick = (e) => {
        ref.current.click();
        editNote(note.id, note.etitle, note.edescription, note.etag);
        props.showAlert("Update Successfully", "success");
        console.log("updating the note", note);
    };

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };


    return (
        <>
            <AddNote showAlert={props.showAlert} />

            <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className="my-3">
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input type="text" value={note.etitle} name="etitle" className="form-control" id="etitle" aria-describedby="emailHelp" onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <input type="text" value={note.edescription} name="edescription" className="form-control" id="edescription" onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">Tag</label>
                                    <input type="text" value={note.etag} name="etag" className="form-control" id="etag" onChange={onChange} minLength={5} required />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" onClick={handleClick} className="btn btn-primary" disabled={note.etitle.length < 5 || note.edescription.length < 5}>Update Note</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row my-3">
                <h1>Your Notes</h1>
                <div>{notes.length === 0 && 'No notes to display'}</div>
                {notes.map((note) => {
                    return <Notesitem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />;
                })}
            </div>
        </>
    );
};

export default Notes;