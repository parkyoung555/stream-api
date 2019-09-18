(function () {
  'use strict';
  const getDataButton = document.querySelector('.get-data');
  const messageContainer = document.querySelector('.message');
  const buttonText = getDataButton.textContent || getDataButton.innerText;
  getDataButton.addEventListener('click', () => {
    let receivedCount = 0;
    let expect = 0;
    messageContainer.innerHTML = '';
    getDataButton.disabled = true;
    getDataButton.innerHTML = '<span class="spinner-grow spinner-grow-sm mr-2" role="status" aria-hidden="true"></span>Loading...';
    getData(dataChunk => {
      // Reading chunk by chunk
      console.log(dataChunk);
      if (dataChunk.expect) {
        expect = dataChunk.expect;
        messageContainer.appendChild(createMessageElement(`Expecting ${dataChunk.expect} chunk${dataChunk.expect > 1 ? 's' : ''}`));
        messageContainer.appendChild(createProgressElement());
      } else {
        messageContainer.appendChild(createCodeElement(dataChunk));
        receivedCount++;
        setProgressWidth(receivedCount / expect * 100);
      }
    }).then(res => {
      // If you want to wait until end you can get all data here
      console.log('got everything');
      console.log(res);
      getDataButton.disabled = false;
      getDataButton.innerHTML = buttonText;
      messageContainer.appendChild(createMessageElement('Got everything!'));
    });
  });

  function getData(onDataReceiveCallback) {
    return fetch('http://localhost:8000').then(res => {
      const reader = res.body.getReader();
      return new ReadableStream({
        start(controller) {
          return pump();
          function pump() {
            return reader.read().then(({ done, value }) => {
              // When no more data needs to be consumed, close the stream
              if (done) {
                controller.close();
                return;
              }
              // Enqueue the next data chunk into our target stream
              controller.enqueue(value);
              if (onDataReceiveCallback) {
                const decodedData = new TextDecoder("utf-8").decode(value);
                onDataReceiveCallback(JSON.parse(decodedData));
              }
              return pump();
            });
          }
        }
      });
    })
    .then(stream => new Response(stream))
    .then(response => response.arrayBuffer())
    .then(buffer => {
      let decodedData = new TextDecoder("utf-8").decode(buffer);
      // Turn aggregated results into array string
      decodedData = `[${decodedData.replace(/}{/g, '},{')}]`;
      // First item is always the expect count
      return JSON.parse(decodedData).splice(1);
    });
  }

  function createMessageElement(message) {
    const p = document.createElement('p');
    const t = document.createTextNode(message);
    p.appendChild(t)
    return p;
  }

  function createCodeElement(code) {
    const p = document.createElement('p');
    const c = document.createElement('code');
    const t = document.createTextNode(JSON.stringify(code));
    c.appendChild(t);
    p.appendChild(c);
    return p;
  }

  function createProgressElement() {
    const container = document.createElement('div');
    const bar = document.createElement('div');
    container.classList.add('progress');
    container.classList.add('mb-4');
    bar.classList.add('progress-bar');
    container.appendChild(bar);
    return container;
  }

  function setProgressWidth(percentage) {
    const bar = document.querySelector('.progress > .progress-bar');
    bar.style.width = `${percentage}%`;
  }
})();