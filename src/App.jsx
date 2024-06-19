import { useEffect, useState } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import Notifications from './components/Notifications'
import Footer from './components/Footer'

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('add a new note...')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)



  useEffect(() => {
    noteService
    .getAll()
    .then(initalNotes => {
      setNotes(initalNotes)
    })
  }, [])


  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: notes.length + 1
    }
    noteService
    .create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote));
      setNewNote('');
    })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(note => note.id === id)
    const changedNote = {...note, important: !note.important}
    noteService
    .update(id, changedNote)
    .then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })
    .catch(error => {
      setErrorMessage(`Note ${note.content} was already removed from server`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    })
  }
  const notesToShow = showAll ? notes : notes.filter(note => note.important)
  return (
    <div>
      <h1>Notes</h1>
      <Notifications message={errorMessage}/>
      <div>
      <button onClick={() => setShowAll(!showAll)}>show {showAll ? 'important' : 'All'}</button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      <form action="" onSubmit={addNote}>
        <input type="text" value={newNote} onChange={handleNoteChange}/>
        <button type='submit'>save</button>
      </form>
      <Footer/>
    </div>
  )
}

export default App