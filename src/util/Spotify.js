const clientId = "c44fa8ee2e744374a6e5be4b1f9835d2";
const redirectURI = "http://jammming-portfolio.surge.sh";
let accessToken;


const Spotify = {
  getAccessToken(){
// verifica se o token de acesso do usuário já está definido. Se tiver, retorne o valor salvo no token de acesso
    if(accessToken){
      return accessToken;
    }

    // checar o acesso do token
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if(accessTokenMatch && expiresInMatch){
      // definir o valor do token de acesso
      accessToken = accessTokenMatch[1];

      // variável para o tempo de expiração
      const expiresIn = Number(expiresInMatch[1]);

      // limpar os parâmetros do URL para que o aplicativo não tente pegar o token de acesso depois que expirar o tempo

      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");

      return accessToken;
    } else {
      const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = accessURL;
    }
  },

// termo de pesquisa do usuário
  search(term){
    const accessToken = Spotify.getAccessToken();

    // retorna uma promise que eventualmente será resolvida na lista de tracks da pesquisa
    // solicitação GET
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      // o segundo argumento é o cabeçalho de autorização ä solicitação que contém o token de acesso
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
      // mapeia o JSON convertido para uma matriz de faixas. A matriz mapeada deve conter uma lista de objetos de rastreamento. a partir da linha 55
    }).then(response => {
      return response.json()
      // se o JSON não tiver nenhuma faixa, retorne uma matriz vazia
    }).then(jsonResponse => {
      if (!jsonResponse.tracks){
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }))
    })
  },

  // primeiro argumento é o nome da lista de reproducao, a segunda é uma matriz de URIs da trilha
  savePlaylist(name, trackUris){
     if(!name || !trackUris.length){
       return;
     }

    //  definida para o token de acesso do usuário atual
     const accessToken = Spotify.getAccessToken();
    //  contém o token de acesso do usuário
     const headers = { Authorization: `Bearer ${accessToken}`}
    //  variável vazia para o ID do usuário
    let userId;

    // fazer uma solicitação que retorne o nome de usuário do Spotify do usuario
    return fetch("https://api.spotify.com/v1/me", { headers: headers }
    ).then(response => response.json()
    ).then(jsonResponse => {
      // após converter a resposta em JSON, save o ID na variável userId;
      userId = jsonResponse.id;

      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name : name})
      }).then(response => response.json()
      ).then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(
          `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
          {
            headers: headers,
            method: "POST",
            body: JSON.stringify({ uris: trackUris }),
          }
        );
      })
    });
  }
}

export default Spotify;
