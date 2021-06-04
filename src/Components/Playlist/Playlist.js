import { Component } from "react";
import "./Playlist.css";
import { TrackList } from "../TrackList/TrackList";

export class Playlist extends Component {
    constructor(props) {
        super(props);

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleNameChange(e) {
        this.props.onNameChange(e.target.value)
    }

    handleClick(e) {
        this.props.onSave();
        document.getElementById('input').value = "New Playlist";
    }

    render() {
        return (
            <div className="Playlist">
                <input defaultValue={"New Playlist"} id="input" onChange={this.handleNameChange}/>
                {
                    <TrackList 
                    tracks={this.props.playlistTracks} 
                    onRemove={this.props.onRemove}
                    isRemoval={true}
                    />
                }
                <button className="Playlist-save" onClick={this.handleClick}>SAVE TO SPOTIFY</button>
            </div>
        )
    }
}