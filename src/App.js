import React, { Component } from "react";
import { Observable } from "rxjs";
import styles from "./App.module.css";
import play from "./img/play2.svg";
import pause from "./img/pause.svg";
import stop from "./img/stop.svg";
import reset from "./img/history.svg";

const observable = new Observable(function subscribe(subscriber) {
  const intervalId = setInterval(() => {
    subscriber.next(1);
  }, 1000);
  return function unsubscribe() {
    clearInterval(intervalId);
  };
});

export default class App extends Component {
  state = {
    seconds: 0,
    minutes: 0,
    hourse: 0,
    _playStop: false,
  };

  startTimer = () => {
    if (
      this.subscriptions === undefined ||
      this.subscriptions.closed === true
    ) {
      this.setState({
        _playStop: true,
      });
      try {
        this.subscriptions = observable.subscribe((res) => {
          this.setState((prevState) => {
            return {
              seconds: (prevState.seconds += res),
            };
          });
        });
      } catch (err) {
        console.log(err);
      }
    } else if (this.subscriptions !== undefined) {
      this.setState({
        _playStop: false,
      });
      try {
        this.subscriptions.unsubscribe();
      } catch (err) {
        console.log();
      }
      this.setState({
        seconds: 0,
        minutes: 0,
        hourse: 0,
      });
    }
  };

  componentDidUpdate() {
    if (this.state.seconds === 59) {
      this.loopMinutes();
    }
    if (this.state.minutes === 60) {
      this.loopHourse();
    }
  }

  loopMinutes = () => {
    this.setState((prevState) => {
      return {
        seconds: 0,
        minutes: (prevState.minutes += 1),
      };
    });
  };

  loopHourse = () => {
    this.setState((prevState) => {
      return {
        minutes: 0,
        hourse: (prevState.hourse += 1),
      };
    });
  };

  pause = () => {
    this.setState({
      _playStop: false,
    });
    try {
      this.subscriptions.unsubscribe();
    } catch (err) {
      console.log();
    }
  };

  reset = () => {
    this.setState({
      minutes: 0,
      seconds: 0,
      hourse: 0,
    });
  };

  render() {
    const { hourse, seconds, minutes, _playStop } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.timer}>
          <span className={styles.element}>
            {hourse.toString().length < 2 ? `0${hourse}` : hourse}
          </span>
          <span className={styles.element}>:</span>
          <span className={styles.element}>
            {minutes.toString().length < 2 ? `0${minutes}` : minutes}
          </span>
          <span className={styles.element}>:</span>
          <span className={styles.element}>
            {seconds.toString().length < 2 ? `0${seconds}` : seconds}
          </span>
        </div>
        <div className={styles.buttons}>
          <button onClick={this.startTimer} className={styles.btn}>
            <img alt={"start"} src={_playStop === false ? play : stop}></img>
          </button>
          <button onDoubleClick={this.pause} className={styles.btn}>
            <img alt={"pause"} src={pause}></img>
          </button>
          <button onClick={this.reset} className={styles.btn}>
            <img alt={"reset"} src={reset}></img>
          </button>
        </div>
      </div>
    );
  }
}
