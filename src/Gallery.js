import React, { Component } from "react";

const STATUS_FETCHING = "fetching";
const STATUS_FETCHED = "fetched";
const STATUS_LOADED = "loaded";

export default class extends Component {
  state = {
    urls: [],
    autoScroll: false,
    scrollInterval: null,
    loadingState: STATUS_FETCHING
  };

  componentDidMount() {
    window.addEventListener("scroll", this.onScrollHandler);
    this.fetchImages();
  }

  fetchImages = () => {
    this.setState({
      loadingState: STATUS_FETCHING
    });
    fetch("https://api.thecatapi.com/v1/images/search?limit=10", {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "4bebae0d-0ec4-4787-8e77-8602741525af"
      }
    })
      .then(data => data.json())
      .then(data => {
        const urls = [];
        data.forEach(el => {
          urls.push(el.url);
        });
        this.setState(prevState => ({
          urls: prevState.urls.concat(urls),
          loadingState: STATUS_FETCHED
        }));
      });
  };

  displayImages = () => {
    const urls = this.state.urls;
    const images = urls.map((url, index) => {
      return <img key={index} src={url} className="image" alt="Cat" />;
    });
    return images;
  };

  onScrollHandler = () => {
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
    const scrolledToBottom =
      Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if (scrolledToBottom) {
      this.fetchImages();
    }
  };

  toggleAutoScrollHandler = () => {
    this.setState({ autoScroll: !this.state.autoScroll }, () =>
      this.autoScrollHandler()
    );
  };

  autoScrollHandler = () => {
    const toggleBtn = document.querySelector(".autoscroll-btn");
    if (this.state.autoScroll) {
      toggleBtn.classList = "autoscroll-btn green";
      this.scrollBottomHandler();
      this.scrollInterval = setInterval(() => {
        this.scrollBottomHandler();
      }, 10000);
    } else {
      toggleBtn.classList = "autoscroll-btn red";
      clearInterval(this.scrollInterval);
    }
  };

  scrollBottomHandler = () => {
    document.body.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest"
    });
  };

  render() {
    return (
      <div>
        <button
          className="autoscroll-btn red"
          onClick={this.toggleAutoScrollHandler}>
          Toggle AutoScroll
        </button>
        <div
          className="images-container"
          onLoad={() => {
            this.setState({ loadingState: STATUS_LOADED });
          }}>
          {this.displayImages()}
          {this.state.loadingState !== STATUS_LOADED && (
            <div className="loader2">Loading...</div>
          )}
        </div>
      </div>
    );
  }
}
