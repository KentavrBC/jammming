import { Component } from "react";
import "./SearchBar.css";

export class SearchBar extends Component {
    constructor(props) {
        super(props);

        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleTermChange(e) {
        this.setState({ term: e.target.value })
    }

    handleKeyPress(event) {
        if(event.key === 'Enter') {
            event.preventDefault();
            this.search();
        }
    }

    search() {
        this.props.onSearch(this.state.term);
    }

    render() {
        return (
            <div className="SearchBar">
                <input 
                placeholder="Enter A Song, Album, or Artist" 
                onChange={this.handleTermChange} onKeyPress={this.handleKeyPress} 
                />
                <button className="SearchButton" onClick={this.search}>SEARCH</button>
            </div>
        )
    }
}