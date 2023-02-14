import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [albums, setAlbums] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/albums')
      .then(response => {
        setAlbums(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSubmit = event => {
    event.preventDefault();

    if (selectedAlbumId) {
      axios.put(`https://jsonplaceholder.typicode.com/albums/${selectedAlbumId}`, { title })
        .then(response => {
          setAlbums(albums.map(album => (
            album.id === selectedAlbumId ? response.data : album
          )));
          setTitle('');
          setSelectedAlbumId(null);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      axios.post('https://jsonplaceholder.typicode.com/albums', { title })
        .then(response => {
          setAlbums([...albums, response.data]);
          setTitle('');
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const handleEdit = album => {
    setTitle(album.title);
    setSelectedAlbumId(album.id);
  };

  const handleDelete = albumId => {
    axios.delete(`https://jsonplaceholder.typicode.com/albums/${albumId}`)
      .then(() => {
        setAlbums(albums.filter(album => album.id !== albumId));
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <h2>Add/Edit Album</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
        <button type="submit">{selectedAlbumId ? 'Update' : 'Add'}</button>
      </form>
      <h2>Albums</h2>
      <ul>
        {albums.map(album => (
          <li key={album.id}>
            {album.title}
            <button onClick={() => handleEdit(album)}>Edit</button>
            <button onClick={() => handleDelete(album.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
