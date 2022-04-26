import React from 'react';
import './App.css';

import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';

import Spotify from '../../util/Spotify';
export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: "My Playlist",
      playlistTracks: [],
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
// adiciona uma musica na lista
  addTrack(track){
    let tracks = this.state.playlistTracks;

    if(tracks.find(savedTrack => savedTrack.id === track.id)){
      return;
    }

    tracks.push(track);
    this.setState({playlistTracks: tracks})

  }

// remove uma musica na lista
  removeTrack(track){
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);

    this.setState({playlistTracks: tracks});
  }

// atualiza o nome da Playlist
  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  savePlaylist(){
    // alert("this method is linked to the button correctly");
    const trackUris = this.state.playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }

  // esse método será vinculado a API do Spotify. Atualizar o estado de searchResults com o valor resolvido da Spotify.search() promise
  search(term){
     Spotify.search(term).then(searchResults => {
       this.setState({searchResults: searchResults})
     })
  }

  render(){
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />

          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />

            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
        <div className="footer">
          <footer>By Karen Banci 2022</footer>
          <ul>
            <li>
              <a
                href="https://www.linkedin.com/in/karen-caroline-honorio-banci-198827112/"
                target="_blank"
              >
                <i class="fa-brands fa-linkedin"></i>
              </a>
            </li>
            <li>
              <a href="https://github.com/karenbanci" target="_blank">
                <i class="fa-brands fa-github-square"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    );

  }
}

export default App;
