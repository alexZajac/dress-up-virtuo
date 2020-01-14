/* global VIRTUO*/
'use strict';

(() => {
  const render = (actors) => {
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    const template = actors.map(actor => {
      let color = "#5faab0";
      if(actor.type === "debit")
         color = "#fc4444";
      return `
        <div class="actor-container">
          <div class="actor-text">
              <span id="actorName">${actor.who.toUpperCase()}</span>
              <span id="actorType" style="color: ${color}">${actor.type.toUpperCase()}</span>
          </div>
          <div class="actor-text">
              <span id="actorAmount">${actor.amount} EUR</span>
          </div>
        </div>
      `;
    }).join('');

    div.innerHTML = template;
    fragment.appendChild(div);
    document.querySelector('#actors').innerHTML = '';
    document.querySelector('#actors').appendChild(fragment);
  };

  const button = document.querySelector('#compute');

  button.addEventListener('click', function onClick () {
    const car = VIRTUO.getCar();
    const begin = document.querySelector("#js-beginDate").value;
    const end = document.querySelector('#js-endDate').value;
    const distance = document.querySelector('#js-distance').value;
    const option = document.querySelector('#js-option').checked;
    const actors = VIRTUO.payActors(car, begin, end, distance, option);
    render(actors);
    return;
  });
})();
