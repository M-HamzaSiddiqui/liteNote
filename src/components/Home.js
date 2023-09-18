import React from 'react';
import { useContext } from 'react';
import noteContext from '../context/notes/noteContext';
import Notes from './Notes';
export const Home = (props) => {
   const {showAlert}=props;  

  const context = useContext(noteContext);
  const { notes, setNotes } = context;

  return (
    <div>
      <Notes showAlert={showAlert}/>
    </div>
  );
};
