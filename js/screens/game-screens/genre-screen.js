import {getElementFromTemplate} from '../../utils';
import showScreen from '../../show-screen';
import welcomeScreen from '../welcome-screen';
import header from './header';
import {playHandler} from '../../player';
import {gameStat, initState} from '../../data/game-data';
import {changeLevel} from '../../level-change';

const getTracks = (level) => {
  return level.question.answers.map((it, i) => `<div class="track">
    <button class="track__button track__button--play" type="button"></button>
    <div class="track__status">
      <audio src="${it.src}"></audio>
    </div>
    <div class="game__answer">
      <input class="game__input visually-hidden" type="checkbox" name="answer" value="${it.genre}" id="answer-${i}}">
      <label class="game__check" for="answer-${i}}">Отметить</label>
    </div>
  </div>`);
};

const genreScreenTemplate = (state, level) => {
  const elem = getElementFromTemplate(`
  <section class="game game--genre">
  ${header(state)}
  <section class="game__screen">

  <h2 class="game__title">${level.question.title}</h2>

  <form class="game__tracks">
  
  ${getTracks(level).join(``)}

    <button class="game__submit button" type="submit">Ответить</button>
  </form>
</section>
</section>`);

  const backBtn = elem.querySelector(`.game__back`);
  backBtn.addEventListener(`click`, () => showScreen(welcomeScreen(initState)));

  const submitBtn = elem.querySelector(`.game__submit`);
  submitBtn.disabled = `true`;

  const checkInputItems = elem.querySelectorAll(`.game__input`);
  checkInputItems.forEach((it) => {
    it.addEventListener(`click`, () => {
      if (Array.from(checkInputItems).some((item) => item.checked)) {
        submitBtn.disabled = `false`;
        submitBtn.removeAttribute(`disabled`);
      } else {
        submitBtn.disabled = `true`;
      }
    });
  });

  const tracks = elem.querySelectorAll(`.track`);

  for (let it of tracks) {
    let btn = it.querySelector(`.track__button`);
    btn.addEventListener(`click`, playHandler);
  }

  const getKeys = (currentLevel) => {
    const keys = [];

    for (let it of currentLevel.question.answers) {
      keys.push(it.isRight);
    }

    return keys;
  };

  const getAnswers = (checks) => {
    const userAnswers = [];

    for (let it of checks) {
      userAnswers.push(it.checked);
    }

    return userAnswers;
  };

  const isAnswersCorrect = (keys, answers) => {
    return (answers.toString() === keys.toString());
  };

  submitBtn.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    const checkItems = elem.querySelectorAll(`.game__input`);

    gameStat.addAnswer = {isRight: isAnswersCorrect(getKeys(level), getAnswers(checkItems)), time: 30};

    changeLevel(state);
  });

  return elem;
};

export default genreScreenTemplate;