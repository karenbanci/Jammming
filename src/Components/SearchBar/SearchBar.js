import React from "react";
import "./SearchBar.css";

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);

// definir o estado do term da barra de pesquisa para o valor do destino do evento
    this.state ={
      term: ''
    }

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

// passar o estado do term para onSearch
  search() {
    this.props.onSearch(this.state.term);
  }

// define o estado do term para a barra de pesquisa para o valor do destino do evento
  handleTermChange(event) {
    this.setState({term: event.target.value});
  }

  render() {
    return (
      <div className="SearchBar">
        <input onChange={this.handleTermChange} placeholder="Enter A Song, Album, or Artist" />
        <button className="SearchButton" onClick={this.search} >SEARCH</button>
      </div>
    )
  }
}

export default SearchBar;
