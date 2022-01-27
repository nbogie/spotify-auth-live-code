import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios'
import { extractAccessTokenFromLocationHash } from './spotifyUtils';
function App() {

  interface Playlist {
    name: string;
  }
  interface Artist {
    name: string;
  }

  const [accessToken, setAccessToken] = useState<null | string>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [followedArtists, setFollowedArtists] = useState<Artist[]>([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const retrievedAccessToken = extractAccessTokenFromLocationHash(window.location.hash);
    window.location.hash = '';
    if (retrievedAccessToken) {
      console.log(retrievedAccessToken)
      setAccessToken(retrievedAccessToken);
      //      console.log(fetchPlaylistsFromSpotify(retrievedAccessToken));
    } else {
      console.log('no access token in hash')
    }
  }, []);



  async function fetchFollowedArtistsFromSpotify(token: string) {

    const options = { headers: { "Authorization": "Bearer " + token } }
    const reply = await axios.get('https://api.spotify.com/v1/me/following?type=artist', options);
    console.log("FOLLOWED ARTISTS: ", { data: reply.data.artists.items });
    setFollowedArtists(reply.data.artists.items);
    // setPlaylists(reply.data.playlists.items);
  }

  async function fetchPlaylistsFromSpotify(token: string) {
    const options = { headers: { "Authorization": "Bearer " + token } }
    const reply = await axios.get('https://api.spotify.com/v1/browse/featured-playlists', options);
    console.log("PLAYLISTS: ", { items: reply.data.playlists.items });

    setPlaylists(reply.data.playlists.items);

  }
  return (
    <div className="App">
      <h1 style={{ fontSize: '6rem' }}>
        Hello from live code
      </h1>

      <h2>window.location.hash is {window.location.hash}</h2>

      <h2>Access token is !!!{accessToken}!!!</h2>
      {!accessToken ?
        <a className='big'
          href="https://accounts.spotify.com/authorize?client_id=87f6db1de38b42bb831543a7f037b4bc&response_type=token&redirect_uri=http://localhost:3000&scope=user-top-read%20user-follow-read"
        >Login to Spotify</a>
        : <p>Logged in! (i found a stored access token)</p>
      }


      {accessToken &&
        <>
          <button className='big' onClick={() => fetchPlaylistsFromSpotify(accessToken)}>View Featured Playlists</button>
          <button className='big' onClick={() => fetchFollowedArtistsFromSpotify(accessToken)}>View Followed Artists</button>
        </>
      }



      <h3>Featured Playlists</h3>
      {playlists.map((playlist, ix) => (
        <div key={ix}>
          {playlist.name}
        </div>
      ))}
      <h3>Followed Artists</h3>

      {followedArtists.map((artist, ix) => (
        <div key={ix}>
          {artist.name}
        </div>
      ))}

      <h3>Counter State</h3>
      <p className='big'>{counter}</p><button onClick={() => setCounter(prev => prev + 1)}>PLUS!</button>
    </div>
  );
}

export default App;
