import {initState, getPoints, getLives, InitParams} from './game-data';

class GameModel {
  constructor(data) {
    this._data = data;
    this.restart();
  }

  get state() {
    return this._state;
  }

  get points() {
    return this._state.points;
  }

  get answers() {
    return this._state.answers;
  }

  get levels() {
    return this._levels;
  }

  get currentLevel() {
    return this._levels[this._state.level];
  }

  plusLevel() {
    this._state.level++;
  }

  get userResult() {
    return {
      points: this._state.points,
      lives: this._state.lives,
      time: this._state.time,
    };
  }

  addAnswer(answer) {
    const getKeys = (levelType) => this.currentLevel.question.answers.filter((it) => it.isRight).map((el) => el[levelType]);

    const isAnswerRight = (keys, answers) => {
      return (keys.toString() === answers.toString());
    };

    this._state.answers.push({isRight: isAnswerRight(getKeys(this.currentLevel.type), answer), time: initState.time - this._state.time});
    this._state.lives = getLives(this._state.answers);
    this._state.points = getPoints(this._state.answers, this._state.lives);
  }

  restart() {
    this._levels = this._data.slice(0, InitParams.LEVELS_QUANTITY);
    this._state = Object.assign({}, initState);
    this._state.answers = [];
  }

  fail() {
    return this._state.lives === 0 || this._state.time === 0;
  }

  success() {
    return this._state.level === InitParams.LEVELS_QUANTITY - 1;
  }

  tick() {
    this._state.time--;
  }


}

export default GameModel;
