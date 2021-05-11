import React, { useState,useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
// need to install "npm install --save aws-amplify @aws-amplify/ui-react"
import Amplify, { API, graphqlOperation } from 'aws-amplify';      // code need to add for auth
import awsconfig from './aws-exports';  // code need to add for auth
import { AmplifySignOut,withAuthenticator } from '@aws-amplify/ui-react';   // code need to add for auth
import { listSongs } from './graphql/queries';
import { Paper, IconButton } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { updateSong } from './graphql/mutations';

Amplify.configure(awsconfig)  // code need to add for auth

function App() {
  // code added for dbase
  const [songs, setSongs] = useState([])   // after fetch Songs is executed, songs and setSongs will be updated

  // every App is rendered, it will call fetchSongs()
  useEffect(() => {
    fetchSongs();
  }, []); // add [] to say only do it once the values in the list change

  // fetch song from DB
  const fetchSongs = async() => {
    try {
      // example of select table
      const songData = await API.graphql(graphqlOperation(listSongs));
      console.log('song data', songData);
      const songList = songData.data.listSongs.items;
      console.log('song list', songList);
      console.log('songs', songs);
      setSongs(songList);
    } catch (error) {
      console.log('error on fetching songs', error);
    }
  }

  const addLike = async(idx) => {
    try {
      console.log('song idx', idx);
      const song = songs[idx];
      console.log('addLike song', songs[idx]);

      song.like = song.like + 1;
      delete song.createdAt;
      delete song.updatedAt;
      console.log('addLike song', songs[idx]);

      // example of update table
      const songData = await API.graphql(graphqlOperation(updateSong, {input: song}));
      console.log('update songData', songData);
      const songList = [...songs];
      console.log('update songList', songList);
      songList[idx] = songData.data.updateSong;
      setSongs(songList);

    } catch(error) {
      console.log('error on adding like', error);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2> My test amplify App content</h2>
        <AmplifySignOut />      
      </header>
      <div className="songList">
        {/* in the map(), get back each song and its index(0's base)*/}
        {songs.map((song, idx) => {      
            return (
              <Paper variant="outlined" elevation={2} key={'song${idx}'}>
                <div className="songCard">
                  <IconButton aria-label="play">
                    <PlayArrowIcon />
                  </IconButton>
                  <div>
                    <div className="songTitle">{song.title}</div>
                    <div className="songOwner">{song.owner}</div>
                  </div>
                  <div>
                    <IconButton aria-label="like" onClick={() => addLike(idx)}>
                      <FavoriteIcon />
                    </IconButton>
                    {song.like}
                  </div>
                  <div className="songDescription">{song.description}</div>
                </div>
              </Paper>
            )
        })}
      </div>
    </div>
  );
}

export default withAuthenticator(App);    // code need to modify for auth
