let accToken;
const clientID = "b329e6d38c84463394954e2c44ba2d0f";
const redirectUri = "http://localhost:3000/";

const Spotify = {
    getAccessToken() {
        if (accToken) {
            return accToken;
        }
        //Check for Access Token and expiration time in URL
        const accTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accTokenMatch && expiresInMatch) {
            accToken = accTokenMatch[1];
            let expiresIn = Number(expiresInMatch[1]);
            
            //clear URL data.
            window.setTimeout(() => accToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accToken;
        } else {
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        }
    },

    search(term) {
        let accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {Authorization: `Bearer ${accessToken}`}
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if(!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },

    savePlaylist(name, trackUris) {
        if(!name || !trackUris.length) {
            return;
        }
        let accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        let userID;
        return fetch(`https://api.spotify.com/v1/me`, {headers: headers}).then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error('Request failed!');
        }, networkError => console.log(networkError.message)        
        ).then(jsonResponse => {
            userID = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                headers: headers,
                method: "POST",
                body: JSON.stringify({ name: name})
            }).then(response => {
                if(response.ok) {
                    return response.json();
                }
                throw new Error('Post failed!');
            }, networkError => console.log(networkError.message)
            ).then(jsonResponse => {
                let playlistID = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: trackUris })
                }).then(response => response.json())
                .then(jsonResponse => {
                    playlistID = jsonResponse.id;
                })
            })
        })
    }
}

export default Spotify;