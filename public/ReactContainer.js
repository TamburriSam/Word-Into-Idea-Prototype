"use strict";

const e = React.createElement;

class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

const domContainer = document.querySelector("#React-Container");
ReactDOM.render(e(LikeButton), domContainer);
