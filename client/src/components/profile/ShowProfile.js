import React, { Component } from "react";
import Button from "@material-ui/core/Button";
// import UpdateProfile from "./UpdateProfile";
import { Link } from "react-router-dom";
import { requestTrips } from "../../services/api";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";

export default class Profile extends Component {
  state = {
    user: this.props.user,
    popularGems: [],
    trips: []
  };

  handleFollowClick(userId) {
    console.log("called");
    axios.put("/api/user/updateFollower", { id: userId });
  }

  getPopularGems = () => {
    axios.get(`api/gem/creator/${this.props.user._id}`).then((gems) => {
      console.log(gems.data);
      this.setState({
        popularGems: gems.data
      });
    });
  };

  componentDidMount = () => {
    // if (!this.state.user) {
    //   console.log("cop did", this.props.user.data);
    //   this.setState({
    //     user: this.props.user.data
    //   });
    // }
    console.log("Component Mount + User id", this.state.user);
    requestTrips(this.state.user._id)
      .then((trips) => {
        this.setState({ trips }, () => {
          console.log("Updated trips", this.state.trips);
          this.getPopularGems();
          this.showTrips();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  displayPopularGems = () => {
    return (
      <Carousel className="slider">
        {this.state.popularGems.map((gem) => (
          <Carousel.Item key={gem._id}>
            <img
              className="d-block w-100 sliderpic"
              src={gem.imageUrl}
              alt="gem"
            />
            <Carousel.Caption>
              <h3 style={{ fontWeight: 900 }}>{gem.title}</h3>
              <p style={{ fontWeight: 500 }}>{gem.locationName}</p>
              <a className="generalBtn" href={`/gem/${gem._id}`}>
                Explore
              </a>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    );
  };

  showTrips = () => {
    console.log("Here is showTrips elements:", this.state.trips);
    if (!this.state.trips) {
      return <div>No trips created yet. Start to create a Gem :)</div>;
    } else {
      return this.state.trips.map((element) => {
        return (
          <Link to={`/trip/${element._id}`}>
            <Button className="btn-triplist">{element.name} ></Button>
          </Link>
        );
      });
    }
  };

  render() {
    const user = this.props.user;
    // const isFollowing = if(!this.props.user.following.includes(this.props.user));
    if (!this.props.user)
      return (
        <>
          <p>You dont have a Profile yet. Create one ;)</p>
        </>
      );
    return (
      <>
        <div className="profile-flexbox">
          <div className="nameedit">
            <div>
              <h1>{user.username}</h1>
            </div>
            <div>
              <Button
                onClick={this.props.changeComponent}
                variant="contained"
                type="button"
              >
                Edit your profile
              </Button>
            </div>
          </div>
          <div className="headerinfo">
            <div>
              <img className="profilpic" src={user.profilePic} />
            </div>
            <div className="basiccounts">
              <p>Score: 1200</p>
              <p>Followers: 200</p>
              <p>Following: 300</p>
            </div>
          </div>
          <div className="experiences-discoveries">
            <p>Discoveries: 20</p>
            <p>Experiences: 45</p>
          </div>
          <div className="travelinterests">
            <Accordion defaultActiveKey="0">
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Travelinterests
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>{user.travelInterests}</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
          <div className="populargems">
            <h2>Most popular gems</h2>
            <div className="gemlist">{this.displayPopularGems()}</div>
          </div>
          <div className="trips">
            <h2>All Trips</h2>
            <div className="triplist">{this.showTrips()}</div>
          </div>
        </div>
        {/* <div className="ProfilePageDetails mx-auto">
          <div>
            {user.username !== user.username && (
              <Button
                className="follow-button"
                onClick={(event) => this.handleFollowClick(user._id)}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div> */}

        {/* <div>
            <img src={user.profilePic} alt="" />
          </div> */}
        {/* <div>
            <p>Score: {user.score}</p>
            <p>Followers: {user.followers}</p>
            <p>Following: {user.following}</p>
          </div>
          <div>
            <p>Dicovered: {user.discovered}</p>
            <p>Explored: {user.explored}</p>
          </div>
          <div>
            <h2>About me</h2>
            <p>{user.travelInterests}</p>
          </div>
          <div>
            <h2>Most popular gems</h2>
            {this.displayPopularGems()}
          </div>
          <h2>Trips</h2>
          <Link to={}>Trips</Link> */}
      </>
    );
  }
}
