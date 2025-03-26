import React, { Suspense, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Confidence, pageViews } from '@spotify-confidence/sdk';
import { ConfidenceProvider, ConfidenceReact, useConfidence } from '@spotify-confidence/react';

const state = {
  get input(): string {
    return document.location.hash;
  },
  set input(value: string) {
    confidence.setContext({ user_id: value });
    document.location.hash = value;
  },
};

const handleFailRequestsOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value)
  state.input = e.target.value;
};

const confidence = Confidence.create({
  clientSecret: 'wkq6f42x8n5A0qdB1emeTJxIXMxS7KIA',
  environment: 'client',
  timeout: 3000,
});

function App() {
  return (
    <ConfidenceProvider confidence={confidence}>
      <div className="container container-sm g-2">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous" />
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"></script>
      <h1>Call log</h1>
      <form className="md-3 col-4">
        <label htmlFor="username">Login as:</label>
        <input id="username" className="form-control" type="text" onChange={handleFailRequestsOnChange} />
      </form>
      <br /> 
      <Suspense fallback="Logging in...">
        <Calls />
      </Suspense>
      </div>
    </ConfidenceProvider>
  );
}

export default App;

function randomCalls(numberOfCalls : number) : any[] {
  var calls : any[] = [];
  for (var i = 0; i < numberOfCalls; i++) {
    var d = new Date();
    d.setSeconds(-Math.random() * 19465501);
    calls.push({
      callee: `+46 70${Math.floor(Math.random()*10)} ${Math.floor(Math.random()*99)} 0${Math.floor(Math.random()*10)} ${Math.floor(Math.random()*99)}`,
      time: d
    }); 
  }

  return calls;
};

function Calls() {
  const confidence = useConfidence();
  const flagData = confidence.useFlag('call-log-history', {entries: 10, "show-more-copy": "Show more"});
  const listOfCalls : any[] = randomCalls(flagData.entries).sort((c1,c2) => c2.time - c1.time);

  return (
    !document.location.hash ? <p>Please log in to see your calls</p> :
    <fieldset>
      <legend>Call history</legend>
      Showing the latest {flagData.entries} calls...
      <button className="btn btn-primary">{flagData['show-more-copy']}</button>
      <br />
      <br />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Time of call</th>
            <th scope="col">Caller</th>
          </tr>
        </thead>
        <tbody>
          {listOfCalls.map(call => (<tr><td>{call.time.toLocaleString()}</td><td>{call.callee}</td></tr>))}
        </tbody>
      </table>
    </fieldset>
  );
}
